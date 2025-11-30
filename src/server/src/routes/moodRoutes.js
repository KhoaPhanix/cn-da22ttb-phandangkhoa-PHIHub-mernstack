const express = require('express');
const router = express.Router();
const {
  getMoodLogs,
  getMoodLog,
  createMoodLog,
  updateMoodLog,
  deleteMoodLog,
  getMoodStats,
} = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Routes
router.route('/').get(getMoodLogs).post(createMoodLog);
router.route('/stats').get(getMoodStats);
router.route('/:id').get(getMoodLog).put(updateMoodLog).delete(deleteMoodLog);

module.exports = router;
