const mongoose = require('mongoose');
const Nutrition = require('../../../src/models/Nutrition');
const User = require('../../../src/models/User');
const dbHandler = require('../../db-handler');

describe('Nutrition Model Test', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('Nutrition Log Creation', () => {
    it('should create a valid nutrition log', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const nutrition = await Nutrition.create({
        userId: user._id,
        date: new Date(),
        mealType: 'breakfast',
        foodItems: [
          {
            name: 'Oatmeal',
            quantity: 100,
            unit: 'g',
            calories: 350,
            macros: {
              protein: 12,
              carbs: 60,
              fats: 8,
            }
          }
        ],
      });

      expect(nutrition.mealType).toBe('breakfast');
      expect(nutrition.foodItems.length).toBe(1);
      expect(nutrition.foodItems[0].name).toBe('Oatmeal');
    });

    it('should require userId, date, mealType, and foodItems', async () => {
      const invalidNutrition = new Nutrition({
        totalCalories: 500,
      });

      await expect(invalidNutrition.save()).rejects.toThrow();
    });

    it('should only accept valid mealType enum values', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const invalidNutrition = new Nutrition({
        userId: user._id,
        date: new Date(),
        mealType: 'midnight_snack',
        foodItems: [
          {
            name: 'Pizza',
            quantity: 200,
            calories: 600,
          }
        ],
      });

      await expect(invalidNutrition.save()).rejects.toThrow();
    });

    it('should require food item fields', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const nutrition = new Nutrition({
        userId: user._id,
        date: new Date(),
        mealType: 'lunch',
        foodItems: [
          {
            name: 'Salad',
            // Missing required quantity and calories
          }
        ],
      });

      await expect(nutrition.save()).rejects.toThrow();
    });
  });

  describe('Optional Fields', () => {
    it('should create nutrition log with minimal food item data', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const nutrition = await Nutrition.create({
        userId: user._id,
        date: new Date(),
        mealType: 'snack',
        foodItems: [
          {
            name: 'Apple',
            quantity: 150,
            calories: 80,
          }
        ],
      });

      expect(nutrition.mealType).toBe('snack');
      expect(nutrition.foodItems[0].name).toBe('Apple');
      expect(nutrition.foodItems[0].macros.protein).toBe(0);
    });

    it('should allow notes field', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const nutrition = await Nutrition.create({
        userId: user._id,
        date: new Date(),
        mealType: 'dinner',
        foodItems: [
          {
            name: 'Chicken and rice',
            quantity: 300,
            calories: 500,
          }
        ],
        notes: 'Feeling satisfied',
      });

      expect(nutrition.notes).toBe('Feeling satisfied');
    });
  });

  describe('Nutrition Queries', () => {
    it('should find nutrition logs by user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await Nutrition.create([
        {
          userId: user._id,
          date: new Date(),
          mealType: 'breakfast',
          foodItems: [
            {
              name: 'Toast',
              quantity: 50,
              calories: 200,
            }
          ],
        },
        {
          userId: user._id,
          date: new Date(),
          mealType: 'lunch',
          foodItems: [
            {
              name: 'Pasta',
              quantity: 250,
              calories: 600,
            }
          ],
        },
      ]);

      const logs = await Nutrition.find({ userId: user._id });
      expect(logs.length).toBe(2);
    });

    it('should find nutrition logs by mealType', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await Nutrition.create([
        {
          userId: user._id,
          date: new Date(),
          mealType: 'breakfast',
          foodItems: [
            {
              name: 'Eggs',
              quantity: 100,
              calories: 300,
            }
          ],
        },
        {
          userId: user._id,
          date: new Date(),
          mealType: 'lunch',
          foodItems: [
            {
              name: 'Salad',
              quantity: 150,
              calories: 250,
            }
          ],
        },
      ]);

      const breakfastLogs = await Nutrition.find({ mealType: 'breakfast' });
      expect(breakfastLogs.length).toBe(1);
      expect(breakfastLogs[0].foodItems[0].name).toBe('Eggs');
    });
  });
});
