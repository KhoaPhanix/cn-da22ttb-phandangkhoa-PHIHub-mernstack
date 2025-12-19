const Goal = require('../models/Goal');
const HealthMetric = require('../models/HealthMetric');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res) => {
  try {
    const { status, goalType } = req.query;
    
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (goalType) filter.goalType = goalType;
    
    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách mục tiêu',
      error: error.message,
    });
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mục tiêu',
      });
    }
    
    res.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin mục tiêu',
      error: error.message,
    });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
exports.createGoal = async (req, res) => {
  try {
    console.log('🔵 [Goal] Received create goal request');
    console.log('🔵 [Goal] User ID:', req.user._id);
    console.log('🔵 [Goal] Request body:', JSON.stringify(req.body, null, 2));
    
    const goalData = {
      ...req.body,
      userId: req.user._id,
    };
    
    // Get current value from latest health metric
    if (req.body.goalType && req.body.goalType !== 'custom') {
      const latestMetric = await HealthMetric.findOne({
        userId: req.user._id,
        metricType: req.body.goalType,
      }).sort({ timestamp: -1 });
      
      if (latestMetric) {
        goalData.currentValue = latestMetric.value;
        goalData.startValue = latestMetric.value;
      }
    }
    
    const goal = await Goal.create(goalData);
    console.log('✅ [Goal] Created successfully:', goal._id);
    
    res.status(201).json({
      success: true,
      message: 'Tạo mục tiêu thành công',
      data: goal,
    });
  } catch (error) {
    console.error('❌ [Goal] Error creating goal:', error.message);
    console.error('❌ [Goal] Error details:', error);
    res.status(400).json({
      success: false,
      message: 'Lỗi khi tạo mục tiêu',
      error: error.message,
    });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
exports.updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mục tiêu',
      });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      goal[key] = req.body[key];
    });
    
    // Recalculate progress
    goal.calculateProgress();
    goal.checkCompletion();
    
    await goal.save();
    
    res.json({
      success: true,
      message: 'Cập nhật mục tiêu thành công',
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật mục tiêu',
      error: error.message,
    });
  }
};

// @desc    Update goal progress
// @route   PUT /api/goals/:id/progress
// @access  Private
exports.updateGoalProgress = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mục tiêu',
      });
    }
    
    if (req.body.currentValue !== undefined) {
      goal.currentValue = req.body.currentValue;
    }
    
    goal.calculateProgress();
    goal.checkCompletion();
    
    await goal.save();
    
    res.json({
      success: true,
      message: 'Cập nhật tiến độ thành công',
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật tiến độ',
      error: error.message,
    });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mục tiêu',
      });
    }
    
    await goal.deleteOne();
    
    res.json({
      success: true,
      message: 'Xóa mục tiêu thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa mục tiêu',
      error: error.message,
    });
  }
};

// @desc    Get goal statistics
// @route   GET /api/goals/stats
// @access  Private
exports.getGoalStats = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
    
    const stats = {
      total: goals.length,
      active: goals.filter(g => g.status === 'active').length,
      completed: goals.filter(g => g.status === 'completed').length,
      failed: goals.filter(g => g.status === 'failed').length,
      averageProgress: goals.reduce((sum, g) => sum + g.progress, 0) / (goals.length || 1),
    };
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê mục tiêu',
      error: error.message,
    });
  }
};
