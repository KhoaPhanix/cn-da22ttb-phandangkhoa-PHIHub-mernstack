const express = require('express');
const router = express.Router();
const {
  getReminders,
  getReminder,
  createReminder,
  updateReminder,
  toggleReminder,
  deleteReminder,
  getUpcomingReminders,
} = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Routes
router.route('/').get(getReminders).post(createReminder);
router.route('/upcoming').get(getUpcomingReminders);
router.route('/:id').get(getReminder).put(updateReminder).delete(deleteReminder);
router.route('/:id/toggle').patch(toggleReminder);

module.exports = router;
