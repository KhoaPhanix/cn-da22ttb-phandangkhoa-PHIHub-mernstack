const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const goalRoutes = require('../../src/routes/goalRoutes');
const User = require('../../src/models/User');
const Goal = require('../../src/models/Goal');
const dbHandler = require('../db-handler');
const jwt = require('jsonwebtoken');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/goals', goalRoutes);

// Add error handler (matching production)
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'CastError') {
    message = 'Tài nguyên không tìm thấy';
    statusCode = 404;
  }

  if (err.code === 11000) {
    message = 'Dữ liệu đã tồn tại trong hệ thống';
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

describe('Goal API Integration Tests', () => {
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

  describe('POST /api/goals', () => {
    it('should create a new goal', async () => {
      const goalData = {
        title: 'Lose Weight',
        description: 'Lose 5kg in 3 months',
        goalType: 'weight',
        targetValue: 65,
        startValue: 70,
        currentValue: 70,
        unit: 'kg',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      };

      const response = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(goalData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Lose Weight');
      expect(response.body.data.goalType).toBe('weight');
      expect(response.body.data.targetValue).toBe(65);
      expect(response.body.data.status).toBe('active');
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidData = {
        title: 'Incomplete Goal',
      };

      const response = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const goalData = {
        title: 'Test Goal',
        goalType: 'steps',
        targetValue: 10000,
        unit: 'steps',
        targetDate: new Date(),
      };

      await request(app)
        .post('/api/goals')
        .send(goalData)
        .expect(401);
    });
  });

  describe('GET /api/goals', () => {
    beforeEach(async () => {
      // Create sample goals
      await Goal.create([
        {
          userId: testUser._id,
          title: 'Weight Loss Goal',
          goalType: 'weight',
          targetValue: 65,
          startValue: 70,
          currentValue: 68,
          unit: 'kg',
          targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          status: 'active',
          progress: 40,
        },
        {
          userId: testUser._id,
          title: 'Daily Steps Goal',
          goalType: 'steps',
          targetValue: 10000,
          startValue: 0,
          currentValue: 7500,
          unit: 'steps',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'active',
          progress: 75,
        },
        {
          userId: testUser._id,
          title: 'Completed Goal',
          goalType: 'exercise',
          targetValue: 100,
          startValue: 0,
          currentValue: 100,
          unit: 'minutes',
          targetDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Past date
          status: 'completed',
          progress: 100,
        },
      ]);
    });

    it('should get all goals for authenticated user', async () => {
      const response = await request(app)
        .get('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3);
    });

    it('should filter goals by status', async () => {
      const response = await request(app)
        .get('/api/goals?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(2);
      response.body.data.forEach(goal => {
        expect(goal.status).toBe('active');
      });
    });

    it('should filter goals by goalType', async () => {
      const response = await request(app)
        .get('/api/goals?goalType=weight')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].goalType).toBe('weight');
    });
  });

  describe('GET /api/goals/:id', () => {
    let goal;

    beforeEach(async () => {
      goal = await Goal.create({
        userId: testUser._id,
        title: 'Test Goal',
        goalType: 'calories',
        targetValue: 2000,
        startValue: 2500,
        currentValue: 2200,
        unit: 'kcal',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    });

    it('should get a single goal', async () => {
      const response = await request(app)
        .get(`/api/goals/${goal._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(goal._id.toString());
      expect(response.body.data.title).toBe('Test Goal');
    });

    it('should return 404 for non-existent goal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .get(`/api/goals/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/goals/:id', () => {
    let goal;

    beforeEach(async () => {
      goal = await Goal.create({
        userId: testUser._id,
        title: 'Original Goal',
        goalType: 'water',
        targetValue: 2000,
        startValue: 0,
        currentValue: 1500,
        unit: 'ml',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    });

    it('should update a goal', async () => {
      const updateData = {
        title: 'Updated Goal',
        currentValue: 1800,
        progress: 90,
      };

      const response = await request(app)
        .put(`/api/goals/${goal._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Goal');
      expect(response.body.data.currentValue).toBe(1800);
    });

    it('should return 404 for non-existent goal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .put(`/api/goals/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('should return 404 if user does not own the goal', async () => {
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
        .put(`/api/goals/${goal._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hacked' })
        .expect(404);
    });
  });

  describe('DELETE /api/goals/:id', () => {
    let goal;

    beforeEach(async () => {
      goal = await Goal.create({
        userId: testUser._id,
        title: 'Goal to Delete',
        goalType: 'bmi',
        targetValue: 22,
        startValue: 25,
        currentValue: 24,
        unit: 'kg/m²',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
    });

    it('should delete a goal', async () => {
      const response = await request(app)
        .delete(`/api/goals/${goal._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      const deletedGoal = await Goal.findById(goal._id);
      expect(deletedGoal).toBeNull();
    });

    it('should return 404 for non-existent goal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .delete(`/api/goals/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
