const asyncHandler = require('express-async-handler');
const Article = require('../models/Article');

// @desc    Lấy danh sách bài viết
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
  const { category, limit = 20, page = 1 } = req.query;

  const query = {};
  if (category) {
    query.category = category;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const articles = await Article.find(query)
    .sort({ publishedAt: -1 })
    .limit(parseInt(limit))
    .skip(skip)
    .select('-content'); // Không trả về content đầy đủ ở list view

  const total = await Article.countDocuments(query);

  res.status(200).json({
    success: true,
    count: articles.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: articles,
  });
});

// @desc    Lấy chi tiết bài viết
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    res.status(404);
    throw new Error('Bài viết không tìm thấy');
  }

  // Tăng lượt xem
  article.views += 1;
  await article.save();

  res.status(200).json({
    success: true,
    data: article,
  });
});

// @desc    Tạo bài viết mới (Admin only - để sau)
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = asyncHandler(async (req, res) => {
  const { title, content, category, excerpt, imageUrl, source } = req.body;

  const article = await Article.create({
    title,
    content,
    category,
    excerpt,
    imageUrl,
    source,
  });

  res.status(201).json({
    success: true,
    data: article,
  });
});

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
};
