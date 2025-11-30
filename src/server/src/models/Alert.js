const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['warning', 'danger', 'info', 'success'],
    },
    category: {
      type: String,
      required: true,
      enum: ['health_metric', 'goal', 'reminder', 'system'],
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
    severity: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    metricType: {
      type: String,
      enum: ['weight', 'bmi', 'bloodPressure', 'heartRate', 'sleep', 'steps', 'exercise', 'calories', 'water', 'bloodSugar'],
    },
    metricValue: {
      type: Number,
    },
    threshold: {
      min: Number,
      max: Number,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    actionRequired: {
      type: Boolean,
      default: false,
    },
    actionLink: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
alertSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
alertSchema.index({ userId: 1, severity: 1, isResolved: 1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create health metric alert
alertSchema.statics.createHealthAlert = async function(userId, metricType, value, thresholds) {
  let type = 'info';
  let severity = 'low';
  let message = '';
  
  // Determine alert based on metric type and value
  switch (metricType) {
    case 'bloodPressure':
      if (value > 140 || value < 90) {
        type = 'danger';
        severity = 'high';
        message = `Huyết áp của bạn đang ở mức ${value > 140 ? 'cao' : 'thấp'} (${value} mmHg). Bạn nên liên hệ bác sĩ.`;
      } else if (value > 130 || value < 100) {
        type = 'warning';
        severity = 'medium';
        message = `Huyết áp của bạn đang ở mức cần chú ý (${value} mmHg).`;
      }
      break;
      
    case 'heartRate':
      if (value > 100 || value < 60) {
        type = 'warning';
        severity = 'medium';
        message = `Nhịp tim của bạn đang ở mức ${value > 100 ? 'cao' : 'thấp'} (${value} bpm).`;
      }
      break;
      
    case 'bmi':
      if (value > 30 || value < 18.5) {
        type = 'warning';
        severity = 'medium';
        message = `Chỉ số BMI của bạn là ${value.toFixed(1)}, nằm ngoài khoảng bình thường.`;
      }
      break;
      
    case 'sleep':
      if (value < 6) {
        type = 'warning';
        severity = 'medium';
        message = `Bạn chỉ ngủ ${value} giờ. Cố gắng ngủ đủ 7-9 giờ mỗi đêm.`;
      }
      break;
  }
  
  if (message) {
    return await this.create({
      userId,
      type,
      category: 'health_metric',
      title: `Cảnh báo ${metricType}`,
      message,
      severity,
      metricType,
      metricValue: value,
      threshold: thresholds,
      actionRequired: severity === 'high' || severity === 'critical',
    });
  }
  
  return null;
};

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
