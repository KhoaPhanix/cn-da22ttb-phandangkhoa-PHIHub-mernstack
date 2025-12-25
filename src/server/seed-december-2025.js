/**
 * Seed December 2025 Data - REALISTIC VERSION
 * Dữ liệu sức khỏe thực tế cho một nam giới 30 tuổi
 * Thời gian: 1/12/2025 - 25/12/2025
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const User = require('./src/models/User');
const HealthMetric = require('./src/models/HealthMetric');
const Goal = require('./src/models/Goal');
const Nutrition = require('./src/models/Nutrition');
const MoodLog = require('./src/models/MoodLog');
const Reminder = require('./src/models/Reminder');
const Alert = require('./src/models/Alert');

// Helper functions
function getDate(day, hour = 8, minute = 0) {
  return new Date(2025, 11, day, hour, minute, 0);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

// Dữ liệu thực tế cho một người đang cải thiện sức khỏe
const REALISTIC_DATA = {
  // Cân nặng bắt đầu 78kg, mục tiêu giảm xuống 75kg
  weight: {
    start: 78.0,
    dailyChange: -0.07, // Giảm khoảng 0.5kg/tuần
    variance: 0.4
  },
  // Huyết áp - đang cao nhẹ, cần cải thiện
  bloodPressure: {
    systolicStart: 138,
    diastolicStart: 88,
    dailyImprovement: 0.25,
    variance: 5
  },
  // Nhịp tim nghỉ ngơi
  heartRate: {
    base: 72,
    variance: 5,
    dailyImprovement: 0.1
  },
  // Giấc ngủ
  sleep: {
    base: 6.5,
    dailyImprovement: 0.04,
    variance: 0.8
  },
  // Số bước chân
  steps: {
    base: 6500,
    dailyImprovement: 100,
    variance: 2000
  },
  // Nước uống (lít)
  water: {
    base: 1.8,
    dailyImprovement: 0.02,
    variance: 0.4
  }
};

// Thực đơn Việt Nam thực tế
const VIETNAMESE_MEALS = {
  breakfast: [
    {
      name: 'Phở bò tái',
      foods: [
        { name: 'Phở bò tái', amount: 1, unit: 'tô vừa', calories: 380, protein: 25, carbs: 48, fat: 10 }
      ]
    },
    {
      name: 'Bánh mì trứng ốp la',
      foods: [
        { name: 'Bánh mì trứng ốp la', amount: 1, unit: 'ổ', calories: 350, protein: 14, carbs: 42, fat: 14 },
        { name: 'Cà phê sữa đá', amount: 1, unit: 'ly', calories: 120, protein: 2, carbs: 22, fat: 3 }
      ]
    },
    {
      name: 'Xôi gà',
      foods: [
        { name: 'Xôi gà', amount: 1, unit: 'phần', calories: 420, protein: 20, carbs: 55, fat: 15 }
      ]
    },
    {
      name: 'Cháo gà',
      foods: [
        { name: 'Cháo gà', amount: 1, unit: 'tô', calories: 280, protein: 18, carbs: 35, fat: 8 }
      ]
    },
    {
      name: 'Bánh cuốn',
      foods: [
        { name: 'Bánh cuốn nhân thịt', amount: 1, unit: 'phần', calories: 320, protein: 15, carbs: 45, fat: 9 },
        { name: 'Trà đá', amount: 1, unit: 'ly', calories: 0, protein: 0, carbs: 0, fat: 0 }
      ]
    },
    {
      name: 'Hủ tiếu',
      foods: [
        { name: 'Hủ tiếu Nam Vang', amount: 1, unit: 'tô', calories: 400, protein: 22, carbs: 50, fat: 12 }
      ]
    },
    {
      name: 'Bánh canh',
      foods: [
        { name: 'Bánh canh cua', amount: 1, unit: 'tô', calories: 360, protein: 20, carbs: 45, fat: 11 }
      ]
    }
  ],
  lunch: [
    {
      name: 'Cơm văn phòng',
      foods: [
        { name: 'Cơm trắng', amount: 1, unit: 'chén', calories: 200, protein: 4, carbs: 45, fat: 0 },
        { name: 'Thịt kho trứng', amount: 1, unit: 'phần', calories: 250, protein: 18, carbs: 8, fat: 16 },
        { name: 'Rau muống xào tỏi', amount: 1, unit: 'đĩa nhỏ', calories: 60, protein: 3, carbs: 6, fat: 3 },
        { name: 'Canh bí đỏ', amount: 1, unit: 'chén', calories: 45, protein: 2, carbs: 10, fat: 0 }
      ]
    },
    {
      name: 'Bún bò Huế',
      foods: [
        { name: 'Bún bò Huế', amount: 1, unit: 'tô', calories: 480, protein: 28, carbs: 52, fat: 18 },
        { name: 'Rau sống', amount: 1, unit: 'đĩa', calories: 15, protein: 1, carbs: 3, fat: 0 }
      ]
    },
    {
      name: 'Cơm gà Hội An',
      foods: [
        { name: 'Cơm gà Hội An', amount: 1, unit: 'phần', calories: 520, protein: 32, carbs: 58, fat: 16 },
        { name: 'Canh rau', amount: 1, unit: 'chén', calories: 35, protein: 2, carbs: 6, fat: 1 }
      ]
    },
    {
      name: 'Mì Quảng',
      foods: [
        { name: 'Mì Quảng', amount: 1, unit: 'tô', calories: 450, protein: 25, carbs: 55, fat: 14 },
        { name: 'Bánh tráng mè', amount: 2, unit: 'cái', calories: 60, protein: 1, carbs: 12, fat: 1 }
      ]
    },
    {
      name: 'Cơm tấm sườn',
      foods: [
        { name: 'Cơm tấm sườn bì chả', amount: 1, unit: 'phần', calories: 650, protein: 35, carbs: 65, fat: 25 }
      ]
    },
    {
      name: 'Bún chả Hà Nội',
      foods: [
        { name: 'Bún chả', amount: 1, unit: 'phần', calories: 480, protein: 26, carbs: 48, fat: 20 },
        { name: 'Trà đá', amount: 1, unit: 'ly', calories: 0, protein: 0, carbs: 0, fat: 0 }
      ]
    }
  ],
  dinner: [
    {
      name: 'Cơm gia đình',
      foods: [
        { name: 'Cơm trắng', amount: 1, unit: 'chén', calories: 200, protein: 4, carbs: 45, fat: 0 },
        { name: 'Cá kho tộ', amount: 1, unit: 'phần', calories: 180, protein: 22, carbs: 6, fat: 8 },
        { name: 'Rau luộc chấm mắm', amount: 1, unit: 'đĩa', calories: 40, protein: 2, carbs: 6, fat: 1 },
        { name: 'Canh chua', amount: 1, unit: 'chén', calories: 55, protein: 4, carbs: 8, fat: 1 }
      ]
    },
    {
      name: 'Lẩu thái nhẹ',
      foods: [
        { name: 'Lẩu thái hải sản', amount: 1, unit: 'phần', calories: 380, protein: 35, carbs: 25, fat: 15 },
        { name: 'Mì lẩu', amount: 0.5, unit: 'gói', calories: 90, protein: 2, carbs: 18, fat: 1 }
      ]
    },
    {
      name: 'Cơm chiên dương châu',
      foods: [
        { name: 'Cơm chiên dương châu', amount: 1, unit: 'đĩa', calories: 550, protein: 18, carbs: 65, fat: 24 }
      ]
    },
    {
      name: 'Bún riêu',
      foods: [
        { name: 'Bún riêu cua', amount: 1, unit: 'tô', calories: 350, protein: 20, carbs: 45, fat: 10 },
        { name: 'Rau sống', amount: 1, unit: 'đĩa', calories: 15, protein: 1, carbs: 3, fat: 0 }
      ]
    },
    {
      name: 'Cơm thịt nướng',
      foods: [
        { name: 'Cơm trắng', amount: 1, unit: 'chén', calories: 200, protein: 4, carbs: 45, fat: 0 },
        { name: 'Thịt heo nướng', amount: 1, unit: 'phần', calories: 280, protein: 25, carbs: 5, fat: 18 },
        { name: 'Dưa leo', amount: 0.5, unit: 'trái', calories: 10, protein: 0, carbs: 2, fat: 0 }
      ]
    },
    {
      name: 'Mì xào hải sản',
      foods: [
        { name: 'Mì xào hải sản', amount: 1, unit: 'đĩa', calories: 420, protein: 22, carbs: 50, fat: 16 }
      ]
    }
  ],
  snack: [
    {
      foods: [
        { name: 'Chuối', amount: 1, unit: 'trái', calories: 95, protein: 1, carbs: 24, fat: 0 }
      ]
    },
    {
      foods: [
        { name: 'Sữa chua Vinamilk', amount: 1, unit: 'hộp', calories: 110, protein: 4, carbs: 18, fat: 2 }
      ]
    },
    {
      foods: [
        { name: 'Hạt điều rang', amount: 20, unit: 'gram', calories: 115, protein: 3, carbs: 6, fat: 9 }
      ]
    },
    {
      foods: [
        { name: 'Cam', amount: 1, unit: 'trái', calories: 62, protein: 1, carbs: 15, fat: 0 }
      ]
    },
    {
      foods: [
        { name: 'Trà xanh 0 độ', amount: 1, unit: 'chai', calories: 45, protein: 0, carbs: 11, fat: 0 }
      ]
    },
    {
      foods: [
        { name: 'Táo', amount: 1, unit: 'trái', calories: 72, protein: 0, carbs: 19, fat: 0 }
      ]
    },
    {
      foods: [
        { name: 'Bánh quy ít đường', amount: 3, unit: 'cái', calories: 90, protein: 1, carbs: 15, fat: 3 }
      ]
    }
  ]
};

async function clearExistingData(userId) {
  console.log('🗑️  Xóa dữ liệu cũ tháng 12/2025...');
  
  const startDate = getDate(1, 0, 0);
  const endDate = getDate(25, 23, 59);
  
  await Promise.all([
    HealthMetric.deleteMany({ userId, timestamp: { $gte: startDate, $lte: endDate } }),
    Nutrition.deleteMany({ userId, date: { $gte: startDate, $lte: endDate } }),
    MoodLog.deleteMany({ userId, date: { $gte: startDate, $lte: endDate } }),
    Goal.deleteMany({ userId }),
    Reminder.deleteMany({ userId }),
    Alert.deleteMany({ userId })
  ]);
  
  console.log('✅ Đã xóa dữ liệu cũ');
}

async function seedData() {
  try {
    console.log('🌱 Bắt đầu tạo dữ liệu tháng 12/2025...');
    console.log('📅 Thời gian: 1/12/2025 - 25/12/2025\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công\n');

    // 1. TẠO USER
    console.log('👤 Tạo tài khoản demo...');
    let user = await User.findOne({ email: 'demo@phihub.com' });
    
    if (user) {
      await User.deleteOne({ email: 'demo@phihub.com' });
    }
    
    // Không hash trước vì User model đã có pre-save hook tự hash
    user = await User.create({
      name: 'Nguyễn Minh Khoa',
      email: 'demo@phihub.com',
      password: 'Demo@123',
      dob: new Date(1995, 2, 15), // 15/03/1995 - 30 tuổi
      gender: 'male',
      phone: '0909123456',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      medicalInfo: {
        chronicConditions: [
          { name: 'Tiền tăng huyết áp', severity: 'mild', diagnosedDate: new Date(2024, 5, 1) }
        ],
        allergies: [],
        medications: []
      },
      emergencyContact: {
        name: 'Nguyễn Thị Lan',
        relationship: 'Vợ',
        phone: '0909654321'
      }
    });
    console.log('✅ Tạo user: demo@phihub.com / Demo@123');
    
    const userId = user._id;
    await clearExistingData(userId);

    // 2. TẠO HEALTH METRICS
    console.log('\n📊 Tạo dữ liệu sức khỏe...');
    const healthMetrics = [];
    
    // Chiều cao (chỉ nhập 1 lần)
    healthMetrics.push({
      userId,
      metricType: 'height',
      value: 172,
      unit: 'cm',
      timestamp: getDate(1, 7, 0)
    });

    for (let day = 1; day <= 25; day++) {
      const dayOfWeek = new Date(2025, 11, day).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // === CÂN NẶNG (sáng sớm, sau khi đi vệ sinh) ===
      const weightBase = REALISTIC_DATA.weight.start + (day * REALISTIC_DATA.weight.dailyChange);
      const weight = parseFloat((weightBase + randomBetween(-REALISTIC_DATA.weight.variance, REALISTIC_DATA.weight.variance)).toFixed(1));
      
      healthMetrics.push({
        userId,
        metricType: 'weight',
        value: weight,
        unit: 'kg',
        timestamp: getDate(day, 6, 30),
        notes: day === 1 ? 'Bắt đầu theo dõi' : (day === 25 ? 'Giảm được gần 2kg!' : '')
      });

      // === BMI ===
      const height = 1.72;
      const bmi = parseFloat((weight / (height * height)).toFixed(1));
      healthMetrics.push({
        userId,
        metricType: 'bmi',
        value: bmi,
        unit: 'kg/m²',
        timestamp: getDate(day, 6, 31)
      });

      // === HUYẾT ÁP (đo 2 lần/ngày: sáng và tối) ===
      // Buổi sáng (7:00)
      const systolicMorning = Math.round(REALISTIC_DATA.bloodPressure.systolicStart - (day * REALISTIC_DATA.bloodPressure.dailyImprovement) + randomBetween(-REALISTIC_DATA.bloodPressure.variance, REALISTIC_DATA.bloodPressure.variance));
      const diastolicMorning = Math.round(REALISTIC_DATA.bloodPressure.diastolicStart - (day * REALISTIC_DATA.bloodPressure.dailyImprovement * 0.6) + randomBetween(-3, 3));
      
      healthMetrics.push({
        userId,
        metricType: 'bloodPressure',
        value: systolicMorning,
        unit: 'mmHg',
        timestamp: getDate(day, 7, 0),
        notes: `${systolicMorning}/${diastolicMorning} - Buổi sáng`
      });

      // Buổi tối (21:00) - thường cao hơn 3-5 mmHg
      if (day % 2 === 0) { // Không đo mỗi ngày
        const systolicEvening = systolicMorning + randomInt(2, 5);
        const diastolicEvening = diastolicMorning + randomInt(1, 3);
        healthMetrics.push({
          userId,
          metricType: 'bloodPressure',
          value: systolicEvening,
          unit: 'mmHg',
          timestamp: getDate(day, 21, 0),
          notes: `${systolicEvening}/${diastolicEvening} - Buổi tối`
        });
      }

      // === NHỊP TIM ===
      const heartRate = Math.round(REALISTIC_DATA.heartRate.base - (day * REALISTIC_DATA.heartRate.dailyImprovement) + randomBetween(-REALISTIC_DATA.heartRate.variance, REALISTIC_DATA.heartRate.variance));
      healthMetrics.push({
        userId,
        metricType: 'heartRate',
        value: heartRate,
        unit: 'bpm',
        timestamp: getDate(day, 7, 5)
      });

      // === GIẤC NGỦ ===
      let sleepHours = REALISTIC_DATA.sleep.base + (day * REALISTIC_DATA.sleep.dailyImprovement) + randomBetween(-REALISTIC_DATA.sleep.variance, REALISTIC_DATA.sleep.variance);
      sleepHours = Math.max(4.5, Math.min(9, sleepHours)); // 4.5h - 9h
      
      // Cuối tuần ngủ nhiều hơn
      if (isWeekend) {
        sleepHours += randomBetween(0.5, 1.0);
      }
      sleepHours = Math.min(9.5, sleepHours);
      
      healthMetrics.push({
        userId,
        metricType: 'sleep',
        value: parseFloat(sleepHours.toFixed(1)),
        unit: 'giờ',
        timestamp: getDate(day, 7, 10),
        notes: sleepHours >= 7.5 ? 'Ngủ ngon' : sleepHours < 6 ? 'Thiếu ngủ' : ''
      });

      // === SỐ BƯỚC CHÂN ===
      let steps = Math.round(REALISTIC_DATA.steps.base + (day * REALISTIC_DATA.steps.dailyImprovement) + randomBetween(-REALISTIC_DATA.steps.variance, REALISTIC_DATA.steps.variance));
      
      // Cuối tuần đi nhiều hơn (đi dạo, mua sắm)
      if (isWeekend) {
        steps += randomInt(2000, 4000);
      }
      steps = Math.max(3000, Math.min(18000, steps));
      
      healthMetrics.push({
        userId,
        metricType: 'steps',
        value: steps,
        unit: 'bước',
        timestamp: getDate(day, 22, 0),
        notes: steps >= 10000 ? '🎯 Đạt mục tiêu!' : ''
      });

      // === NƯỚC UỐNG ===
      let water = REALISTIC_DATA.water.base + (day * REALISTIC_DATA.water.dailyImprovement) + randomBetween(-REALISTIC_DATA.water.variance, REALISTIC_DATA.water.variance);
      water = Math.max(1.2, Math.min(3.5, water));
      
      healthMetrics.push({
        userId,
        metricType: 'water',
        value: parseFloat(water.toFixed(1)),
        unit: 'lít',
        timestamp: getDate(day, 21, 0)
      });

      // === ĐƯỜNG HUYẾT (mỗi tuần 1 lần - Thứ 2) ===
      if (dayOfWeek === 1) {
        const bloodSugar = Math.round(95 + randomBetween(-8, 8));
        healthMetrics.push({
          userId,
          metricType: 'bloodSugar',
          value: bloodSugar,
          unit: 'mg/dL',
          timestamp: getDate(day, 6, 45),
          notes: 'Đường huyết lúc đói'
        });
      }
    }

    await HealthMetric.insertMany(healthMetrics);
    console.log(`✅ Tạo ${healthMetrics.length} chỉ số sức khỏe`);

    // 3. TẠO GOALS
    console.log('\n🎯 Tạo mục tiêu...');
    const goals = [
      {
        userId,
        title: 'Giảm cân về 75kg',
        description: 'Giảm từ 78kg xuống 75kg trong 2 tháng (12/2025 - 01/2026)',
        goalType: 'weight',
        startValue: 78,
        currentValue: 76.3,
        targetValue: 75,
        unit: 'kg',
        targetDate: new Date(2026, 0, 31),
        status: 'active',
        milestones: [
          { value: 77, achievedDate: getDate(12) }
        ],
        createdAt: getDate(1)
      },
      {
        userId,
        title: 'Hạ huyết áp về mức bình thường',
        description: 'Giảm huyết áp tâm thu từ 138 về dưới 130 mmHg',
        goalType: 'bloodPressure',
        startValue: 138,
        currentValue: 132,
        targetValue: 125,
        unit: 'mmHg',
        targetDate: new Date(2026, 1, 28),
        status: 'active',
        milestones: [
          { value: 135, achievedDate: getDate(8) }
        ],
        createdAt: getDate(1)
      },
      {
        userId,
        title: 'Đi bộ 10,000 bước/ngày',
        description: 'Tăng hoạt động thể chất, đi bộ ít nhất 10,000 bước mỗi ngày',
        goalType: 'steps',
        startValue: 6500,
        currentValue: 8800,
        targetValue: 10000,
        unit: 'bước',
        targetDate: new Date(2025, 11, 31),
        status: 'active',
        milestones: [
          { value: 8000, achievedDate: getDate(10) }
        ],
        createdAt: getDate(1)
      },
      {
        userId,
        title: 'Ngủ đủ 7-8 giờ/đêm',
        description: 'Cải thiện chất lượng giấc ngủ, ngủ từ 7-8 tiếng mỗi đêm',
        goalType: 'sleep',
        startValue: 6.5,
        currentValue: 7.5,
        targetValue: 7.5,
        unit: 'giờ',
        targetDate: new Date(2025, 11, 31),
        status: 'completed',
        completedDate: getDate(20),
        milestones: [
          { value: 7, achievedDate: getDate(12) },
          { value: 7.5, achievedDate: getDate(20) }
        ],
        createdAt: getDate(1)
      }
    ];

    await Goal.insertMany(goals);
    console.log(`✅ Tạo ${goals.length} mục tiêu`);

    // 4. TẠO NUTRITION LOGS
    console.log('\n🍽️  Tạo nhật ký dinh dưỡng...');
    const nutritionLogs = [];

    for (let day = 1; day <= 25; day++) {
      // Breakfast (6:30 - 8:00)
      const breakfastIndex = (day - 1) % VIETNAMESE_MEALS.breakfast.length;
      const breakfast = VIETNAMESE_MEALS.breakfast[breakfastIndex];
      nutritionLogs.push({
        userId,
        date: getDate(day, 7, randomInt(0, 45)),
        mealType: 'breakfast',
        foods: breakfast.foods,
        totalCalories: breakfast.foods.reduce((sum, f) => sum + f.calories, 0),
        totalProtein: breakfast.foods.reduce((sum, f) => sum + f.protein, 0),
        totalCarbs: breakfast.foods.reduce((sum, f) => sum + f.carbs, 0),
        totalFat: breakfast.foods.reduce((sum, f) => sum + f.fat, 0)
      });

      // Lunch (11:30 - 13:00)
      const lunchIndex = (day - 1) % VIETNAMESE_MEALS.lunch.length;
      const lunch = VIETNAMESE_MEALS.lunch[lunchIndex];
      nutritionLogs.push({
        userId,
        date: getDate(day, 12, randomInt(0, 30)),
        mealType: 'lunch',
        foods: lunch.foods,
        totalCalories: lunch.foods.reduce((sum, f) => sum + f.calories, 0),
        totalProtein: lunch.foods.reduce((sum, f) => sum + f.protein, 0),
        totalCarbs: lunch.foods.reduce((sum, f) => sum + f.carbs, 0),
        totalFat: lunch.foods.reduce((sum, f) => sum + f.fat, 0)
      });

      // Dinner (18:00 - 19:30)
      const dinnerIndex = (day - 1) % VIETNAMESE_MEALS.dinner.length;
      const dinner = VIETNAMESE_MEALS.dinner[dinnerIndex];
      nutritionLogs.push({
        userId,
        date: getDate(day, 18, randomInt(30, 59)),
        mealType: 'dinner',
        foods: dinner.foods,
        totalCalories: dinner.foods.reduce((sum, f) => sum + f.calories, 0),
        totalProtein: dinner.foods.reduce((sum, f) => sum + f.protein, 0),
        totalCarbs: dinner.foods.reduce((sum, f) => sum + f.carbs, 0),
        totalFat: dinner.foods.reduce((sum, f) => sum + f.fat, 0)
      });

      // Snack (15:00 - 16:00) - không phải ngày nào cũng có
      if (day % 2 === 0 || day % 3 === 0) {
        const snackIndex = (day - 1) % VIETNAMESE_MEALS.snack.length;
        const snack = VIETNAMESE_MEALS.snack[snackIndex];
        nutritionLogs.push({
          userId,
          date: getDate(day, 15, randomInt(0, 30)),
          mealType: 'snack',
          foods: snack.foods,
          totalCalories: snack.foods.reduce((sum, f) => sum + f.calories, 0),
          totalProtein: snack.foods.reduce((sum, f) => sum + f.protein, 0),
          totalCarbs: snack.foods.reduce((sum, f) => sum + f.carbs, 0),
          totalFat: snack.foods.reduce((sum, f) => sum + f.fat, 0)
        });
      }
    }

    await Nutrition.insertMany(nutritionLogs);
    console.log(`✅ Tạo ${nutritionLogs.length} nhật ký dinh dưỡng`);

    // 5. TẠO MOOD LOGS
    console.log('\n😊 Tạo nhật ký tâm trạng...');
    const moodLogs = [];
    
    const moodJournalEntries = [
      'Hôm nay làm việc hiệu quả, hoàn thành được nhiều task.',
      'Đi bộ buổi sáng rất thoải mái, thấy tinh thần tốt hơn.',
      'Họp nhóm căng thẳng nhưng kết quả tốt.',
      'Cuối tuần đi chơi với gia đình, rất vui.',
      'Hơi mệt vì thiếu ngủ đêm qua.',
      'Ăn uống điều độ, thấy người khỏe hơn.',
      'Gym được 45 phút, cảm thấy tuyệt vời!',
      'Ngày bình thường, không có gì đặc biệt.',
      'Deadline gấp nên hơi stress.',
      'Đọc được cuốn sách hay, tâm trạng tốt.',
      'Gặp bạn cũ, nói chuyện vui vẻ.',
      'Ngủ sớm hơn mọi ngày, sáng dậy tỉnh táo.',
      'Hoàn thành dự án đúng hạn, rất hài lòng.',
      'Thời tiết đẹp, đi bộ công viên 30 phút.',
      'Hôm nay mệt, cần nghỉ ngơi nhiều hơn.',
      'Làm việc remote, tiết kiệm thời gian di chuyển.',
      'Học được skill mới, cảm thấy tiến bộ.',
      'Ăn tối với vợ, buổi tối lãng mạn.',
      'Xem phim hay, thư giãn cuối tuần.',
      'Chạy bộ được 5km, personal best!',
      'Ngày nghỉ, ngủ nướng đến 9h sáng.',
      'Dọn dẹp nhà cửa, sạch sẽ tinh thần tốt.',
      'Nấu ăn cho gia đình, mọi người khen ngon.',
      'Review code cả ngày, hơi đau mắt.',
      'Ngày cuối năm sắp đến, háo hức.'
    ];

    for (let day = 1; day <= 25; day++) {
      const dayOfWeek = new Date(2025, 11, day).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Cuối tuần thường vui hơn
      let baseMood = isWeekend ? 7 : 6;
      let moodVariance = randomInt(-2, 2);
      let moodScore = Math.max(3, Math.min(10, baseMood + moodVariance));
      
      // Mood text
      let mood;
      if (moodScore >= 8) mood = 'excellent';
      else if (moodScore >= 6) mood = 'good';
      else if (moodScore >= 4) mood = 'okay';
      else mood = 'bad';

      // Energy level
      const energyOptions = ['low', 'medium', 'high', 'very_high'];
      const energy = moodScore >= 7 ? energyOptions[randomInt(2, 3)] : energyOptions[randomInt(0, 2)];
      
      // Stress level
      const stressOptions = ['none', 'low', 'medium', 'high'];
      const stressIndex = isWeekend ? randomInt(0, 1) : randomInt(1, 3);
      const stress = stressOptions[stressIndex];

      const activitiesPool = isWeekend 
        ? ['family', 'social', 'relaxation', 'exercise', 'hobby']
        : ['work', 'exercise', 'relaxation', 'hobby'];
      const activities = [activitiesPool[randomInt(0, activitiesPool.length - 1)]];

      const emotionsPool = mood === 'excellent' || mood === 'good'
        ? ['happy', 'motivated', 'grateful', 'excited', 'peaceful']
        : ['tired', 'peaceful'];
      const emotions = [emotionsPool[randomInt(0, emotionsPool.length - 1)]];

      moodLogs.push({
        userId,
        date: getDate(day, 21, randomInt(0, 30)),
        mood,
        moodScore,
        energy,
        energyScore: moodScore >= 6 ? randomInt(6, 8) : randomInt(4, 6),
        stress,
        stressScore: Math.max(1, stressIndex * 2 + randomInt(0, 2)),
        anxiety: stressIndex >= 2 ? randomInt(4, 6) : randomInt(1, 3),
        sleepQuality: randomInt(5, 8),
        productivity: isWeekend ? randomInt(4, 6) : randomInt(5, 8),
        socialInteraction: isWeekend ? 'high' : ['minimal', 'moderate'][randomInt(0, 1)],
        activities,
        emotions,
        journal: moodJournalEntries[day - 1],
        gratitude: [
          'Sức khỏe ổn định',
          isWeekend ? 'Được nghỉ ngơi' : 'Công việc suôn sẻ',
          'Gia đình khỏe mạnh'
        ]
      });
    }

    await MoodLog.insertMany(moodLogs);
    console.log(`✅ Tạo ${moodLogs.length} nhật ký tâm trạng`);

    // 6. TẠO REMINDERS
    console.log('\n⏰ Tạo nhắc nhở...');
    const reminders = [
      {
        userId,
        title: 'Đo huyết áp buổi sáng',
        message: 'Nhớ đo huyết áp trước khi ăn sáng',
        type: 'measurement',
        frequency: 'daily',
        time: '07:00',
        isActive: true,
        nextScheduled: getDate(26, 7, 0)
      },
      {
        userId,
        title: 'Uống nước',
        message: 'Đã đến giờ uống nước! Mục tiêu hôm nay: 2 lít',
        type: 'water',
        frequency: 'daily',
        time: '09:00',
        isActive: true,
        nextScheduled: getDate(26, 9, 0)
      },
      {
        userId,
        title: 'Đi bộ 30 phút',
        message: 'Dành 30 phút đi bộ để đạt mục tiêu 10,000 bước',
        type: 'exercise',
        frequency: 'daily',
        time: '18:00',
        isActive: true,
        nextScheduled: getDate(26, 18, 0)
      },
      {
        userId,
        title: 'Cân nặng',
        message: 'Cân trọng lượng buổi sáng (sau khi đi vệ sinh)',
        type: 'measurement',
        frequency: 'daily',
        time: '06:30',
        isActive: true,
        nextScheduled: getDate(26, 6, 30)
      },
      {
        userId,
        title: 'Ghi nhật ký tâm trạng',
        message: 'Cuối ngày rồi! Ghi lại tâm trạng hôm nay nhé.',
        type: 'custom',
        frequency: 'daily',
        time: '21:00',
        isActive: true,
        nextScheduled: getDate(26, 21, 0)
      }
    ];

    await Reminder.insertMany(reminders);
    console.log(`✅ Tạo ${reminders.length} nhắc nhở`);

    // 7. TẠO ALERTS
    console.log('\n🚨 Tạo cảnh báo...');
    const alerts = [
      {
        userId,
        type: 'warning',
        category: 'health_metric',
        title: 'Huyết áp cao nhẹ',
        message: 'Huyết áp của bạn là 138/88 mmHg - hơi cao hơn bình thường. Nên theo dõi thường xuyên và duy trì lối sống lành mạnh.',
        severity: 'medium',
        metricType: 'bloodPressure',
        metricValue: 138,
        isRead: true,
        isResolved: true,
        createdAt: getDate(1)
      },
      {
        userId,
        type: 'success',
        category: 'goal',
        title: 'Đạt milestone giảm cân',
        message: 'Chúc mừng! Bạn đã giảm được 1kg, từ 78kg xuống 77kg! Tiếp tục phát huy nhé.',
        severity: 'low',
        isRead: true,
        createdAt: getDate(12)
      },
      {
        userId,
        type: 'success',
        category: 'goal',
        title: 'Hoàn thành mục tiêu giấc ngủ',
        message: 'Xuất sắc! Bạn đã đạt mục tiêu ngủ đủ 7.5 giờ/đêm. Tiếp tục duy trì thói quen tốt!',
        severity: 'low',
        isRead: true,
        createdAt: getDate(20)
      },
      {
        userId,
        type: 'info',
        category: 'health_metric',
        title: 'Cải thiện đáng kể',
        message: 'Số bước chân của bạn tăng 35% so với tuần trước (từ 6,500 lên 8,800 bước). Tuyệt vời!',
        severity: 'low',
        isRead: false,
        createdAt: getDate(20)
      },
      {
        userId,
        type: 'info',
        category: 'health_metric',
        title: 'Huyết áp đang cải thiện',
        message: 'Huyết áp của bạn đã giảm từ 138/88 xuống 132/85 mmHg. Tiếp tục duy trì!',
        severity: 'low',
        isRead: false,
        createdAt: getDate(15)
      }
    ];

    await Alert.insertMany(alerts);
    console.log(`✅ Tạo ${alerts.length} cảnh báo`);

    // SUMMARY
    console.log('\n' + '═'.repeat(60));
    console.log('✅ HOÀN THÀNH TẠO DỮ LIỆU!');
    console.log('═'.repeat(60));
    console.log(`
📊 Tổng kết:
   👤 User: demo@phihub.com (Mật khẩu: Demo@123)
   📈 Health Metrics: ${healthMetrics.length}
   🎯 Goals: ${goals.length} (1 đã hoàn thành)
   🍽️  Nutrition Logs: ${nutritionLogs.length}
   😊 Mood Logs: ${moodLogs.length}
   ⏰ Reminders: ${reminders.length}
   🚨 Alerts: ${alerts.length}

📅 Thời gian: 1/12/2025 - 25/12/2025

🎯 Đặc điểm dữ liệu:
   • Cân nặng: 78kg → 76.3kg (-1.7kg)
   • Huyết áp: 138/88 → 132/85 mmHg (cải thiện)
   • Bước chân: 6,500 → 8,800 bước/ngày
   • Giấc ngủ: 6.5h → 7.5h/đêm
   • Thực đơn: Món ăn Việt Nam đa dạng, thực tế

🔐 Đăng nhập:
   Email: demo@phihub.com
   Password: Demo@123

🚀 Truy cập: http://localhost:8080
    `);

    await mongoose.connection.close();
    console.log('📡 Đã đóng kết nối database');

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

seedData();
