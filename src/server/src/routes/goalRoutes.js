const express = require('express');
const router = express.Router();
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalStats,
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Routes
router.route('/').get(getGoals).post(createGoal);
router.route('/stats').get(getGoalStats);
router.route('/:id').get(getGoal).put(updateGoal).delete(deleteGoal);
router.route('/:id/progress').put(updateGoalProgress);

module.exports = router;
