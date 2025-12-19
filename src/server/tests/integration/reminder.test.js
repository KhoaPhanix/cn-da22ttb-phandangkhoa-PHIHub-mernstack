const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const reminderRoutes = require('../../src/routes/reminderRoutes');
const User = require('../../src/models/User');
const Reminder = require('../../src/models/Reminder');
const dbHandler = require('../db-handler');
const jwt = require('jsonwebtoken');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/reminders', reminderRoutes);

// Add error handler (matching production)
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'CastError') {
    message = 'Tài nguyên không tìm thấy';
    statusCode = 404;
  }

  if (err.code === 11000) {
    message = 'Dữ liệu đã tồn tại';
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

describe('Reminder API Integration Tests', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();

    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    authToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('POST /api/reminders', () => {
    it('should create a new reminder', async () => {
      const reminderData = {
        title: 'Take Medication',
        message: 'Remember to take your vitamins',
        type: 'medication',
        frequency: 'daily',
        time: '08:00',
      };

      const response = await request(app)
        .post('/api/reminders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reminderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Take Medication');
      expect(response.body.data.type).toBe('medication');
      expect(response.body.data.enabled).toBe(true);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidData = {
        title: 'Incomplete Reminder',
      };

      await request(app)
        .post('/api/reminders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should return 401 without authentication', async () => {
      const reminderData = {
        title: 'Test',
        message: 'Test',
        type: 'water',
        frequency: 'daily',
        time: '10:00',
      };

      await request(app)
        .post('/api/reminders')
        .send(reminderData)
        .expect(401);
    });
  });

  describe('GET /api/reminders', () => {
    beforeEach(async () => {
      await Reminder.create([
        {
          userId: testUser._id,
          title: 'Medication Reminder',
          message: 'Take vitamins',
          type: 'medication',
          frequency: 'daily',
          time: '08:00',
          enabled: true,
        },
        {
          userId: testUser._id,
          title: 'Water Reminder',
          message: 'Drink water',
          type: 'water',
          frequency: 'daily',
          time: '10:00',
          enabled: true,
        },
        {
          userId: testUser._id,
          title: 'Exercise Reminder',
          message: 'Time to exercise',
          type: 'exercise',
          frequency: 'weekly',
          time: '18:00',
          enabled: false,
        },
      ]);
    });

    it('should get all reminders for authenticated user', async () => {
      const response = await request(app)
        .get('/api/reminders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3);
      expect(response.body.count).toBe(3);
    });

    it('should filter reminders by type', async () => {
      const response = await request(app)
        .get('/api/reminders?type=medication')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter reminders by enabled status', async () => {
      const response = await request(app)
        .get('/api/reminders?enabled=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/reminders/:id', () => {
    let reminder;

    beforeEach(async () => {
      reminder = await Reminder.create({
        userId: testUser._id,
        title: 'Test Reminder',
        message: 'Test message',
        type: 'meal',
        frequency: 'daily',
        time: '12:00',
      });
    });

    it('should get a single reminder', async () => {
      const response = await request(app)
        .get(`/api/reminders/${reminder._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(reminder._id.toString());
      expect(response.body.data.title).toBe('Test Reminder');
    });

    it('should return 404 for non-existent reminder', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .get(`/api/reminders/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/reminders/:id', () => {
    let reminder;

    beforeEach(async () => {
      reminder = await Reminder.create({
        userId: testUser._id,
        title: 'Original Title',
        message: 'Original message',
        type: 'sleep',
        frequency: 'daily',
        time: '22:00',
        enabled: true,
      });
    });

    it('should update a reminder', async () => {
      const updateData = {
        title: 'Updated Title',
        message: 'Updated message',
        time: '23:00',
      };

      const response = await request(app)
        .put(`/api/reminders/${reminder._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.time).toBe('23:00');
    });

    it('should toggle reminder enabled status', async () => {
      const updateData = {
        enabled: false,
      };

      const response = await request(app)
        .put(`/api/reminders/${reminder._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.enabled).toBe(false);
    });

    it('should return 404 for non-existent reminder', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .put(`/api/reminders/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('should return 404 if user does not own the reminder', async () => {
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
        .put(`/api/reminders/${reminder._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hacked' })
        .expect(404);
    });
  });

  describe('DELETE /api/reminders/:id', () => {
    let reminder;

    beforeEach(async () => {
      reminder = await Reminder.create({
        userId: testUser._id,
        title: 'To Delete',
        message: 'Delete me',
        type: 'custom',
        frequency: 'once',
        time: '15:00',
      });
    });

    it('should delete a reminder', async () => {
      const response = await request(app)
        .delete(`/api/reminders/${reminder._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      const deletedReminder = await Reminder.findById(reminder._id);
      expect(deletedReminder).toBeNull();
    });

    it('should return 404 for non-existent reminder', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .delete(`/api/reminders/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
