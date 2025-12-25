const mongoose = require('mongoose');

// Connect to Docker MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/phihub').then(async () => {
  console.log('✅ Connected to MongoDB');
  
  const userId = new mongoose.Types.ObjectId('694d3960223aea91e1ac530f');
  
  // Define schemas
  const HealthMetric = mongoose.model('HealthMetric', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    metricType: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
  }, { timestamps: true }));

  const MoodLog = mongoose.model('MoodLog', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    mood: { type: String, enum: ['terrible', 'bad', 'okay', 'good', 'great', 'excellent'], required: true },
    moodScore: { type: Number, min: 1, max: 10 },
    energy: { type: String, enum: ['very_low', 'low', 'medium', 'high', 'very_high'] },
    energyScore: { type: Number, min: 1, max: 10 },
    stress: { type: String, enum: ['none', 'low', 'medium', 'high', 'extreme'] },
    stressScore: { type: Number, min: 1, max: 10 },
    anxiety: { type: Number, min: 0, max: 10 },
    sleepQuality: { type: Number, min: 1, max: 10 },
    productivity: { type: Number, min: 1, max: 10 },
    emotions: [{ type: String }],
    activities: [{ type: String }],
    factors: [{ type: String }],
    journal: { type: String },
    gratitude: [{ type: String }],
    notes: { type: String }
  }, { timestamps: true }));

  const NutritionLog = mongoose.model('NutritionLog', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
    foods: [{ name: String, calories: Number, protein: Number, carbs: Number, fat: Number, fiber: Number, quantity: Number, unit: String }],
    totalCalories: Number,
    totalProtein: Number,
    totalCarbs: Number,
    totalFat: Number,
    totalFiber: Number,
    notes: String
  }, { timestamps: true }));

  const Goal = mongoose.model('Goal', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    goalType: { type: String, required: true },
    startValue: { type: Number },
    currentValue: { type: Number },
    targetValue: { type: Number, required: true },
    unit: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    targetDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'completed', 'failed', 'cancelled'], default: 'active' },
    progress: { type: Number, default: 0 }
  }, { timestamps: true }));

  // Clear existing data
  await HealthMetric.deleteMany({ userId });
  await MoodLog.deleteMany({ userId });
  await NutritionLog.deleteMany({ userId });
  await Goal.deleteMany({ userId });
  console.log('🗑️  Cleared existing data');

  // ========================
  // HEALTH METRICS - Realistic data for Dec 1-25, 2025
  // ========================
  const healthMetrics = [];
  
  // Simulating a real person's health journey
  // Starting weight: 72kg, goal: 68kg (weight loss journey)
  // Blood pressure: slightly high, improving with lifestyle changes
  // Heart rate: normal range 60-80
  // Steps: varies by day (weekdays more sedentary, weekends active)
  // Sleep: improving sleep habits

  for (let day = 1; day <= 25; day++) {
    const date = new Date(2025, 11, day, 7, 0, 0); // December 2025
    const isWeekend = [6, 7, 13, 14, 20, 21].includes(day);
    const isHoliday = [24, 25].includes(day); // Christmas Eve & Christmas
    
    // Weight - gradual decrease from 72kg to 70.2kg with natural fluctuations
    const baseWeight = 72 - (day * 0.07);
    const weightFluctuation = (Math.random() - 0.5) * 0.4;
    healthMetrics.push({
      userId, metricType: 'weight',
      value: parseFloat((baseWeight + weightFluctuation).toFixed(1)),
      unit: 'kg',
      timestamp: new Date(date.getTime() + 7 * 60 * 60 * 1000), // 7 AM
      notes: day === 1 ? 'Bắt đầu chế độ ăn mới' : day === 25 ? 'Giảm được gần 2kg! 🎉' : ''
    });

    // BMI - calculated from weight (height assumed 1.72m)
    const height = 1.72;
    const weight = baseWeight + weightFluctuation;
    const bmi = weight / (height * height);
    healthMetrics.push({
      userId, metricType: 'bmi',
      value: parseFloat(bmi.toFixed(1)),
      unit: 'kg/m²',
      timestamp: new Date(date.getTime() + 7 * 60 * 60 * 1000),
      notes: ''
    });

    // Blood Pressure - Morning and Evening readings
    // Systolic: improving from 135 to 125 mmHg
    // Diastolic: stable around 82-85 mmHg
    const baseSystolic = 135 - (day * 0.4);
    const systolicVariation = Math.floor(Math.random() * 8) - 4;
    const diastolicVariation = Math.floor(Math.random() * 6) - 3;
    
    // Morning BP
    healthMetrics.push({
      userId, metricType: 'bloodPressure',
      value: Math.round(baseSystolic + systolicVariation),
      unit: 'mmHg',
      timestamp: new Date(date.getTime() + 6.5 * 60 * 60 * 1000), // 6:30 AM
      metadata: { diastolic: 82 + diastolicVariation, position: 'sitting', arm: 'left' },
      notes: ''
    });
    
    // Evening BP (slightly higher)
    healthMetrics.push({
      userId, metricType: 'bloodPressure',
      value: Math.round(baseSystolic + systolicVariation + 5),
      unit: 'mmHg',
      timestamp: new Date(date.getTime() + 21 * 60 * 60 * 1000), // 9 PM
      metadata: { diastolic: 85 + diastolicVariation, position: 'sitting', arm: 'left' },
      notes: ''
    });

    // Heart Rate - Multiple readings per day
    const restingHR = 68 + Math.floor(Math.random() * 8) - 4;
    const afterExerciseHR = isWeekend ? 120 + Math.floor(Math.random() * 20) : 95 + Math.floor(Math.random() * 15);
    
    healthMetrics.push({
      userId, metricType: 'heartRate',
      value: restingHR,
      unit: 'nhịp/phút',
      timestamp: new Date(date.getTime() + 7 * 60 * 60 * 1000),
      metadata: { type: 'resting', activity: 'waking_up' },
      notes: ''
    });
    
    if (isWeekend || day % 2 === 0) {
      healthMetrics.push({
        userId, metricType: 'heartRate',
        value: afterExerciseHR,
        unit: 'nhịp/phút',
        timestamp: new Date(date.getTime() + 18 * 60 * 60 * 1000),
        metadata: { type: 'after_exercise', activity: isWeekend ? 'running' : 'walking' },
        notes: isWeekend ? 'Sau chạy bộ 30 phút' : 'Sau đi bộ 20 phút'
      });
    }

    // Steps - varies by day type
    let steps;
    if (isHoliday) {
      steps = 3000 + Math.floor(Math.random() * 2000); // Low activity on holidays
    } else if (isWeekend) {
      steps = 8000 + Math.floor(Math.random() * 5000); // Active weekends
    } else {
      steps = 5000 + Math.floor(Math.random() * 3000); // Normal weekdays
    }
    healthMetrics.push({
      userId, metricType: 'steps',
      value: steps,
      unit: 'bước',
      timestamp: new Date(date.getTime() + 22 * 60 * 60 * 1000), // End of day
      notes: isWeekend ? 'Đi bộ công viên' : ''
    });

    // Sleep - 6-8 hours, improving quality
    const sleepHours = 6 + Math.random() * 2;
    healthMetrics.push({
      userId, metricType: 'sleep',
      value: parseFloat(sleepHours.toFixed(1)),
      unit: 'giờ',
      timestamp: date,
      metadata: { quality: Math.floor(6 + day * 0.1 + Math.random() * 2), bedtime: '23:00', wakeTime: '06:30' },
      notes: ''
    });

    // Water intake - 1.5-2.5 liters
    const water = 1.5 + Math.random() * 1;
    healthMetrics.push({
      userId, metricType: 'water',
      value: parseFloat(water.toFixed(1)),
      unit: 'lít',
      timestamp: new Date(date.getTime() + 22 * 60 * 60 * 1000),
      notes: ''
    });

    // Blood Sugar (fasting) - Normal range 70-100 mg/dL
    const bloodSugar = 85 + Math.floor(Math.random() * 15) - 7;
    healthMetrics.push({
      userId, metricType: 'bloodSugar',
      value: bloodSugar,
      unit: 'mg/dL',
      timestamp: new Date(date.getTime() + 6 * 60 * 60 * 1000),
      metadata: { type: 'fasting', mealContext: 'before_breakfast' },
      notes: ''
    });

    // SpO2 - Normal 95-100%
    const spo2 = 96 + Math.floor(Math.random() * 4);
    healthMetrics.push({
      userId, metricType: 'spo2',
      value: spo2,
      unit: '%',
      timestamp: new Date(date.getTime() + 7 * 60 * 60 * 1000),
      notes: ''
    });

    // Exercise minutes
    let exerciseMinutes;
    if (isHoliday) {
      exerciseMinutes = 15 + Math.floor(Math.random() * 15);
    } else if (isWeekend) {
      exerciseMinutes = 45 + Math.floor(Math.random() * 30);
    } else {
      exerciseMinutes = 20 + Math.floor(Math.random() * 25);
    }
    healthMetrics.push({
      userId, metricType: 'exercise',
      value: exerciseMinutes,
      unit: 'phút',
      timestamp: new Date(date.getTime() + 18 * 60 * 60 * 1000),
      metadata: { type: isWeekend ? 'cardio' : 'walking', intensity: isWeekend ? 'moderate' : 'light' },
      notes: ''
    });
  }

  await HealthMetric.insertMany(healthMetrics);
  console.log(`✅ Created ${healthMetrics.length} health metrics`);

  // ========================
  // MOOD LOGS - Detailed emotional tracking
  // ========================
  const moodLogs = [];
  const moodPatterns = ['good', 'great', 'okay', 'good', 'great', 'good', 'okay', 'good', 'excellent', 'good'];
  const emotionSets = [
    ['happy', 'grateful', 'motivated'],
    ['peaceful', 'content'],
    ['tired', 'stressed'],
    ['excited', 'happy'],
    ['anxious', 'overwhelmed'],
    ['calm', 'focused'],
    ['frustrated', 'tired'],
    ['happy', 'energetic']
  ];
  const activitySets = [
    ['work', 'exercise'],
    ['family', 'relaxation'],
    ['social', 'hobby'],
    ['work', 'meditation'],
    ['exercise', 'social'],
    ['hobby', 'family'],
    ['work'],
    ['relaxation', 'meditation']
  ];
  const journalEntries = [
    'Hôm nay làm việc hiệu quả, hoàn thành được nhiều task quan trọng. Cảm thấy hài lòng với bản thân.',
    'Cuối tuần tuyệt vời bên gia đình. Đi công viên cùng con, thấy vui và thư giãn.',
    'Hơi stress vì deadline dự án, nhưng đã quản lý được thời gian tốt hơn.',
    'Buổi sáng thiền 15 phút giúp tâm trạng tốt suốt cả ngày.',
    'Gặp bạn cũ, nói chuyện rất vui. Cảm thấy biết ơn vì những mối quan hệ tốt đẹp.',
    'Tập gym được 1 tiếng, cơ thể mệt nhưng tinh thần sảng khoái.',
    'Ngủ không ngon đêm qua, hôm nay hơi uể oải. Cần điều chỉnh giờ ngủ.',
    'Hoàn thành được mục tiêu tuần này. Thưởng cho bản thân bữa ăn ngon.',
    'Thời tiết đẹp, đi bộ 10,000 bước. Cảm giác tràn đầy năng lượng.',
    'Đọc xong cuốn sách hay, học được nhiều điều mới về sức khỏe.',
    'Họp nhóm hiệu quả, team work tốt. Cảm thấy được công nhận.',
    'Nấu ăn healthy cho cả tuần, tiết kiệm thời gian và ăn uống lành mạnh hơn.'
  ];
  const gratitudeExamples = [
    ['Gia đình khỏe mạnh', 'Công việc ổn định', 'Thời tiết đẹp'],
    ['Được nghỉ ngơi', 'Bữa ăn ngon', 'Giấc ngủ sâu'],
    ['Đồng nghiệp hỗ trợ', 'Sức khỏe tốt', 'Có thời gian cho bản thân'],
    ['Bạn bè quan tâm', 'Cơ hội học hỏi', 'Không gian sống thoải mái'],
    ['Tiến bộ trong công việc', 'Mối quan hệ tốt', 'Được làm điều yêu thích']
  ];

  for (let day = 1; day <= 25; day++) {
    const isWeekend = [6, 7, 13, 14, 20, 21].includes(day);
    const moodIndex = (day + Math.floor(Math.random() * 3)) % moodPatterns.length;
    const mood = moodPatterns[moodIndex];
    
    // Calculate scores based on mood
    const moodScoreMap = { terrible: 2, bad: 4, okay: 5, good: 7, great: 8, excellent: 10 };
    const moodScore = moodScoreMap[mood] + (Math.random() - 0.5);
    
    // Energy tends to be higher on weekends
    const baseEnergy = isWeekend ? 7 : 6;
    const energyScore = Math.min(10, Math.max(1, baseEnergy + Math.floor(Math.random() * 3) - 1));
    
    // Stress tends to be lower on weekends
    const baseStress = isWeekend ? 3 : 5;
    const stressScore = Math.min(10, Math.max(1, baseStress + Math.floor(Math.random() * 3) - 1));
    
    // Anxiety correlates with stress
    const anxiety = Math.max(0, stressScore - 2 + Math.floor(Math.random() * 2));
    
    // Sleep quality varies
    const sleepQuality = Math.min(10, Math.max(4, 6 + Math.floor(Math.random() * 3) + (isWeekend ? 1 : 0)));
    
    // Productivity higher on weekdays
    const productivity = isWeekend ? 5 + Math.floor(Math.random() * 3) : 6 + Math.floor(Math.random() * 3);

    moodLogs.push({
      userId,
      date: new Date(2025, 11, day, 21, 0, 0), // 9 PM daily reflection
      mood,
      moodScore: parseFloat(moodScore.toFixed(1)),
      energy: energyScore >= 7 ? 'high' : energyScore >= 4 ? 'medium' : 'low',
      energyScore,
      stress: stressScore >= 7 ? 'high' : stressScore >= 4 ? 'medium' : 'low',
      stressScore,
      anxiety,
      sleepQuality,
      productivity,
      emotions: emotionSets[(day - 1) % emotionSets.length],
      activities: activitySets[(day - 1) % activitySets.length],
      factors: isWeekend ? ['weekend', 'rest'] : ['work', 'routine'],
      journal: journalEntries[(day - 1) % journalEntries.length],
      gratitude: gratitudeExamples[(day - 1) % gratitudeExamples.length],
      notes: ''
    });
  }

  await MoodLog.insertMany(moodLogs);
  console.log(`✅ Created ${moodLogs.length} mood logs`);

  // ========================
  // NUTRITION LOGS - Vietnamese meals
  // ========================
  const nutritionLogs = [];
  
  const breakfastOptions = [
    { foods: [{ name: 'Phở bò', calories: 450, protein: 25, carbs: 55, fat: 12, fiber: 2, quantity: 1, unit: 'tô' }] },
    { foods: [{ name: 'Bánh mì thịt', calories: 380, protein: 15, carbs: 48, fat: 14, fiber: 3, quantity: 1, unit: 'ổ' }] },
    { foods: [{ name: 'Xôi gà', calories: 420, protein: 18, carbs: 52, fat: 16, fiber: 2, quantity: 1, unit: 'phần' }] },
    { foods: [{ name: 'Bún bò Huế', calories: 520, protein: 28, carbs: 58, fat: 18, fiber: 3, quantity: 1, unit: 'tô' }] },
    { foods: [{ name: 'Cháo gà', calories: 320, protein: 18, carbs: 42, fat: 8, fiber: 2, quantity: 1, unit: 'tô' }, { name: 'Quẩy', calories: 150, protein: 3, carbs: 20, fat: 7, fiber: 1, quantity: 2, unit: 'cái' }] },
    { foods: [{ name: 'Bánh cuốn', calories: 280, protein: 12, carbs: 38, fat: 8, fiber: 2, quantity: 1, unit: 'đĩa' }, { name: 'Chả lụa', calories: 120, protein: 12, carbs: 2, fat: 7, fiber: 0, quantity: 3, unit: 'miếng' }] },
    { foods: [{ name: 'Hủ tiếu Nam Vang', calories: 480, protein: 22, carbs: 55, fat: 16, fiber: 3, quantity: 1, unit: 'tô' }] },
    { foods: [{ name: 'Yến mạch + chuối', calories: 350, protein: 12, carbs: 58, fat: 8, fiber: 8, quantity: 1, unit: 'bát' }, { name: 'Sữa tươi', calories: 120, protein: 8, carbs: 12, fat: 5, fiber: 0, quantity: 200, unit: 'ml' }] }
  ];

  const lunchOptions = [
    { foods: [{ name: 'Cơm sườn nướng', calories: 650, protein: 35, carbs: 70, fat: 22, fiber: 3, quantity: 1, unit: 'phần' }, { name: 'Canh rau', calories: 50, protein: 2, carbs: 8, fat: 1, fiber: 3, quantity: 1, unit: 'bát' }] },
    { foods: [{ name: 'Bún chả Hà Nội', calories: 580, protein: 30, carbs: 58, fat: 22, fiber: 4, quantity: 1, unit: 'phần' }] },
    { foods: [{ name: 'Cơm gà xối mỡ', calories: 620, protein: 32, carbs: 68, fat: 20, fiber: 2, quantity: 1, unit: 'phần' }] },
    { foods: [{ name: 'Mì Quảng', calories: 520, protein: 28, carbs: 55, fat: 18, fiber: 4, quantity: 1, unit: 'tô' }] },
    { foods: [{ name: 'Cơm tấm bì chả', calories: 680, protein: 32, carbs: 75, fat: 24, fiber: 3, quantity: 1, unit: 'dĩa' }] },
    { foods: [{ name: 'Bún thịt nướng', calories: 550, protein: 28, carbs: 60, fat: 18, fiber: 5, quantity: 1, unit: 'tô' }] },
    { foods: [{ name: 'Gỏi cuốn tôm thịt', calories: 280, protein: 18, carbs: 32, fat: 8, fiber: 3, quantity: 4, unit: 'cuốn' }, { name: 'Cơm trắng', calories: 200, protein: 4, carbs: 45, fat: 0, fiber: 1, quantity: 1, unit: 'bát' }] }
  ];

  const dinnerOptions = [
    { foods: [{ name: 'Cá kho tộ', calories: 280, protein: 28, carbs: 8, fat: 15, fiber: 0, quantity: 1, unit: 'phần' }, { name: 'Cơm trắng', calories: 200, protein: 4, carbs: 45, fat: 0, fiber: 1, quantity: 1, unit: 'bát' }, { name: 'Rau luộc', calories: 50, protein: 3, carbs: 8, fat: 1, fiber: 4, quantity: 1, unit: 'đĩa' }] },
    { foods: [{ name: 'Thịt kho trứng', calories: 350, protein: 25, carbs: 12, fat: 22, fiber: 0, quantity: 1, unit: 'phần' }, { name: 'Cơm trắng', calories: 200, protein: 4, carbs: 45, fat: 0, fiber: 1, quantity: 1, unit: 'bát' }, { name: 'Canh chua', calories: 80, protein: 5, carbs: 12, fat: 2, fiber: 3, quantity: 1, unit: 'bát' }] },
    { foods: [{ name: 'Lẩu hải sản', calories: 450, protein: 40, carbs: 25, fat: 18, fiber: 5, quantity: 1, unit: 'phần' }, { name: 'Bún', calories: 180, protein: 4, carbs: 40, fat: 0, fiber: 2, quantity: 1, unit: 'bát' }] },
    { foods: [{ name: 'Gà nướng mật ong', calories: 380, protein: 35, carbs: 15, fat: 18, fiber: 0, quantity: 1, unit: 'phần' }, { name: 'Salad rau trộn', calories: 120, protein: 3, carbs: 12, fat: 6, fiber: 4, quantity: 1, unit: 'đĩa' }] },
    { foods: [{ name: 'Bò xào rau củ', calories: 320, protein: 28, carbs: 18, fat: 16, fiber: 5, quantity: 1, unit: 'đĩa' }, { name: 'Cơm trắng', calories: 200, protein: 4, carbs: 45, fat: 0, fiber: 1, quantity: 1, unit: 'bát' }] },
    { foods: [{ name: 'Cháo lòng', calories: 380, protein: 22, carbs: 45, fat: 12, fiber: 2, quantity: 1, unit: 'tô' }] }
  ];

  const snackOptions = [
    { foods: [{ name: 'Sữa chua Vinamilk', calories: 120, protein: 5, carbs: 18, fat: 3, fiber: 0, quantity: 1, unit: 'hộp' }] },
    { foods: [{ name: 'Chuối', calories: 90, protein: 1, carbs: 23, fat: 0, fiber: 3, quantity: 1, unit: 'quả' }] },
    { foods: [{ name: 'Hạt điều', calories: 180, protein: 5, carbs: 10, fat: 14, fiber: 1, quantity: 30, unit: 'g' }] },
    { foods: [{ name: 'Táo', calories: 80, protein: 0, carbs: 21, fat: 0, fiber: 4, quantity: 1, unit: 'quả' }] },
    { foods: [{ name: 'Bánh flan', calories: 200, protein: 6, carbs: 28, fat: 7, fiber: 0, quantity: 1, unit: 'cái' }] },
    { foods: [{ name: 'Sinh tố bơ', calories: 280, protein: 4, carbs: 25, fat: 18, fiber: 5, quantity: 1, unit: 'ly' }] },
    { foods: [{ name: 'Trà sữa trân châu', calories: 350, protein: 3, carbs: 55, fat: 12, fiber: 0, quantity: 1, unit: 'ly' }] },
    { foods: [{ name: 'Thanh long', calories: 60, protein: 1, carbs: 13, fat: 0, fiber: 3, quantity: 1, unit: 'quả' }] }
  ];

  for (let day = 1; day <= 25; day++) {
    const date = new Date(2025, 11, day);
    
    // Breakfast
    const breakfast = breakfastOptions[(day - 1) % breakfastOptions.length];
    const breakfastTotal = breakfast.foods.reduce((acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
      fiber: acc.fiber + f.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    
    nutritionLogs.push({
      userId, date, mealType: 'breakfast',
      foods: breakfast.foods,
      totalCalories: breakfastTotal.calories,
      totalProtein: breakfastTotal.protein,
      totalCarbs: breakfastTotal.carbs,
      totalFat: breakfastTotal.fat,
      totalFiber: breakfastTotal.fiber,
      notes: ''
    });

    // Lunch
    const lunch = lunchOptions[(day - 1) % lunchOptions.length];
    const lunchTotal = lunch.foods.reduce((acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
      fiber: acc.fiber + f.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    
    nutritionLogs.push({
      userId, date, mealType: 'lunch',
      foods: lunch.foods,
      totalCalories: lunchTotal.calories,
      totalProtein: lunchTotal.protein,
      totalCarbs: lunchTotal.carbs,
      totalFat: lunchTotal.fat,
      totalFiber: lunchTotal.fiber,
      notes: ''
    });

    // Dinner
    const dinner = dinnerOptions[(day - 1) % dinnerOptions.length];
    const dinnerTotal = dinner.foods.reduce((acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
      fiber: acc.fiber + f.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    
    nutritionLogs.push({
      userId, date, mealType: 'dinner',
      foods: dinner.foods,
      totalCalories: dinnerTotal.calories,
      totalProtein: dinnerTotal.protein,
      totalCarbs: dinnerTotal.carbs,
      totalFat: dinnerTotal.fat,
      totalFiber: dinnerTotal.fiber,
      notes: ''
    });

    // Snack (not every day)
    if (day % 2 === 0 || day % 3 === 0) {
      const snack = snackOptions[(day - 1) % snackOptions.length];
      const snackFood = snack.foods[0];
      nutritionLogs.push({
        userId, date, mealType: 'snack',
        foods: snack.foods,
        totalCalories: snackFood.calories,
        totalProtein: snackFood.protein,
        totalCarbs: snackFood.carbs,
        totalFat: snackFood.fat,
        totalFiber: snackFood.fiber,
        notes: ''
      });
    }
  }

  await NutritionLog.insertMany(nutritionLogs);
  console.log(`✅ Created ${nutritionLogs.length} nutrition logs`);

  // ========================
  // GOALS - Realistic health goals
  // ========================
  const goals = [
    {
      userId,
      title: 'Giảm cân xuống 68kg',
      description: 'Mục tiêu giảm 4kg trong 2 tháng thông qua ăn uống lành mạnh và tập thể dục đều đặn',
      goalType: 'weight',
      startValue: 72,
      currentValue: 70.2,
      targetValue: 68,
      unit: 'kg',
      startDate: new Date(2025, 11, 1),
      targetDate: new Date(2026, 1, 28),
      status: 'active',
      progress: 45
    },
    {
      userId,
      title: 'Đi bộ 10,000 bước mỗi ngày',
      description: 'Duy trì thói quen vận động hàng ngày để cải thiện sức khỏe tim mạch',
      goalType: 'steps',
      startValue: 5000,
      currentValue: 7500,
      targetValue: 10000,
      unit: 'bước',
      startDate: new Date(2025, 11, 1),
      targetDate: new Date(2025, 11, 31),
      status: 'active',
      progress: 50
    },
    {
      userId,
      title: 'Hạ huyết áp xuống mức bình thường',
      description: 'Giảm huyết áp tâm thu xuống dưới 120 mmHg thông qua chế độ ăn ít muối và tập thể dục',
      goalType: 'bloodPressure',
      startValue: 135,
      currentValue: 125,
      targetValue: 120,
      unit: 'mmHg',
      startDate: new Date(2025, 11, 1),
      targetDate: new Date(2026, 2, 31),
      status: 'active',
      progress: 67
    },
    {
      userId,
      title: 'Ngủ đủ 7-8 tiếng mỗi đêm',
      description: 'Cải thiện chất lượng giấc ngủ bằng cách đi ngủ đúng giờ và giảm screen time',
      goalType: 'sleep',
      startValue: 6,
      currentValue: 7,
      targetValue: 7.5,
      unit: 'giờ',
      startDate: new Date(2025, 11, 1),
      targetDate: new Date(2025, 11, 31),
      status: 'active',
      progress: 67
    },
    {
      userId,
      title: 'Uống đủ 2 lít nước mỗi ngày',
      description: 'Duy trì thói quen uống nước đều đặn để cải thiện sức khỏe tổng thể',
      goalType: 'water',
      startValue: 1.2,
      currentValue: 1.8,
      targetValue: 2,
      unit: 'lít',
      startDate: new Date(2025, 11, 1),
      targetDate: new Date(2025, 11, 31),
      status: 'active',
      progress: 75
    },
    {
      userId,
      title: 'Tập thể dục 30 phút mỗi ngày',
      description: 'Dành ít nhất 30 phút mỗi ngày cho hoạt động thể chất',
      goalType: 'exercise',
      startValue: 15,
      currentValue: 25,
      targetValue: 30,
      unit: 'phút',
      startDate: new Date(2025, 11, 1),
      targetDate: new Date(2025, 11, 31),
      status: 'active',
      progress: 67
    },
    {
      userId,
      title: 'Giảm BMI xuống mức bình thường',
      description: 'Đạt BMI dưới 24 để có cân nặng khỏe mạnh',
      goalType: 'bmi',
      startValue: 24.3,
      currentValue: 23.7,
      targetValue: 23,
      unit: 'kg/m²',
      startDate: new Date(2025, 11, 1),
      targetDate: new Date(2026, 2, 1),
      status: 'active',
      progress: 46
    }
  ];

  await Goal.insertMany(goals);
  console.log(`✅ Created ${goals.length} goals`);

  console.log('\n🎉 Data seeding completed successfully!');
  console.log('Summary:');
  console.log(`  - Health Metrics: ${healthMetrics.length}`);
  console.log(`  - Mood Logs: ${moodLogs.length}`);
  console.log(`  - Nutrition Logs: ${nutritionLogs.length}`);
  console.log(`  - Goals: ${goals.length}`);

  mongoose.disconnect();
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
