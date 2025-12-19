const mongoose = require('mongoose');
const User = require('../../../src/models/User');
const dbHandler = require('../../db-handler');

describe('User Model Test', () => {
  // Connect to in-memory database before tests
  beforeAll(async () => {
    await dbHandler.connect();
  });

  // Clear database after each test
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  // Close database connection after tests
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('User Creation', () => {
    it('should create a valid user successfully', async () => {
      const validUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        dob: new Date('1990-01-01'),
        gender: 'male',
      };

      const user = new User(validUser);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(validUser.name);
      expect(savedUser.email).toBe(validUser.email);
      expect(savedUser.password).not.toBe(validUser.password); // Should be hashed
    });

    it('should fail without required fields', async () => {
      const userWithoutEmail = new User({
        name: 'Test User',
        password: 'Password123!',
      });

      let err;
      try {
        await userWithoutEmail.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.email).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      await new User(userData).save();

      let err;
      try {
        await new User(userData).save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.code).toBe(11000); // Duplicate key error
    });

    it('should fail with invalid email format', async () => {
      const userWithInvalidEmail = new User({
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123!',
      });

      let err;
      try {
        await userWithInvalidEmail.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.email).toBeDefined();
    });
  });

  describe('Password Methods', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'Password123!';
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: plainPassword,
      });

      await user.save();
      expect(user.password).not.toBe(plainPassword);
      expect(user.password.length).toBeGreaterThan(20);
    });

    it('should correctly match password', async () => {
      const plainPassword = 'Password123!';
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: plainPassword,
      });

      await user.save();

      const isMatch = await user.matchPassword(plainPassword);
      expect(isMatch).toBe(true);

      const isNotMatch = await user.matchPassword('WrongPassword');
      expect(isNotMatch).toBe(false);
    });
  });

  describe('User Profile', () => {
    it('should update profile information', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      user.medicalInfo = {
        height: 175,
        bloodType: 'O+',
      };
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.medicalInfo.height).toBe(175);
      expect(updatedUser.medicalInfo.bloodType).toBe('O+');
    });

    it('should set and retrieve avatar', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      user.avatar = '/uploads/avatars/test.jpg';
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.avatar).toBe('/uploads/avatars/test.jpg');
    });
  });
});

