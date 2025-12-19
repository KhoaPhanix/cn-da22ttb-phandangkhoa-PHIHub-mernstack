const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('../../src/routes/userRoutes');
const User = require('../../src/models/User');
const dbHandler = require('../db-handler');
const jwt = require('jsonwebtoken');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);

// Add error handler (matching production)
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'CastError') {
    message = 'Tài nguyên không tìm thấy';
    statusCode = 404;
  }

  if (err.code === 11000) {
    message = 'Email đã tồn tại trong hệ thống';
    statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
});

describe('User API Integration Tests', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();

    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      dob: new Date('1990-01-01'),
      gender: 'male',
    });

    // Generate auth token
    authToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.name).toBe('Test User');
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/users/me')
        .expect(401);
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        phone: '0123456789',
        address: '123 Test Street',
      };

      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.phone).toBe('0123456789');
      expect(response.body.data.address).toBe('123 Test Street');
    });

    it('should update avatar', async () => {
      const updateData = {
        avatar: 'https://example.com/avatar.jpg',
      };

      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.avatar).toBe('https://example.com/avatar.jpg');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .put('/api/users/me')
        .send({ name: 'Hacker' })
        .expect(401);
    });
  });
});
