const express = require('express');
const router = express.Router();
const {
  getNutritionLogs,
  getNutritionLog,
  createNutritionLog,
  updateNutritionLog,
  deleteNutritionLog,
  getNutritionStats,
  getDailyNutrition,
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Routes
router.route('/').get(getNutritionLogs).post(createNutritionLog);
router.route('/stats').get(getNutritionStats);
router.route('/daily/:date').get(getDailyNutrition);
router.route('/:id').get(getNutritionLog).put(updateNutritionLog).delete(deleteNutritionLog);

module.exports = router;
