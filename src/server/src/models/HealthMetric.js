const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    metricType: {
      type: String,
      required: true,
      enum: [
        'weight',        // Cân nặng (kg)
        'height',        // Chiều cao (cm)
        'bmi',           // BMI (tự động tính hoặc nhập thủ công)
        'bloodPressure', // Huyết áp (systolic/diastolic mmHg)
        'heartRate',     // Nhịp tim (bpm)
        'sleep',         // Giấc ngủ (hours)
        'sleepQuality',  // Chất lượng giấc ngủ (1-10)
        'steps',         // Số bước chân (steps)
        'exercise',      // Thời gian tập luyện (minutes)
        'calories',      // Lượng calo tiêu thụ (kcal)
        'water',         // Lượng nước uống (ml)
        'bloodSugar',    // Đường huyết (mg/dL)
      ],
      index: true,
    },
    value: {
      type: Number,
      required: true,
    }, 
    unit: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
      // Dùng để lưu thông tin bổ sung:
      // - bloodPressure: { systolic: 120, diastolic: 80 }
      // - sleepQuality: { deep: 3.5, light: 4.5, rem: 1.5 }
      // - exercise: { type: 'running', intensity: 'moderate' }
    },
  },
  {
    timestamps: true,
  }
);

// Compound index để query nhanh theo user + metric type + time
healthMetricSchema.index({ userId: 1, metricType: 1, timestamp: -1 });

module.exports = mongoose.model('HealthMetric', healthMetricSchema);
