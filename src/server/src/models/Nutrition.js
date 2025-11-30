const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    mealType: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    },
    foodItems: [{
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        default: 'g',
      },
      calories: {
        type: Number,
        required: true,
      },
      macros: {
        protein: {
          type: Number,
          default: 0,
        },
        carbs: {
          type: Number,
          default: 0,
        },
        fats: {
          type: Number,
          default: 0,
        },
        fiber: {
          type: Number,
          default: 0,
        }
      },
      micronutrients: {
        vitaminA: Number,
        vitaminC: Number,
        vitaminD: Number,
        calcium: Number,
        iron: Number,
        sodium: Number,
      }
    }],
    totalCalories: {
      type: Number,
      default: 0,
    },
    totalMacros: {
      protein: {
        type: Number,
        default: 0,
      },
      carbs: {
        type: Number,
        default: 0,
      },
      fats: {
        type: Number,
        default: 0,
      },
      fiber: {
        type: Number,
        default: 0,
      }
    },
    notes: {
      type: String,
      trim: true,
    },
    photos: [String],
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient date-based queries
nutritionSchema.index({ userId: 1, date: -1 });

// Pre-save hook to calculate totals
nutritionSchema.pre('save', function(next) {
  if (this.foodItems && this.foodItems.length > 0) {
    this.totalCalories = this.foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);
    
    this.totalMacros.protein = this.foodItems.reduce((sum, item) => sum + (item.macros?.protein || 0), 0);
    this.totalMacros.carbs = this.foodItems.reduce((sum, item) => sum + (item.macros?.carbs || 0), 0);
    this.totalMacros.fats = this.foodItems.reduce((sum, item) => sum + (item.macros?.fats || 0), 0);
    this.totalMacros.fiber = this.foodItems.reduce((sum, item) => sum + (item.macros?.fiber || 0), 0);
  }
  next();
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

module.exports = Nutrition;
