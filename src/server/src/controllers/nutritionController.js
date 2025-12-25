const Nutrition = require('../models/Nutrition');

// @desc    Get nutrition logs
// @route   GET /api/nutrition
// @access  Private
exports.getNutritionLogs = async (req, res) => {
  try {
    const { startDate, endDate, mealType } = req.query;
    
    const filter = { userId: req.user._id };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    if (mealType) filter.mealType = mealType;
    
    const logs = await Nutrition.find(filter).sort({ date: -1 });
    
    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy nhật ký dinh dưỡng',
      error: error.message,
    });
  }
};

// @desc    Get single nutrition log
// @route   GET /api/nutrition/:id
// @access  Private
exports.getNutritionLog = async (req, res) => {
  try {
    const log = await Nutrition.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhật ký',
      });
    }
    
    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy nhật ký dinh dưỡng',
      error: error.message,
    });
  }
};

// @desc    Create nutrition log
// @route   POST /api/nutrition
// @access  Private
exports.createNutritionLog = async (req, res) => {
  try {
    const logData = {
      ...req.body,
      userId: req.user._id,
    };
    
    const log = await Nutrition.create(logData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo nhật ký dinh dưỡng thành công',
      data: log,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi tạo nhật ký dinh dưỡng',
      error: error.message,
    });
  }
};

// @desc    Update nutrition log
// @route   PUT /api/nutrition/:id
// @access  Private
exports.updateNutritionLog = async (req, res) => {
  try {
    let log = await Nutrition.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhật ký',
      });
    }
    
    Object.keys(req.body).forEach(key => {
      log[key] = req.body[key];
    });
    
    await log.save();
    
    res.json({
      success: true,
      message: 'Cập nhật nhật ký thành công',
      data: log,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật nhật ký',
      error: error.message,
    });
  }
};

// @desc    Delete nutrition log
// @route   DELETE /api/nutrition/:id
// @access  Private
exports.deleteNutritionLog = async (req, res) => {
  try {
    const log = await Nutrition.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhật ký',
      });
    }
    
    await log.deleteOne();
    
    res.json({
      success: true,
      message: 'Xóa nhật ký thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa nhật ký',
      error: error.message,
    });
  }
};

// @desc    Get nutrition statistics
// @route   GET /api/nutrition/stats
// @access  Private
exports.getNutritionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const days = parseInt(req.query.days) || 7;
    
    let dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    } else {
      const start = new Date();
      start.setDate(start.getDate() - days);
      dateFilter.$gte = start;
    }
    
    const logs = await Nutrition.find({
      userId: req.user._id,
      date: dateFilter,
    });
    
    const stats = {
      totalCalories: logs.reduce((sum, log) => sum + (log.totalCalories || 0), 0),
      avgCaloriesPerDay: logs.reduce((sum, log) => sum + (log.totalCalories || 0), 0) / (logs.length || 1),
      totalProtein: logs.reduce((sum, log) => sum + (log.totalMacros?.protein || 0), 0),
      totalCarbs: logs.reduce((sum, log) => sum + (log.totalMacros?.carbs || 0), 0),
      totalFats: logs.reduce((sum, log) => sum + (log.totalMacros?.fats || 0), 0),
      totalFiber: logs.reduce((sum, log) => sum + (log.totalMacros?.fiber || 0), 0),
      mealDistribution: {
        breakfast: logs.filter(l => l.mealType === 'breakfast').length,
        lunch: logs.filter(l => l.mealType === 'lunch').length,
        dinner: logs.filter(l => l.mealType === 'dinner').length,
        snack: logs.filter(l => l.mealType === 'snack').length,
      },
    };
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê dinh dưỡng',
      error: error.message,
    });
  }
};

// @desc    Get daily nutrition summary
// @route   GET /api/nutrition/daily/:date
// @access  Private
exports.getDailyNutrition = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const logs = await Nutrition.find({
      userId: req.user._id,
      date: {
        $gte: date,
        $lt: nextDay,
      },
    });
    
    const summary = {
      date: date,
      totalCalories: logs.reduce((sum, log) => sum + (log.totalCalories || 0), 0),
      totalMacros: {
        protein: logs.reduce((sum, log) => sum + (log.totalMacros?.protein || 0), 0),
        carbs: logs.reduce((sum, log) => sum + (log.totalMacros?.carbs || 0), 0),
        fats: logs.reduce((sum, log) => sum + (log.totalMacros?.fats || 0), 0),
        fiber: logs.reduce((sum, log) => sum + (log.totalMacros?.fiber || 0), 0),
      },
      meals: logs,
    };
    
    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy tổng kết dinh dưỡng hàng ngày',
      error: error.message,
    });
  }
};
