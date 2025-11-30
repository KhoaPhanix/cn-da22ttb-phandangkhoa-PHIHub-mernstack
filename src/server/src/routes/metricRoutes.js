const express = require('express');
const router = express.Router();
const {
  getMetrics,
  createMetric,
  getMetricStats,
  deleteMetric,
} = require('../controllers/metricsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMetrics).post(protect, createMetric);
router.get('/stats', protect, getMetricStats);
router.delete('/:id', protect, deleteMetric);

module.exports = router;
