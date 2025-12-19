const mongoose = require('mongoose');
const Goal = require('../../../src/models/Goal');
const User = require('../../../src/models/User');
const dbHandler = require('../../db-handler');

describe('Goal Model Test', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('Goal Creation', () => {
    it('should create a valid goal', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const goal = await Goal.create({
        userId: user._id,
        title: 'Lose Weight',
        goalType: 'weight',
        targetValue: 65,
        startValue: 70,
        unit: 'kg',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });

      expect(goal.title).toBe('Lose Weight');
      expect(goal.goalType).toBe('weight');
      expect(goal.targetValue).toBe(65);
      expect(goal.status).toBe('active');
      expect(goal.progress).toBe(0);
    });

    it('should require userId, title, goalType, targetValue, unit, and targetDate', async () => {
      const invalidGoal = new Goal({
        title: 'Incomplete Goal',
      });

      await expect(invalidGoal.save()).rejects.toThrow();
    });

    it('should only accept valid goalType enum values', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const invalidGoal = new Goal({
        userId: user._id,
        title: 'Invalid Goal',
        goalType: 'invalid_type',
        targetValue: 100,
        unit: 'units',
        targetDate: new Date(),
      });

      await expect(invalidGoal.save()).rejects.toThrow();
    });

    it('should enforce progress range (0-100)', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const goal = await Goal.create({
        userId: user._id,
        title: 'Test Goal',
        goalType: 'steps',
        targetValue: 10000,
        unit: 'steps',
        targetDate: new Date(),
      });

      goal.progress = 150;
      await expect(goal.save()).rejects.toThrow();
    });
  });

  describe('Goal Status', () => {
    it('should default status to active', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const goal = await Goal.create({
        userId: user._id,
        title: 'New Goal',
        goalType: 'exercise',
        targetValue: 100,
        unit: 'minutes',
        targetDate: new Date(),
      });

      expect(goal.status).toBe('active');
    });

    it('should allow updating status', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const goal = await Goal.create({
        userId: user._id,
        title: 'Completable Goal',
        goalType: 'calories',
        targetValue: 2000,
        unit: 'kcal',
        targetDate: new Date(),
      });

      goal.status = 'completed';
      goal.progress = 100;
      await goal.save();

      const updatedGoal = await Goal.findById(goal._id);
      expect(updatedGoal.status).toBe('completed');
      expect(updatedGoal.progress).toBe(100);
    });
  });

  describe('Goal Queries', () => {
    it('should find goals by user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await Goal.create([
        {
          userId: user._id,
          title: 'Goal 1',
          goalType: 'weight',
          targetValue: 65,
          unit: 'kg',
          targetDate: new Date(),
        },
        {
          userId: user._id,
          title: 'Goal 2',
          goalType: 'steps',
          targetValue: 10000,
          unit: 'steps',
          targetDate: new Date(),
        },
      ]);

      const goals = await Goal.find({ userId: user._id });
      expect(goals.length).toBe(2);
    });

    it('should find goals by status', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await Goal.create([
        {
          userId: user._id,
          title: 'Active Goal',
          goalType: 'weight',
          targetValue: 65,
          unit: 'kg',
          targetDate: new Date(),
          status: 'active',
        },
        {
          userId: user._id,
          title: 'Completed Goal',
          goalType: 'steps',
          targetValue: 10000,
          unit: 'steps',
          targetDate: new Date(),
          status: 'completed',
        },
      ]);

      const activeGoals = await Goal.find({ status: 'active' });
      expect(activeGoals.length).toBe(1);
      expect(activeGoals[0].title).toBe('Active Goal');
    });
  });
});
