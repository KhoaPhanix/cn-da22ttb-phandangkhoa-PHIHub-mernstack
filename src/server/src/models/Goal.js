const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    goalType: {
      type: String,
      required: true,
      enum: ['weight', 'bmi', 'bloodPressure', 'heartRate', 'sleep', 'steps', 'exercise', 'calories', 'water', 'custom'],
    },
    targetValue: {
      type: Number,
      required: true,
    },
    startValue: {
      type: Number,
      default: 0,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'failed', 'cancelled'],
      default: 'active',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    milestones: [{
      value: Number,
      date: Date,
      achieved: {
        type: Boolean,
        default: false,
      }
    }],
    reminders: {
      enabled: {
        type: Boolean,
        default: true,
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'custom'],
        default: 'daily',
      }
    }
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ targetDate: 1 });

// Virtual for calculating progress percentage
goalSchema.methods.calculateProgress = function() {
  if (this.goalType === 'weight' && this.currentValue > 0) {
    // For weight loss goals
    const totalChange = Math.abs(this.targetValue - this.startValue);
    const currentChange = Math.abs(this.currentValue - this.startValue);
    this.progress = Math.min(100, (currentChange / totalChange) * 100);
  } else if (this.currentValue > 0 && this.targetValue > 0) {
    this.progress = Math.min(100, (this.currentValue / this.targetValue) * 100);
  }
  return this.progress;
};

// Method to check if goal is achieved
goalSchema.methods.checkCompletion = function() {
  if (this.progress >= 100) {
    this.status = 'completed';
  } else if (new Date() > this.targetDate && this.progress < 100) {
    this.status = 'failed';
  }
  return this.status;
};

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
