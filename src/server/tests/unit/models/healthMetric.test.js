const mongoose = require('mongoose');
const HealthMetric = require('../../../src/models/HealthMetric');
const User = require('../../../src/models/User');
const dbHandler = require('../../db-handler');

describe('HealthMetric Model Test', () => {
  let testUser;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();
    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('Metric Creation', () => {
    it('should create a valid health metric', async () => {
      const metricData = {
        userId: testUser._id,
        metricType: 'weight',
        value: 70,
        unit: 'kg',
        timestamp: new Date(),
      };

      const metric = await HealthMetric.create(metricData);

      expect(metric._id).toBeDefined();
      expect(metric.metricType).toBe('weight');
      expect(metric.value).toBe(70);
      expect(metric.unit).toBe('kg');
    });

    it('should require userId, metricType, value, and unit', async () => {
      const invalidMetric = new HealthMetric({
        metricType: 'weight',
        value: 70,
      });

      let err;
      try {
        await invalidMetric.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should accept valid metric types', async () => {
      const validTypes = ['weight', 'height', 'bmi', 'bloodPressure', 'heartRate', 'sleep', 'steps'];

      for (const type of validTypes) {
        const metric = await HealthMetric.create({
          userId: testUser._id,
          metricType: type,
          value: 100,
          unit: 'unit',
        });

        expect(metric.metricType).toBe(type);
      }
    });
  });

  describe('Metric Types', () => {
    it('should store blood pressure correctly', async () => {
      const metric = await HealthMetric.create({
        userId: testUser._id,
        metricType: 'bloodPressure',
        value: 120,
        unit: 'mmHg',
        notes: '120/80',
      });

      expect(metric.metricType).toBe('bloodPressure');
      expect(metric.value).toBe(120);
      expect(metric.notes).toBe('120/80');
    });

    it('should store heart rate correctly', async () => {
      const metric = await HealthMetric.create({
        userId: testUser._id,
        metricType: 'heartRate',
        value: 72,
        unit: 'bpm',
      });

      expect(metric.metricType).toBe('heartRate');
      expect(metric.value).toBe(72);
      expect(metric.unit).toBe('bpm');
    });

    it('should store steps correctly', async () => {
      const metric = await HealthMetric.create({
        userId: testUser._id,
        metricType: 'steps',
        value: 10000,
        unit: 'steps',
      });

      expect(metric.value).toBe(10000);
    });
  });

  describe('Timestamp and Queries', () => {
    it('should default timestamp to now if not provided', async () => {
      const metric = await HealthMetric.create({
        userId: testUser._id,
        metricType: 'weight',
        value: 70,
        unit: 'kg',
      });

      expect(metric.timestamp).toBeDefined();
      expect(metric.timestamp).toBeInstanceOf(Date);
    });

    it('should find metrics by user', async () => {
      await HealthMetric.create({
        userId: testUser._id,
        metricType: 'weight',
        value: 70,
        unit: 'kg',
      });

      await HealthMetric.create({
        userId: testUser._id,
        metricType: 'height',
        value: 175,
        unit: 'cm',
      });

      const metrics = await HealthMetric.find({ userId: testUser._id });
      expect(metrics.length).toBe(2);
    });

    it('should find metrics by type', async () => {
      await HealthMetric.create({
        userId: testUser._id,
        metricType: 'weight',
        value: 70,
        unit: 'kg',
      });

      await HealthMetric.create({
        userId: testUser._id,
        metricType: 'weight',
        value: 71,
        unit: 'kg',
      });

      const weightMetrics = await HealthMetric.find({
        userId: testUser._id,
        metricType: 'weight',
      });

      expect(weightMetrics.length).toBe(2);
    });
  });

  describe('Notes and Additional Data', () => {
    it('should store notes', async () => {
      const metric = await HealthMetric.create({
        userId: testUser._id,
        metricType: 'weight',
        value: 70,
        unit: 'kg',
        notes: 'Measured in the morning',
      });

      expect(metric.notes).toBe('Measured in the morning');
    });

    it('should store notes with spaces', async () => {
      const metric = await HealthMetric.create({
        userId: testUser._id,
        metricType: 'weight',
        value: 70,
        unit: 'kg',
        notes: '  Extra spaces  ',
      });

      expect(metric.notes).toBe('  Extra spaces  ');
    });
  });
});
