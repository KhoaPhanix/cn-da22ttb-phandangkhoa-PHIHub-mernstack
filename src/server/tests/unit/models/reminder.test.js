const mongoose = require('mongoose');
const Reminder = require('../../../src/models/Reminder');
const User = require('../../../src/models/User');
const dbHandler = require('../../db-handler');

describe('Reminder Model Test', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('Reminder Creation', () => {
    it('should create a valid reminder', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const reminder = await Reminder.create({
        userId: user._id,
        title: 'Take medication',
        message: 'Remember to take your daily medication',
        type: 'medication',
        time: '08:00',
        frequency: 'daily',
      });

      expect(reminder.title).toBe('Take medication');
      expect(reminder.type).toBe('medication');
      expect(reminder.time).toBe('08:00');
      expect(reminder.enabled).toBe(true);
    });

    it('should require userId, title, type, time, and frequency', async () => {
      const invalidReminder = new Reminder({
        title: 'Incomplete Reminder',
      });

      await expect(invalidReminder.save()).rejects.toThrow();
    });

    it('should only accept valid type enum values', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const invalidReminder = new Reminder({
        userId: user._id,
        title: 'Invalid Type',
        type: 'invalid_type',
        time: '10:00',
        frequency: 'daily',
      });

      await expect(invalidReminder.save()).rejects.toThrow();
    });

    it('should only accept valid frequency enum values', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const invalidReminder = new Reminder({
        userId: user._id,
        title: 'Invalid Frequency',
        type: 'water',
        time: '10:00',
        frequency: 'sometimes',
      });

      await expect(invalidReminder.save()).rejects.toThrow();
    });

    it('should default enabled to true', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const reminder = await Reminder.create({
        userId: user._id,
        title: 'Drink water',
        message: 'Time to drink water',
        type: 'water',
        time: '12:00',
        frequency: 'daily',
      });

      expect(reminder.enabled).toBe(true);
    });
  });

  describe('Reminder Updates', () => {
    it('should allow enabling/disabling reminders', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const reminder = await Reminder.create({
        userId: user._id,
        title: 'Exercise',
        message: 'Time for your workout',
        type: 'exercise',
        time: '18:00',
        frequency: 'daily',
      });

      reminder.enabled = false;
      await reminder.save();

      const updatedReminder = await Reminder.findById(reminder._id);
      expect(updatedReminder.enabled).toBe(false);
    });

    it('should allow updating time and frequency', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const reminder = await Reminder.create({
        userId: user._id,
        title: 'Meal prep',
        message: 'Time to prepare meals',
        type: 'meal',
        time: '10:00',
        frequency: 'daily',
      });

      reminder.time = '14:00';
      reminder.frequency = 'weekly';
      await reminder.save();

      const updatedReminder = await Reminder.findById(reminder._id);
      expect(updatedReminder.time).toBe('14:00');
      expect(updatedReminder.frequency).toBe('weekly');
    });
  });

  describe('Reminder Queries', () => {
    it('should find reminders by user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await Reminder.create([
        {
          userId: user._id,
          title: 'Reminder 1',
          message: 'Medication reminder',
          type: 'medication',
          time: '08:00',
          frequency: 'daily',
        },
        {
          userId: user._id,
          title: 'Reminder 2',
          message: 'Water reminder',
          type: 'water',
          time: '12:00',
          frequency: 'daily',
        },
      ]);

      const reminders = await Reminder.find({ userId: user._id });
      expect(reminders.length).toBe(2);
    });

    it('should find reminders by type', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await Reminder.create([
        {
          userId: user._id,
          title: 'Take pills',
          message: 'Time to take medication',
          type: 'medication',
          time: '08:00',
          frequency: 'daily',
        },
        {
          userId: user._id,
          title: 'Workout',
          message: 'Time to exercise',
          type: 'exercise',
          time: '17:00',
          frequency: 'daily',
        },
      ]);

      const medicationReminders = await Reminder.find({ type: 'medication' });
      expect(medicationReminders.length).toBe(1);
      expect(medicationReminders[0].title).toBe('Take pills');
    });

    it('should find enabled reminders', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await Reminder.create([
        {
          userId: user._id,
          title: 'Active Reminder',
          message: 'Active water reminder',
          type: 'water',
          time: '10:00',
          frequency: 'daily',
          enabled: true,
        },
        {
          userId: user._id,
          title: 'Disabled Reminder',
          message: 'Disabled exercise reminder',
          type: 'exercise',
          time: '18:00',
          frequency: 'daily',
          enabled: false,
        },
      ]);

      const enabledReminders = await Reminder.find({ enabled: true });
      expect(enabledReminders.length).toBe(1);
      expect(enabledReminders[0].title).toBe('Active Reminder');
    });
  });
});
