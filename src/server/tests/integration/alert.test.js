const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Alert = require('../../src/models/Alert');
const dbHandler = require('../db-handler');
const jwt = require('jsonwebtoken');

describe('Alert API Integration Tests', () => {
  let authCookie;
  let userId;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();

    // Create test user and get auth token
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });
    userId = user._id;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    authCookie = `token=${token}`;
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('GET /api/alerts', () => {
    it('should get all alerts for authenticated user', async () => {
      await Alert.create([
        {
          userId,
          type: 'warning',
          category: 'health_metric',
          title: 'High blood pressure',
          message: 'Your blood pressure is too high',
          severity: 'high',
        },
        {
          userId,
          type: 'info',
          category: 'goal',
          title: 'Goal reminder',
          message: 'You are close to your goal',
          severity: 'low',
        },
      ]);

      const res = await request(app)
        .get('/api/alerts')
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data.length).toBe(2);
    });

    it('should filter alerts by severity', async () => {
      await Alert.create([
        {
          userId,
          type: 'danger',
          category: 'health_metric',
          title: 'Critical alert',
          message: 'Emergency',
          severity: 'critical',
        },
        {
          userId,
          type: 'info',
          category: 'goal',
          title: 'Info alert',
          message: 'Information',
          severity: 'low',
        },
      ]);

      const res = await request(app)
        .get('/api/alerts?severity=critical')
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].severity).toBe('critical');
    });

    it('should filter alerts by category', async () => {
      await Alert.create([
        {
          userId,
          type: 'warning',
          category: 'health_metric',
          title: 'Health alert',
          message: 'Check your health',
          severity: 'medium',
        },
        {
          userId,
          type: 'info',
          category: 'reminder',
          title: 'Reminder alert',
          message: 'Take your medication',
          severity: 'low',
        },
      ]);

      const res = await request(app)
        .get('/api/alerts?category=health_metric')
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].category).toBe('health_metric');
    });

    it('should filter alerts by read status', async () => {
      await Alert.create([
        {
          userId,
          type: 'info',
          category: 'goal',
          title: 'Unread alert',
          message: 'Not yet read',
          severity: 'low',
          isRead: false,
        },
        {
          userId,
          type: 'info',
          category: 'goal',
          title: 'Read alert',
          message: 'Already read',
          severity: 'low',
          isRead: true,
        },
      ]);

      const res = await request(app)
        .get('/api/alerts?isRead=false')
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].isRead).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/alerts');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/alerts/unread/count', () => {
    it('should get unread alerts count', async () => {
      await Alert.create([
        {
          userId,
          type: 'info',
          category: 'goal',
          title: 'Alert 1',
          message: 'Message 1',
          severity: 'low',
          isRead: false,
        },
        {
          userId,
          type: 'info',
          category: 'goal',
          title: 'Alert 2',
          message: 'Message 2',
          severity: 'low',
          isRead: false,
        },
        {
          userId,
          type: 'info',
          category: 'goal',
          title: 'Alert 3',
          message: 'Message 3',
          severity: 'low',
          isRead: true,
        },
      ]);

      const res = await request(app)
        .get('/api/alerts/unread/count')
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBe(2);
    });
  });

  describe('PATCH /api/alerts/:id/read', () => {
    it('should mark alert as read', async () => {
      const alert = await Alert.create({
        userId,
        type: 'info',
        category: 'goal',
        title: 'Test alert',
        message: 'Test message',
        severity: 'low',
        isRead: false,
      });

      const res = await request(app)
        .patch(`/api/alerts/${alert._id}/read`)
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isRead).toBe(true);
    });

    it('should return 404 for non-existent alert', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/alerts/${fakeId}/read`)
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/alerts/read-all', () => {
    it('should mark all alerts as read', async () => {
      await Alert.create([
        {
          userId,
          type: 'info',
          category: 'goal',
          title: 'Alert 1',
          message: 'Message 1',
          severity: 'low',
          isRead: false,
        },
        {
          userId,
          type: 'info',
          category: 'goal',
          title: 'Alert 2',
          message: 'Message 2',
          severity: 'low',
          isRead: false,
        },
      ]);

      const res = await request(app)
        .patch('/api/alerts/read-all')
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify all alerts are read
      const alerts = await Alert.find({ userId });
      expect(alerts.every(alert => alert.isRead)).toBe(true);
    });
  });

  describe('DELETE /api/alerts/:id', () => {
    it('should delete an alert', async () => {
      const alert = await Alert.create({
        userId,
        type: 'info',
        category: 'goal',
        title: 'Test alert',
        message: 'Test message',
        severity: 'low',
      });

      const res = await request(app)
        .delete(`/api/alerts/${alert._id}`)
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify alert is deleted
      const deletedAlert = await Alert.findById(alert._id);
      expect(deletedAlert).toBeNull();
    });

    it('should return 404 for non-existent alert', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/alerts/${fakeId}`)
        .set('Cookie', [authCookie])
        .set('Authorization', `Bearer ${authCookie.split('=')[1]}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
