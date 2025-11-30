const asyncHandler = require('express-async-handler');
const HealthMetric = require('../models/HealthMetric');

// @desc    Lấy danh sách metrics
// @route   GET /api/metrics
// @access  Private
const getMetrics = asyncHandler(async (req, res) => {
  const { metricType, startDate, endDate, limit = 1000 } = req.query;

  // Build query
  const query = { userId: req.user._id };

  if (metricType) {
    query.metricType = metricType;
  }

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) {
      query.timestamp.$gte = new Date(startDate);
    }
    if (endDate) {
      query.timestamp.$lte = new Date(endDate);
    }
  }

  const metrics = await HealthMetric.find(query)
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: metrics.length,
    data: metrics,
  });
});

// @desc    Tạo metric mới
// @route   POST /api/metrics
// @access  Private
const createMetric = asyncHandler(async (req, res) => {
  const { metricType, value, unit, timestamp, notes } = req.body;

  // Validate required fields
  if (!metricType || !value || !unit) {
    res.status(400);
    throw new Error('Vui lòng nhập đầy đủ thông tin: metricType, value, unit');
  }

  const metric = await HealthMetric.create({
    userId: req.user._id,
    metricType,
    value,
    unit,
    timestamp: timestamp || Date.now(),
    notes,
  });

  res.status(201).json({
    success: true,
    data: metric,
  });
});

// @desc    Lấy thống kê metrics (trung bình, min, max, latest, change)
// @route   GET /api/metrics/stats
// @access  Private
const getMetricStats = asyncHandler(async (req, res) => {
  const { metricType, days = 7 } = req.query;

  if (!metricType) {
    res.status(400);
    throw new Error('Vui lòng chỉ định metricType');
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  // Get stats
  const stats = await HealthMetric.aggregate([
    {
      $match: {
        userId: req.user._id,
        metricType,
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        average: { $avg: '$value' },
        min: { $min: '$value' },
        max: { $max: '$value' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Get latest value
  const latestMetric = await HealthMetric.findOne({
    userId: req.user._id,
    metricType,
  }).sort({ timestamp: -1 });

  // Get oldest value in range for change calculation
  const oldestMetric = await HealthMetric.findOne({
    userId: req.user._id,
    metricType,
    timestamp: { $gte: startDate },
  }).sort({ timestamp: 1 });

  const result = stats[0] || { average: 0, min: 0, max: 0, count: 0 };
  result.latest = latestMetric ? latestMetric.value : 0;
  result.change = oldestMetric && latestMetric 
    ? latestMetric.value - oldestMetric.value 
    : 0;

  res.status(200).json({
    success: true,
    data: result,
  });
});

// @desc    Xóa metric
// @route   DELETE /api/metrics/:id
// @access  Private
const deleteMetric = asyncHandler(async (req, res) => {
  const metric = await HealthMetric.findById(req.params.id);

  if (!metric) {
    res.status(404);
    throw new Error('Metric không tìm thấy');
  }

  // Kiểm tra quyền sở hữu
  if (metric.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Không có quyền xóa metric này');
  }

  await metric.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Đã xóa metric',
  });
});

module.exports = {
  getMetrics,
  createMetric,
  getMetricStats,
  deleteMetric,
};
