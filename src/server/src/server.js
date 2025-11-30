require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const metricRoutes = require('./routes/metricRoutes');
const articleRoutes = require('./routes/articleRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const goalRoutes = require('./routes/goalRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const moodRoutes = require('./routes/moodRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Cho phép gửi cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (avatars)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🏥 PHIHub API - Personal Health Intelligence Hub',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      metrics: '/api/metrics',
      articles: '/api/articles',
      recommendations: '/api/recommendations',
      goals: '/api/goals',
      nutrition: '/api/nutrition',
      mood: '/api/mood',
      reminders: '/api/reminders',
      alerts: '/api/alerts',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/alerts', alertRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🏥  PHIHub API Server Running                      ║
║   📡  Port: ${PORT}                                     ║
║   🌍  Environment: ${process.env.NODE_ENV}                      ║
║   🔗  http://localhost:${PORT}                        ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});
