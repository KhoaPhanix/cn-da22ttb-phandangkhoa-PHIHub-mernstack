const Alert = require('../models/Alert');
const HealthMetric = require('../models/HealthMetric');

// @desc    Get all alerts for user
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
  try {
    const { isRead, severity, category } = req.query;
    
    const filter = { userId: req.user._id };
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (severity) filter.severity = severity;
    if (category) filter.category = category;
    
    const alerts = await Alert.find(filter).sort({ createdAt: -1 }).limit(50);
    
    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách cảnh báo',
      error: error.message,
    });
  }
};

// @desc    Get unread alerts count
// @route   GET /api/alerts/unread/count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Alert.countDocuments({
      userId: req.user._id,
      isRead: false,
    });
    
    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đếm cảnh báo chưa đọc',
      error: error.message,
    });
  }
};

// @desc    Mark alert as read
// @route   PATCH /api/alerts/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cảnh báo',
      });
    }
    
    alert.isRead = true;
    await alert.save();
    
    res.json({
      success: true,
      message: 'Đánh dấu đã đọc thành công',
      data: alert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật cảnh báo',
      error: error.message,
    });
  }
};

// @desc    Mark all alerts as read
// @route   PATCH /api/alerts/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Alert.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    
    res.json({
      success: true,
      message: 'Đánh dấu tất cả đã đọc thành công',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật cảnh báo',
      error: error.message,
    });
  }
};

// @desc    Resolve alert
// @route   PATCH /api/alerts/:id/resolve
// @access  Private
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cảnh báo',
      });
    }
    
    alert.isResolved = true;
    alert.isRead = true;
    await alert.save();
    
    res.json({
      success: true,
      message: 'Giải quyết cảnh báo thành công',
      data: alert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi giải quyết cảnh báo',
      error: error.message,
    });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cảnh báo',
      });
    }
    
    await alert.deleteOne();
    
    res.json({
      success: true,
      message: 'Xóa cảnh báo thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa cảnh báo',
      error: error.message,
    });
  }
};

// @desc    Create manual alert
// @route   POST /api/alerts
// @access  Private
exports.createAlert = async (req, res) => {
  try {
    const alertData = {
      ...req.body,
      userId: req.user._id,
    };
    
    const alert = await Alert.create(alertData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo cảnh báo thành công',
      data: alert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi tạo cảnh báo',
      error: error.message,
    });
  }
};

// @desc    Check health metrics and create alerts if needed
// @route   POST /api/alerts/check-health
// @access  Private
exports.checkHealthMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    const alerts = [];
    
    // Check recent blood pressure
    const recentBP = await HealthMetric.findOne({
      userId,
      metricType: 'bloodPressure',
    }).sort({ timestamp: -1 });
    
    if (recentBP) {
      const alert = await Alert.createHealthAlert(userId, 'bloodPressure', recentBP.value, {
        min: 90,
        max: 140,
      });
      if (alert) alerts.push(alert);
    }
    
    // Check recent heart rate
    const recentHR = await HealthMetric.findOne({
      userId,
      metricType: 'heartRate',
    }).sort({ timestamp: -1 });
    
    if (recentHR) {
      const alert = await Alert.createHealthAlert(userId, 'heartRate', recentHR.value, {
        min: 60,
        max: 100,
      });
      if (alert) alerts.push(alert);
    }
    
    // Check recent BMI
    const recentBMI = await HealthMetric.findOne({
      userId,
      metricType: 'bmi',
    }).sort({ timestamp: -1 });
    
    if (recentBMI) {
      const alert = await Alert.createHealthAlert(userId, 'bmi', recentBMI.value, {
        min: 18.5,
        max: 30,
      });
      if (alert) alerts.push(alert);
    }
    
    // Check recent sleep
    const recentSleep = await HealthMetric.findOne({
      userId,
      metricType: 'sleep',
    }).sort({ timestamp: -1 });
    
    if (recentSleep) {
      const alert = await Alert.createHealthAlert(userId, 'sleep', recentSleep.value, {
        min: 7,
      });
      if (alert) alerts.push(alert);
    }
    
    res.json({
      success: true,
      message: `Đã kiểm tra và tạo ${alerts.length} cảnh báo`,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra chỉ số sức khỏe',
      error: error.message,
    });
  }
};
