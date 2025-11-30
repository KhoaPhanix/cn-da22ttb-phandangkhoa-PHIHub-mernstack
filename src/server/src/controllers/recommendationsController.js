const asyncHandler = require('express-async-handler');
const { generateRecommendations } = require('../services/recommendationService');

// @desc    Lấy khuyến nghị sức khỏe
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await generateRecommendations(req.user._id);

  res.status(200).json({
    success: true,
    count: recommendations.length,
    data: recommendations,
  });
});

module.exports = {
  getRecommendations,
};
