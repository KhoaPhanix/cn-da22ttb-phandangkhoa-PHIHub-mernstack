const mongoose = require('mongoose');
const MoodLog = require('../../../src/models/MoodLog');
const User = require('../../../src/models/User');
const dbHandler = require('../../db-handler');

describe('MoodLog Model Test', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('Mood Log Creation', () => {
    it('should create a valid mood log', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const moodLog = await MoodLog.create({
        userId: user._id,
        mood: 'good',
        moodScore: 8,
      });

      expect(moodLog.userId).toEqual(user._id);
      expect(moodLog.mood).toBe('good');
      expect(moodLog.moodScore).toBe(8);
      expect(moodLog.date).toBeDefined();
    });

    it('should require userId, mood, and moodScore', async () => {
      const invalidLog = new MoodLog({
        mood: 'good',
      });

      await expect(invalidLog.save()).rejects.toThrow();
    });

    it('should only accept valid mood enum values', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const invalidLog = new MoodLog({
        userId: user._id,
        mood: 'invalid_mood',
        moodScore: 5,
      });

      await expect(invalidLog.save()).rejects.toThrow();
    });

    it('should enforce moodScore range (1-10)', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const invalidLog = new MoodLog({
        userId: user._id,
        mood: 'okay',
        moodScore: 15,
      });

      await expect(invalidLog.save()).rejects.toThrow();
    });
  });

  describe('Mood Log Queries', () => {
    it('should find mood logs by user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await MoodLog.create([
        { userId: user._id, mood: 'good', moodScore: 8 },
        { userId: user._id, mood: 'okay', moodScore: 5 },
      ]);

      const logs = await MoodLog.find({ userId: user._id });
      expect(logs.length).toBe(2);
    });

    it('should find mood logs by mood type', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await MoodLog.create([
        { userId: user._id, mood: 'good', moodScore: 8 },
        { userId: user._id, mood: 'excellent', moodScore: 10 },
        { userId: user._id, mood: 'okay', moodScore: 5 },
      ]);

      const goodMoods = await MoodLog.find({ mood: 'good' });
      expect(goodMoods.length).toBe(1);
      expect(goodMoods[0].mood).toBe('good');
    });
  });
});
