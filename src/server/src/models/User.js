const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    avatar: {
      type: String,
      default: 'https://ui-avatars.com/api/?name=User&background=13ec80&color=fff',
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    // Medical Information
    medicalInfo: {
      height: {
        type: Number, // in cm
      },
      bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      },
      chronicConditions: [{
        name: {
          type: String,
          required: true,
        },
        diagnosedDate: Date,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe'],
        },
        notes: String,
      }],
      allergies: [{
        allergen: {
          type: String,
          required: true,
        },
        reaction: String,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe', 'life-threatening'],
        },
      }],
      medications: [{
        name: {
          type: String,
          required: true,
        },
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date,
        purpose: String,
        prescribedBy: String,
      }],
      emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
      },
      doctor: {
        name: String,
        specialty: String,
        phone: String,
        hospital: String,
      },
    },
    // Health Goals & Preferences
    preferences: {
      targetWeight: Number,
      targetBMI: Number,
      dailyCalorieGoal: Number,
      dailyWaterGoal: {
        type: Number,
        default: 2000, // ml
      },
      dailyStepsGoal: {
        type: Number,
        default: 8000,
      },
      sleepGoal: {
        type: Number,
        default: 8, // hours
      },
      reminderSettings: {
        water: {
          enabled: Boolean,
          frequency: Number, // hours
        },
        medication: {
          enabled: Boolean,
        },
        exercise: {
          enabled: Boolean,
          time: String,
        },
        sleep: {
          enabled: Boolean,
          bedtime: String,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// So sánh mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
