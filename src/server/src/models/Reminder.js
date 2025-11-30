const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['medication', 'water', 'exercise', 'meal', 'sleep', 'measurement', 'custom'],
    },
    frequency: {
      type: String,
      required: true,
      enum: ['once', 'daily', 'weekly', 'monthly', 'custom'],
      default: 'daily',
    },
    time: {
      type: String,
      required: true,
      // Format: "HH:mm" (24-hour format)
    },
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    }],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    lastSent: {
      type: Date,
    },
    nextScheduled: {
      type: Date,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    notificationMethod: {
      type: String,
      enum: ['push', 'email', 'both'],
      default: 'push',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
reminderSchema.index({ userId: 1, enabled: 1, nextScheduled: 1 });

// Method to calculate next scheduled time
reminderSchema.methods.calculateNextScheduled = function() {
  const now = new Date();
  const [hours, minutes] = this.time.split(':').map(Number);
  
  let next = new Date();
  next.setHours(hours, minutes, 0, 0);
  
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  
  // Handle weekly recurrence
  if (this.frequency === 'weekly' && this.days && this.days.length > 0) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[next.getDay()];
    
    // Find next occurrence day
    let daysToAdd = 0;
    for (let i = 0; i < 7; i++) {
      const checkDay = dayNames[(next.getDay() + i) % 7];
      if (this.days.includes(checkDay)) {
        daysToAdd = i;
        break;
      }
    }
    
    next.setDate(next.getDate() + daysToAdd);
  }
  
  this.nextScheduled = next;
  return next;
};

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
