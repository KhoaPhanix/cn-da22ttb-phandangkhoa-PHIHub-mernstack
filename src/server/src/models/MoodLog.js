const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema(
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
      default: Date.now,
      index: true,
    },
    mood: {
      type: String,
      required: true,
      enum: ['excellent', 'good', 'okay', 'bad', 'terrible'],
    },
    moodScore: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    energy: {
      type: String,
      enum: ['very_high', 'high', 'medium', 'low', 'very_low'],
    },
    energyScore: {
      type: Number,
      min: 1,
      max: 10,
    },
    stress: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'very_high'],
    },
    stressScore: {
      type: Number,
      min: 1,
      max: 10,
    },
    anxiety: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    activities: [{
      type: String,
      enum: ['work', 'exercise', 'social', 'family', 'hobby', 'meditation', 'relaxation', 'other'],
    }],
    emotions: [{
      type: String,
      enum: ['happy', 'sad', 'angry', 'anxious', 'excited', 'tired', 'motivated', 'grateful', 'frustrated', 'peaceful'],
    }],
    triggers: [{
      type: String,
    }],
    journal: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    gratitude: [{
      type: String,
      trim: true,
    }],
    sleepQuality: {
      type: Number,
      min: 1,
      max: 10,
    },
    socialInteraction: {
      type: String,
      enum: ['none', 'minimal', 'moderate', 'high'],
    },
    productivity: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
moodLogSchema.index({ userId: 1, date: -1 });

// Method to get mood trend
moodLogSchema.statics.getMoodTrend = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const moods = await this.find({
    userId,
    date: { $gte: startDate },
  }).sort({ date: 1 });
  
  return moods;
};

const MoodLog = mongoose.model('MoodLog', moodLogSchema);

module.exports = MoodLog;
