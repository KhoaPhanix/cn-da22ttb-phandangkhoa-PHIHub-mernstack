const express = require('express');
const router = express.Router();
const {
  getAlerts,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  resolveAlert,
  deleteAlert,
  createAlert,
  checkHealthMetrics,
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Routes
router.route('/').get(getAlerts).post(createAlert);
router.route('/unread/count').get(getUnreadCount);
router.route('/read-all').patch(markAllAsRead);
router.route('/check-health').post(checkHealthMetrics);
router.route('/:id/read').patch(markAsRead);
router.route('/:id/resolve').patch(resolveAlert);
router.route('/:id').delete(deleteAlert);

module.exports = router;
