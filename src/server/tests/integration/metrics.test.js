const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const metricRoutes = require('../../src/routes/metricRoutes');
const User = require('../../src/models/User');
const HealthMetric = require('../../src/models/HealthMetric');
const dbHandler = require('../db-handler');
const jwt = require('jsonwebtoken');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/metrics', metricRoutes);

// Add error handler (matching production)
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    message = 'Tài nguyên không tìm thấy';
    statusCode = 404;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    message = 'Email đã tồn tại trong hệ thống';
    statusCode = 400;
  }

  // Mongoose Validation Error
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

describe('Metrics API Integration Tests', () => {
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

  describe('POST /api/metrics', () => {
    it('should create a new metric with valid data', async () => {
      const metricData = {
        metricType: 'weight',
        value: 70,
        unit: 'kg',
        timestamp: new Date().toISOString(),
        notes: 'Morning weight',
      };

      const response = await request(app)
        .post('/api/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send(metricData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.metricType).toBe('weight');
      expect(response.body.data.value).toBe(70);
      expect(response.body.data.userId).toBe(testUser._id.toString());
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidData = {
        metricType: 'weight',
        // Missing value and unit
      };

      const response = await request(app)
        .post('/api/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const metricData = {
        metricType: 'weight',
        value: 70,
        unit: 'kg',
      };

      await request(app)
        .post('/api/metrics')
        .send(metricData)
        .expect(401);
    });
  });

  describe('GET /api/metrics', () => {
    beforeEach(async () => {
      // Create test metrics
      await HealthMetric.create([
        {
          userId: testUser._id,
          metricType: 'weight',
          value: 70,
          unit: 'kg',
          timestamp: new Date('2025-01-01'),
        },
        {
          userId: testUser._id,
          metricType: 'height',
          value: 175,
          unit: 'cm',
          timestamp: new Date('2025-01-02'),
        },
        {
          userId: testUser._id,
          metricType: 'weight',
          value: 71,
          unit: 'kg',
          timestamp: new Date('2025-01-03'),
        },
      ]);
    });

    it('should get all metrics for authenticated user', async () => {
      const response = await request(app)
        .get('/api/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3);
    });

    it('should filter metrics by type', async () => {
      const response = await request(app)
        .get('/api/metrics?metricType=weight')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(2);
      response.body.data.forEach(metric => {
        expect(metric.metricType).toBe('weight');
      });
    });

    it('should filter metrics by date range', async () => {
      const response = await request(app)
        .get('/api/metrics?startDate=2025-01-02&endDate=2025-01-03')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should limit number of results', async () => {
      const response = await request(app)
        .get('/api/metrics?limit=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe('PUT /api/metrics/:id', () => {
    let metricId;

    beforeEach(async () => {
      const metric = await HealthMetric.create({
        userId: testUser._id,
        metricType: 'weight',
        value: 70,
        unit: 'kg',
      });
      metricId = metric._id;
    });

    it('should update a metric', async () => {
      const updateData = {
        value: 72,
        notes: 'Updated weight',
      };

      const response = await request(app)
        .put(`/api/metrics/${metricId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.value).toBe(72);
      expect(response.body.data.notes).toBe('Updated weight');
    });

    it('should return 404 for non-existent metric', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .put(`/api/metrics/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ value: 72 })
        .expect(404);
    });

    it('should return 403 if user does not own the metric', async () => {
      // Create another user
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'Password123!',
      });

      const otherToken = jwt.sign(
        { id: otherUser._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      await request(app)
        .put(`/api/metrics/${metricId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ value: 72 })
        .expect(403);
    });
  });

  describe('DELETE /api/metrics/:id', () => {
    let metricId;

    beforeEach(async () => {
      const metric = await HealthMetric.create({
        userId: testUser._id,
        metricType: 'weight',
        value: 70,
        unit: 'kg',
      });
      metricId = metric._id;
    });

    it('should delete a metric', async () => {
      const response = await request(app)
        .delete(`/api/metrics/${metricId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify metric is deleted
      const deletedMetric = await HealthMetric.findById(metricId);
      expect(deletedMetric).toBeNull();
    });

    it('should return 404 for non-existent metric', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .delete(`/api/metrics/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('GET /api/metrics/stats', () => {
    beforeEach(async () => {
      // Create sample heartRate metrics for stats test
      // Use recent dates (within last 7 days)
      const today = new Date();
      const dates = [1, 2, 3, 4, 5];
      for (const day of dates) {
        const timestamp = new Date(today);
        timestamp.setDate(today.getDate() - day);
        await HealthMetric.create({
          userId: testUser._id,
          metricType: 'heartRate',
          value: 70 + day,
          unit: 'bpm',
          timestamp,
        });
      }
    });

    it('should get statistics for a metric type', async () => {
      const response = await request(app)
        .get('/api/metrics/stats?metricType=heartRate&days=7')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.average).toBeDefined();
      expect(response.body.data.min).toBeDefined();
      expect(response.body.data.max).toBeDefined();
      expect(response.body.data.count).toBeGreaterThan(0);
    });

    it('should return 400 without metricType', async () => {
      await request(app)
        .get('/api/metrics/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });
});
