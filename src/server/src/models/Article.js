const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Dinh dưỡng', 'Thể chất', 'Tinh thần', 'Chung'],
      default: 'Chung',
    },
    excerpt: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    },
    source: {
      type: String,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Article', articleSchema);
