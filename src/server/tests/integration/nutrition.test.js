const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const nutritionRoutes = require('../../src/routes/nutritionRoutes');
const User = require('../../src/models/User');
const Nutrition = require('../../src/models/Nutrition');
const dbHandler = require('../db-handler');
const jwt = require('jsonwebtoken');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/nutrition', nutritionRoutes);

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

describe('Nutrition API Integration Tests', () => {
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

  describe('POST /api/nutrition', () => {
    it('should create a new nutrition log', async () => {
      const nutritionData = {
        date: new Date(),
        mealType: 'breakfast',
        foodItems: [
          {
            name: 'Phở',
            quantity: 1,
            unit: 'bowl',
            calories: 350,
            macros: {
              protein: 15,
              carbs: 50,
              fats: 10,
              fiber: 2,
            },
          },
        ],
      };

      const response = await request(app)
        .post('/api/nutrition')
        .set('Authorization', `Bearer ${authToken}`)
        .send(nutritionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.mealType).toBe('breakfast');
      expect(response.body.data.foodItems.length).toBe(1);
      expect(response.body.data.foodItems[0].name).toBe('Phở');
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidData = {
        mealType: 'breakfast',
      };

      const response = await request(app)
        .post('/api/nutrition')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const nutritionData = {
        date: new Date(),
        mealType: 'lunch',
        foodItems: [],
      };

      await request(app)
        .post('/api/nutrition')
        .send(nutritionData)
        .expect(401);
    });
  });

  describe('GET /api/nutrition', () => {
    beforeEach(async () => {
      // Create sample nutrition logs
      await Nutrition.create([
        {
          userId: testUser._id,
          date: new Date('2024-12-10'),
          mealType: 'breakfast',
          foodItems: [
            {
              name: 'Bánh mì',
              quantity: 1,
              unit: 'piece',
              calories: 250,
              macros: { protein: 8, carbs: 40, fats: 5, fiber: 2 },
            },
          ],
        },
        {
          userId: testUser._id,
          date: new Date('2024-12-11'),
          mealType: 'lunch',
          foodItems: [
            {
              name: 'Cơm gà',
              quantity: 1,
              unit: 'plate',
              calories: 450,
              macros: { protein: 25, carbs: 60, fats: 12, fiber: 3 },
            },
          ],
        },
        {
          userId: testUser._id,
          date: new Date('2024-12-12'),
          mealType: 'dinner',
          foodItems: [
            {
              name: 'Bún chả',
              quantity: 1,
              unit: 'bowl',
              calories: 400,
              macros: { protein: 20, carbs: 55, fats: 10, fiber: 2 },
            },
          ],
        },
      ]);
    });

    it('should get all nutrition logs for authenticated user', async () => {
      const response = await request(app)
        .get('/api/nutrition')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3);
      expect(response.body.count).toBe(3);
    });

    it('should filter nutrition logs by mealType', async () => {
      const response = await request(app)
        .get('/api/nutrition?mealType=breakfast')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].mealType).toBe('breakfast');
    });

    it('should filter nutrition logs by date range', async () => {
      const response = await request(app)
        .get('/api/nutrition?startDate=2024-12-11&endDate=2024-12-12')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/nutrition/:id', () => {
    let nutritionLog;

    beforeEach(async () => {
      nutritionLog = await Nutrition.create({
        userId: testUser._id,
        date: new Date(),
        mealType: 'breakfast',
        foodItems: [
          {
            name: 'Test Food',
            quantity: 100,
            unit: 'g',
            calories: 150,
            macros: { protein: 5, carbs: 20, fats: 3, fiber: 1 },
          },
        ],
      });
    });

    it('should get a single nutrition log', async () => {
      const response = await request(app)
        .get(`/api/nutrition/${nutritionLog._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(nutritionLog._id.toString());
      expect(response.body.data.mealType).toBe('breakfast');
    });

    it('should return 404 for non-existent nutrition log', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .get(`/api/nutrition/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/nutrition/:id', () => {
    let nutritionLog;

    beforeEach(async () => {
      nutritionLog = await Nutrition.create({
        userId: testUser._id,
        date: new Date(),
        mealType: 'lunch',
        foodItems: [
          {
            name: 'Original Food',
            quantity: 100,
            unit: 'g',
            calories: 200,
            macros: { protein: 10, carbs: 25, fats: 5, fiber: 2 },
          },
        ],
      });
    });

    it('should update a nutrition log', async () => {
      const updateData = {
        mealType: 'dinner',
        foodItems: [
          {
            name: 'Updated Food',
            quantity: 150,
            unit: 'g',
            calories: 250,
            macros: { protein: 12, carbs: 30, fats: 8, fiber: 3 },
          },
        ],
      };

      const response = await request(app)
        .put(`/api/nutrition/${nutritionLog._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.mealType).toBe('dinner');
      expect(response.body.data.foodItems[0].name).toBe('Updated Food');
    });

    it('should return 404 for non-existent nutrition log', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .put(`/api/nutrition/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ mealType: 'dinner' })
        .expect(404);
    });

    it('should return 403 if user does not own the log', async () => {
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
        .put(`/api/nutrition/${nutritionLog._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ mealType: 'dinner' })
        .expect(404); // Returns 404 because it can't find log for this user
    });
  });

  describe('DELETE /api/nutrition/:id', () => {
    let nutritionLog;

    beforeEach(async () => {
      nutritionLog = await Nutrition.create({
        userId: testUser._id,
        date: new Date(),
        mealType: 'snack',
        foodItems: [
          {
            name: 'Snack Item',
            quantity: 50,
            unit: 'g',
            calories: 100,
            macros: { protein: 2, carbs: 15, fats: 3, fiber: 1 },
          },
        ],
      });
    });

    it('should delete a nutrition log', async () => {
      const response = await request(app)
        .delete(`/api/nutrition/${nutritionLog._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      const deletedLog = await Nutrition.findById(nutritionLog._id);
      expect(deletedLog).toBeNull();
    });

    it('should return 404 for non-existent nutrition log', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .delete(`/api/nutrition/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
