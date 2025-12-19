require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
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
}

module.exports = app;
