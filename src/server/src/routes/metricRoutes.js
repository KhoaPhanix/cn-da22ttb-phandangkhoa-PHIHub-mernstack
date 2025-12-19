const express = require('express');
const router = express.Router();
const {
  getMetrics,
  createMetric,
  getMetricStats,
  updateMetric,
  deleteMetric,
} = require('../controllers/metricsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMetrics).post(protect, createMetric);
router.get('/stats', protect, getMetricStats);
router.route('/:id').put(protect, updateMetric).delete(protect, deleteMetric);

module.exports = router;
