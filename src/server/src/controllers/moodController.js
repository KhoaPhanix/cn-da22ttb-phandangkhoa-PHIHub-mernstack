const MoodLog = require('../models/MoodLog');

// @desc    Get mood logs
// @route   GET /api/mood
// @access  Private
exports.getMoodLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const days = parseInt(req.query.days) || 30;
    
    const filter = { userId: req.user._id };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    } else {
      const start = new Date();
      start.setDate(start.getDate() - days);
      filter.date = { $gte: start };
    }
    
    const logs = await MoodLog.find(filter).sort({ date: -1 });
    
    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy nhật ký tâm trạng',
      error: error.message,
    });
  }
};

// @desc    Get single mood log
// @route   GET /api/mood/:id
// @access  Private
exports.getMoodLog = async (req, res) => {
  try {
    const log = await MoodLog.findOne({
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
      message: 'Lỗi khi lấy nhật ký tâm trạng',
      error: error.message,
    });
  }
};

// @desc    Create mood log
// @route   POST /api/mood
// @access  Private
exports.createMoodLog = async (req, res) => {
  try {
    const logData = {
      ...req.body,
      userId: req.user._id,
    };
    
    const log = await MoodLog.create(logData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo nhật ký tâm trạng thành công',
      data: log,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi tạo nhật ký tâm trạng',
      error: error.message,
    });
  }
};

// @desc    Update mood log
// @route   PUT /api/mood/:id
// @access  Private
exports.updateMoodLog = async (req, res) => {
  try {
    let log = await MoodLog.findOne({
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

// @desc    Delete mood log
// @route   DELETE /api/mood/:id
// @access  Private
exports.deleteMoodLog = async (req, res) => {
  try {
    const log = await MoodLog.findOne({
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

// @desc    Get mood statistics and trends
// @route   GET /api/mood/stats
// @access  Private
exports.getMoodStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const logs = await MoodLog.find({
      userId: req.user._id,
      date: { $gte: startDate },
    }).sort({ date: 1 });
    
    if (logs.length === 0) {
      return res.json({
        success: true,
        data: {
          averageMood: 0,
          averageEnergy: 0,
          averageStress: 0,
          totalLogs: 0,
        },
      });
    }
    
    const stats = {
      totalLogs: logs.length,
      averageMood: logs.reduce((sum, log) => sum + log.moodScore, 0) / logs.length,
      averageEnergy: logs.reduce((sum, log) => sum + (log.energyScore || 0), 0) / logs.length,
      averageStress: logs.reduce((sum, log) => sum + (log.stressScore || 0), 0) / logs.length,
      averageAnxiety: logs.reduce((sum, log) => sum + (log.anxiety || 0), 0) / logs.length,
      moodDistribution: {
        excellent: logs.filter(l => l.mood === 'excellent').length,
        good: logs.filter(l => l.mood === 'good').length,
        okay: logs.filter(l => l.mood === 'okay').length,
        bad: logs.filter(l => l.mood === 'bad').length,
        terrible: logs.filter(l => l.mood === 'terrible').length,
      },
      commonEmotions: getTopEmotions(logs),
      commonActivities: getTopActivities(logs),
      trend: calculateMoodTrend(logs),
    };
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê tâm trạng',
      error: error.message,
    });
  }
};

// Helper function to get top emotions
function getTopEmotions(logs) {
  const emotionCounts = {};
  logs.forEach(log => {
    if (log.emotions) {
      log.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    }
  });
  
  return Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([emotion, count]) => ({ emotion, count }));
}

// Helper function to get top activities
function getTopActivities(logs) {
  const activityCounts = {};
  logs.forEach(log => {
    if (log.activities) {
      log.activities.forEach(activity => {
        activityCounts[activity] = (activityCounts[activity] || 0) + 1;
      });
    }
  });
  
  return Object.entries(activityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([activity, count]) => ({ activity, count }));
}

// Helper function to calculate mood trend
function calculateMoodTrend(logs) {
  if (logs.length < 2) return 'stable';
  
  const firstHalf = logs.slice(0, Math.floor(logs.length / 2));
  const secondHalf = logs.slice(Math.floor(logs.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, log) => sum + log.moodScore, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, log) => sum + log.moodScore, 0) / secondHalf.length;
  
  const diff = secondAvg - firstAvg;
  
  if (diff > 0.5) return 'improving';
  if (diff < -0.5) return 'declining';
  return 'stable';
}
