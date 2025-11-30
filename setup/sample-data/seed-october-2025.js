const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../../src/server/.env' });

// Cấu hình MongoDB từ environment variables
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/phihub';
const DB_NAME = 'phihub';

// Ngày bắt đầu: 25/10/2025
const START_DATE = new Date('2025-10-25T00:00:00');

// Ngày kết thúc: 25/11/2025
const END_DATE = new Date('2025-11-25T23:59:59');

console.log(`📅 Tạo dữ liệu từ ${START_DATE.toLocaleDateString('vi-VN')} đến ${END_DATE.toLocaleDateString('vi-VN')}`);
const DAYS = Math.ceil((END_DATE - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
console.log(`   Tổng số ngày: ${DAYS} ngày\n`);

console.log(`📅 Tạo dữ liệu từ ${START_DATE.toLocaleDateString('vi-VN')} đến ${END_DATE.toLocaleDateString('vi-VN')} (${DAYS} ngày)\n`);

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Đang kết nối MongoDB...');
    await client.connect();
    console.log('✅ Kết nối thành công!\n');

    const db = client.db(DB_NAME);

    // XÓA TOÀN BỘ DỮ LIỆU CŨ
    console.log('🗑️  Đang xóa dữ liệu cũ...');
    await db.collection('users').deleteMany({});
    await db.collection('healthmetrics').deleteMany({});
    await db.collection('goals').deleteMany({});
    await db.collection('nutritions').deleteMany({});
    await db.collection('moodlogs').deleteMany({});
    await db.collection('reminders').deleteMany({});
    await db.collection('alerts').deleteMany({});
    await db.collection('articles').deleteMany({});
    console.log('✅ Đã xóa dữ liệu cũ\n');

    // ===========================================
    // 1. TẠO 1 USER DUY NHẤT
    // ===========================================
    console.log('👤 Đang tạo user...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const userResult = await db.collection('users').insertOne({
      name: 'Phan Khoa',
      email: 'phankhoavn@gmail.com',
      password: hashedPassword,
      dob: new Date('1995-03-15'),
      gender: 'male',
      phone: '0901234567',
      address: 'TP. Hồ Chí Minh',
      avatar: 'https://ui-avatars.com/api/?name=Phan+Khoa&background=13ec80&color=fff&size=200',
      medicalInfo: {
        height: 172,
        bloodType: 'O+',
        chronicConditions: [],
        allergies: [],
        medications: [],
        emergencyContact: {
          name: 'Nguyễn Thị B',
          relationship: 'Mẹ',
          phone: '0912345678'
        },
        doctor: {
          name: 'BS. Trần Văn A',
          specialty: 'Nội khoa',
          phone: '0923456789',
          hospital: 'Bệnh viện Đa khoa TP.HCM'
        }
      },
      preferences: {
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      createdAt: START_DATE,
      updatedAt: new Date()
    });

    const userId = userResult.insertedId;
    console.log('✅ User: phankhoavn@gmail.com (Password: 123456)\n');

    // ===========================================
    // 2. HEALTH METRICS - 32 NGÀY ĐẦY ĐỦ
    // ===========================================
    console.log(`📊 Đang tạo Health Metrics cho ${DAYS} ngày...`);
    const metrics = [];

    // Base values
    let currentWeight = 75.5;
    const targetWeight = 72.0;
    const dailyWeightLoss = (currentWeight - targetWeight) / DAYS;

    for (let day = 0; day < DAYS; day++) {
      const date = new Date(START_DATE);
      date.setDate(date.getDate() + day);
      
      // Cân nặng giảm dần theo xu hướng
      currentWeight -= dailyWeightLoss + (Math.random() * 0.2 - 0.1);
      const weight = Number(currentWeight.toFixed(1));
      
      // 1. Cân nặng (mỗi sáng 7h)
      metrics.push({
        userId,
        metricType: 'weight',
        value: weight,
        unit: 'kg',
        timestamp: new Date(date.setHours(7, 0, 0, 0)),
        notes: day % 7 === 0 ? 'Đo cân buổi sáng, bụng đói' : ''
      });

      // 2. BMI (tính từ weight và height 172cm)
      const bmi = weight / ((172/100) ** 2);
      metrics.push({
        userId,
        metricType: 'bmi',
        value: Number(bmi.toFixed(1)),
        unit: 'kg/m²',
        timestamp: new Date(date.setHours(7, 5, 0, 0)),
        notes: bmi < 18.5 ? 'Thiếu cân' : bmi < 25 ? 'Bình thường' : 'Thừa cân'
      });

      // 3. Huyết áp (mỗi sáng 7h30)
      const systolic = 118 + Math.floor(Math.random() * 8);
      const diastolic = 78 + Math.floor(Math.random() * 6);
      metrics.push({
        userId,
        metricType: 'bloodPressure',
        value: systolic,
        unit: 'mmHg',
        timestamp: new Date(date.setHours(7, 30, 0, 0)),
        notes: `${systolic}/${diastolic}`,
        metadata: { systolic, diastolic }
      });

      // 4. Nhịp tim nghỉ (mỗi sáng 7h35)
      const heartRate = 68 + Math.floor(Math.random() * 10);
      metrics.push({
        userId,
        metricType: 'heartRate',
        value: heartRate,
        unit: 'bpm',
        timestamp: new Date(date.setHours(7, 35, 0, 0)),
        notes: heartRate < 60 ? 'Nhịp tim chậm' : heartRate > 100 ? 'Nhịp tim nhanh' : 'Bình thường'
      });

      // 5. Giấc ngủ (ghi nhận lúc 6h sáng)
      const sleepHours = 6.5 + Math.random() * 2;
      metrics.push({
        userId,
        metricType: 'sleep',
        value: Number(sleepHours.toFixed(1)),
        unit: 'giờ',
        timestamp: new Date(date.setHours(6, 0, 0, 0)),
        notes: sleepHours < 7 ? 'Thiếu ngủ' : sleepHours > 8 ? 'Ngủ nhiều' : 'Đủ giấc',
        metadata: {
          deep: Number((sleepHours * 0.3).toFixed(1)),
          light: Number((sleepHours * 0.5).toFixed(1)),
          rem: Number((sleepHours * 0.2).toFixed(1))
        }
      });

      // 6. Chất lượng giấc ngủ (1-10)
      const sleepQuality = 6 + Math.floor(Math.random() * 4);
      metrics.push({
        userId,
        metricType: 'sleepQuality',
        value: sleepQuality,
        unit: 'điểm',
        timestamp: new Date(date.setHours(6, 5, 0, 0)),
        notes: sleepQuality < 5 ? 'Kém' : sleepQuality < 7 ? 'Trung bình' : 'Tốt'
      });

      // 7. Đường huyết (đo mỗi 2 ngày, lúc 6h30)
      if (day % 2 === 0) {
        const bloodSugar = 90 + Math.floor(Math.random() * 15);
        metrics.push({
          userId,
          metricType: 'bloodSugar',
          value: bloodSugar,
          unit: 'mg/dL',
          timestamp: new Date(date.setHours(6, 30, 0, 0)),
          notes: bloodSugar < 70 ? 'Thấp' : bloodSugar > 100 ? 'Cao' : 'Bình thường'
        });
      }

      // 8. Số bước chân (ghi nhận lúc 22h)
      const steps = 7000 + Math.floor(Math.random() * 5000);
      metrics.push({
        userId,
        metricType: 'steps',
        value: steps,
        unit: 'bước',
        timestamp: new Date(date.setHours(22, 0, 0, 0)),
        notes: steps >= 10000 ? '✅ Đạt mục tiêu 10,000 bước' : '⚠️ Chưa đạt 10,000 bước'
      });

      // 9. Thời gian tập luyện (5 ngày/tuần, không tập thứ 7 và CN)
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const exerciseMinutes = 30 + Math.floor(Math.random() * 45);
        const exerciseTypes = ['Chạy bộ', 'Gym', 'Yoga', 'Bơi lội', 'Đạp xe', 'HIIT'];
        metrics.push({
          userId,
          metricType: 'exercise',
          value: exerciseMinutes,
          unit: 'phút',
          timestamp: new Date(date.setHours(17, 30, 0, 0)),
          notes: exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)],
          metadata: {
            type: exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)],
            intensity: ['Nhẹ', 'Trung bình', 'Cao'][Math.floor(Math.random() * 3)]
          }
        });
      }

      // 10. Lượng nước uống (ghi nhận lúc 21h)
      const waterIntake = 2.0 + Math.random() * 1.0;
      metrics.push({
        userId,
        metricType: 'water',
        value: Number(waterIntake.toFixed(1)),
        unit: 'lít',
        timestamp: new Date(date.setHours(21, 0, 0, 0)),
        notes: waterIntake < 2 ? '⚠️ Cần uống nhiều nước hơn' : '✅ Đủ nước'
      });

      // 11. Calories tiêu hao (ghi nhận lúc 23h)
      const calories = 2000 + Math.floor(Math.random() * 500);
      metrics.push({
        userId,
        metricType: 'calories',
        value: calories,
        unit: 'kcal',
        timestamp: new Date(date.setHours(23, 0, 0, 0)),
        notes: 'Tổng calories tiêu hao trong ngày'
      });
    }

    await db.collection('healthmetrics').insertMany(metrics);
    console.log(`✅ Đã tạo ${metrics.length} health metrics\n`);

    // ===========================================
    // 3. GOALS (MỤC TIÊU)
    // ===========================================
    console.log('🎯 Đang tạo Goals...');
    const goals = [
      {
        userId,
        title: 'Giảm cân về 72kg',
        description: 'Giảm từ 75.5kg xuống 72kg trong tháng 10',
        goalType: 'weight',
        targetValue: 72,
        startValue: 75.5,
        currentValue: currentWeight,
        unit: 'kg',
        startDate: START_DATE,
        targetDate: END_DATE,
        status: 'active',
        progress: ((75.5 - currentWeight) / (75.5 - 72) * 100).toFixed(1),
        milestones: [
          { value: 75, date: new Date('2025-10-05'), achieved: true },
          { value: 74, date: new Date('2025-10-15'), achieved: true },
          { value: 73, date: new Date('2025-10-25'), achieved: currentWeight <= 73 },
          { value: 72, date: END_DATE, achieved: false }
        ]
      },
      {
        userId,
        title: 'Tập thể dục 150 phút/tuần',
        description: 'Duy trì tập luyện ít nhất 150 phút mỗi tuần',
        goalType: 'exercise',
        targetValue: 150,
        startValue: 90,
        currentValue: 135,
        unit: 'phút',
        startDate: START_DATE,
        targetDate: END_DATE,
        status: 'active',
        progress: 75
      },
      {
        userId,
        title: 'Ngủ đủ 7-8 giờ mỗi đêm',
        description: 'Cải thiện chất lượng giấc ngủ',
        goalType: 'sleep',
        targetValue: 7.5,
        startValue: 6.2,
        currentValue: 7.2,
        unit: 'giờ',
        startDate: START_DATE,
        targetDate: END_DATE,
        status: 'active',
        progress: 80
      },
      {
        userId,
        title: 'Đi bộ 10,000 bước mỗi ngày',
        description: 'Duy trì hoạt động thể chất hàng ngày',
        goalType: 'steps',
        targetValue: 10000,
        startValue: 6000,
        currentValue: 9200,
        unit: 'bước',
        startDate: START_DATE,
        targetDate: END_DATE,
        status: 'active',
        progress: 82
      },
      {
        userId,
        title: 'Uống 2.5 lít nước mỗi ngày',
        description: 'Duy trì đủ lượng nước cho cơ thể',
        goalType: 'water',
        targetValue: 2.5,
        startValue: 1.8,
        currentValue: 2.3,
        unit: 'lít',
        startDate: START_DATE,
        targetDate: END_DATE,
        status: 'active',
        progress: 70
      }
    ];

    await db.collection('goals').insertMany(goals);
    console.log(`✅ Đã tạo ${goals.length} goals\n`);

    // ===========================================
    // 4. NUTRITION (NHẬT KÝ DINH DƯỠNG)
    // ===========================================
    console.log('🍽️  Đang tạo Nutrition logs...');
    const nutritionLogs = [];

    const meals = {
      breakfast: [
        { name: 'Phở bò', calories: 450, protein: 25, carbs: 60, fats: 12, fiber: 3 },
        { name: 'Bánh mì thịt trứng', calories: 420, protein: 22, carbs: 48, fats: 16, fiber: 2 },
        { name: 'Cháo gà', calories: 320, protein: 20, carbs: 42, fats: 8, fiber: 1 },
        { name: 'Yến mạch sữa', calories: 280, protein: 12, carbs: 45, fats: 6, fiber: 5 },
        { name: 'Trứng ốp la + bánh mì', calories: 380, protein: 18, carbs: 40, fats: 15, fiber: 2 }
      ],
      lunch: [
        { name: 'Cơm gà nướng', calories: 650, protein: 38, carbs: 72, fats: 18, fiber: 4 },
        { name: 'Cơm sườn nướng', calories: 720, protein: 35, carbs: 78, fats: 24, fiber: 3 },
        { name: 'Bún bò Huế', calories: 580, protein: 30, carbs: 68, fats: 20, fiber: 3 },
        { name: 'Cơm tấm sườn bì', calories: 680, protein: 32, carbs: 75, fats: 22, fiber: 2 },
        { name: 'Mì xào hải sản', calories: 620, protein: 28, carbs: 70, fats: 24, fiber: 4 }
      ],
      dinner: [
        { name: 'Cơm + cá kho + rau', calories: 550, protein: 35, carbs: 60, fats: 15, fiber: 5 },
        { name: 'Cơm + gà xào + canh', calories: 580, protein: 38, carbs: 62, fats: 16, fiber: 4 },
        { name: 'Bún riêu cua', calories: 480, protein: 25, carbs: 58, fats: 14, fiber: 3 },
        { name: 'Cơm + canh chua', calories: 520, protein: 28, carbs: 64, fats: 12, fiber: 4 },
        { name: 'Salad ức gà', calories: 380, protein: 35, carbs: 25, fats: 15, fiber: 6 }
      ],
      snack: [
        { name: 'Trái cây tươi', calories: 120, protein: 2, carbs: 30, fats: 0.5, fiber: 4 },
        { name: 'Sữa chua Hy Lạp', calories: 150, protein: 12, carbs: 18, fats: 4, fiber: 0 },
        { name: 'Hạt hỗn hợp', calories: 180, protein: 6, carbs: 12, fats: 14, fiber: 3 },
        { name: 'Sinh tố xanh', calories: 160, protein: 5, carbs: 32, fats: 2, fiber: 5 }
      ]
    };

    for (let day = 0; day < DAYS; day++) {
      const currentDay = new Date(START_DATE);
      currentDay.setDate(currentDay.getDate() + day);
      
      // Date at midnight for nutrition log
      const dateOnly = new Date(currentDay);
      dateOnly.setHours(0, 0, 0, 0);

      // Breakfast
      const breakfast = meals.breakfast[Math.floor(Math.random() * meals.breakfast.length)];
      const breakfastTime = new Date(currentDay);
      breakfastTime.setHours(7, 30, 0, 0);
      
      nutritionLogs.push({
        userId,
        date: new Date(dateOnly),
        mealType: 'breakfast',
        foodItems: [{
          name: breakfast.name,
          quantity: 1,
          unit: 'phần',
          calories: breakfast.calories,
          macros: {
            protein: breakfast.protein,
            carbs: breakfast.carbs,
            fats: breakfast.fats,
            fiber: breakfast.fiber
          }
        }],
        totalCalories: breakfast.calories,
        totalMacros: {
          protein: breakfast.protein,
          carbs: breakfast.carbs,
          fats: breakfast.fats,
          fiber: breakfast.fiber
        },
        notes: '',
        createdAt: breakfastTime,
        updatedAt: breakfastTime
      });

      // Lunch
      const lunch = meals.lunch[Math.floor(Math.random() * meals.lunch.length)];
      const lunchTime = new Date(currentDay);
      lunchTime.setHours(12, 30, 0, 0);
      
      nutritionLogs.push({
        userId,
        date: new Date(dateOnly),
        mealType: 'lunch',
        foodItems: [{
          name: lunch.name,
          quantity: 1,
          unit: 'phần',
          calories: lunch.calories,
          macros: {
            protein: lunch.protein,
            carbs: lunch.carbs,
            fats: lunch.fats,
            fiber: lunch.fiber
          }
        }],
        totalCalories: lunch.calories,
        totalMacros: {
          protein: lunch.protein,
          carbs: lunch.carbs,
          fats: lunch.fats,
          fiber: lunch.fiber
        },
        notes: '',
        createdAt: lunchTime,
        updatedAt: lunchTime
      });

      // Dinner
      const dinner = meals.dinner[Math.floor(Math.random() * meals.dinner.length)];
      const dinnerTime = new Date(currentDay);
      dinnerTime.setHours(19, 0, 0, 0);
      
      nutritionLogs.push({
        userId,
        date: new Date(dateOnly),
        mealType: 'dinner',
        foodItems: [{
          name: dinner.name,
          quantity: 1,
          unit: 'phần',
          calories: dinner.calories,
          macros: {
            protein: dinner.protein,
            carbs: dinner.carbs,
            fats: dinner.fats,
            fiber: dinner.fiber
          }
        }],
        totalCalories: dinner.calories,
        totalMacros: {
          protein: dinner.protein,
          carbs: dinner.carbs,
          fats: dinner.fats,
          fiber: dinner.fiber
        },
        notes: '',
        createdAt: dinnerTime,
        updatedAt: dinnerTime
      });

      // Snack (70% chance)
      if (Math.random() > 0.3) {
        const snack = meals.snack[Math.floor(Math.random() * meals.snack.length)];
        const snackTime = new Date(currentDay);
        snackTime.setHours(15, 0, 0, 0);
        
        nutritionLogs.push({
          userId,
          date: new Date(dateOnly),
          mealType: 'snack',
          foodItems: [{
            name: snack.name,
            quantity: 1,
            unit: 'phần',
            calories: snack.calories,
            macros: {
              protein: snack.protein,
              carbs: snack.carbs,
              fats: snack.fats,
              fiber: snack.fiber
            }
          }],
          totalCalories: snack.calories,
          totalMacros: {
            protein: snack.protein,
            carbs: snack.carbs,
            fats: snack.fats,
            fiber: snack.fiber
          },
          notes: '',
          createdAt: snackTime,
          updatedAt: snackTime
        });
      }
    }

    await db.collection('nutritions').insertMany(nutritionLogs);
    console.log(`✅ Đã tạo ${nutritionLogs.length} nutrition logs\n`);

    // ===========================================
    // 5. MOOD LOGS (NHẬT KÝ TÂM TRẠNG)
    // ===========================================
    console.log('😊 Đang tạo Mood logs...');
    const moodLogs = [];

    const moods = ['terrible', 'bad', 'okay', 'good', 'excellent'];
    const emotions = ['happy', 'sad', 'anxious', 'excited', 'tired', 'motivated', 'grateful', 'peaceful'];
    const activities = ['work', 'exercise', 'social', 'family', 'hobby', 'meditation', 'relaxation'];

    for (let day = 0; day < DAYS; day++) {
      const date = new Date(START_DATE);
      date.setDate(date.getDate() + day);
      date.setHours(20, 30, 0, 0);

      // Mood thiên về positive (70%)
      const moodIndex = Math.random() < 0.7 
        ? 3 + Math.floor(Math.random() * 2)
        : Math.floor(Math.random() * 5);
      
      const moodScore = moodIndex * 2 + 1 + Math.floor(Math.random() * 2);
      const energyScore = Math.max(1, Math.min(10, moodScore + (Math.random() * 2 - 1)));
      const stressScore = Math.max(1, Math.min(10, 10 - moodScore + (Math.random() * 2)));

      moodLogs.push({
        userId,
        date,
        mood: moods[moodIndex],
        moodScore,
        energy: energyScore >= 8 ? 'very_high' : energyScore >= 6 ? 'high' : energyScore >= 4 ? 'medium' : 'low',
        energyScore,
        stress: stressScore >= 8 ? 'very_high' : stressScore >= 6 ? 'high' : stressScore >= 4 ? 'medium' : 'low',
        stressScore,
        anxiety: Math.max(0, Math.min(10, stressScore + (Math.random() * 2 - 1))),
        activities: activities.slice(0, 2 + Math.floor(Math.random() * 3)),
        emotions: emotions.slice(0, 1 + Math.floor(Math.random() * 3)),
        triggers: Math.random() > 0.7 ? ['Công việc', 'Deadline'][Math.floor(Math.random() * 2)] : [],
        journal: [
          'Hôm nay cảm thấy rất tốt, năng lượng tràn đầy',
          'Công việc hơi căng thẳng nhưng vẫn ổn',
          'Ngủ đủ giấc nên tinh thần rất sảng khoái',
          'Tập luyện nhiều nên cơ thể khỏe hơn',
          'Gặp bạn bè nên tâm trạng vui vẻ',
          'Hơi mệt vì công việc nhiều',
          'Tâm trạng bình thường, không có gì đặc biệt'
        ][Math.floor(Math.random() * 7)],
        gratitude: Math.random() > 0.5 ? ['Sức khỏe tốt', 'Gia đình', 'Bạn bè'] : [],
        sleepQuality: 5 + Math.floor(Math.random() * 5),
        productivity: 5 + Math.floor(Math.random() * 5),
        createdAt: date,
        updatedAt: date
      });
    }

    await db.collection('moodlogs').insertMany(moodLogs);
    console.log(`✅ Đã tạo ${moodLogs.length} mood logs\n`);

    // ===========================================
    // 6. REMINDERS (NHẮC NHỞ)
    // ===========================================
    console.log('⏰ Đang tạo Reminders...');
    const reminders = [
      { title: 'Uống nước', message: 'Đã đến giờ uống nước, hãy bổ sung nước cho cơ thể', type: 'water', time: '09:00', frequency: 'daily' },
      { title: 'Uống nước', message: 'Nhắc nhở uống nước buổi chiều', type: 'water', time: '15:00', frequency: 'daily' },
      { title: 'Tập thể dục', message: 'Đã đến giờ tập luyện!', type: 'exercise', time: '17:30', frequency: 'daily', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
      { title: 'Đo cân', message: 'Đo cân nặng buổi sáng', type: 'measurement', time: '07:00', frequency: 'daily' },
      { title: 'Đo huyết áp', message: 'Đã đến giờ đo huyết áp', type: 'measurement', time: '07:30', frequency: 'daily' },
      { title: 'Chuẩn bị đi ngủ', message: 'Đã muộn rồi, hãy đi ngủ để ngủ đủ 8 tiếng', type: 'sleep', time: '22:30', frequency: 'daily' },
      { title: 'Ăn trưa', message: 'Đã đến giờ ăn trưa', type: 'meal', time: '12:00', frequency: 'daily' },
      { title: 'Ăn tối', message: 'Đã đến giờ ăn tối', type: 'meal', time: '18:30', frequency: 'daily' }
    ];

    const reminderDocs = reminders.map(r => ({
      userId,
      title: r.title,
      message: r.message,
      type: r.type,
      frequency: r.frequency,
      time: r.time,
      days: r.days || [],
      startDate: START_DATE,
      endDate: null,
      enabled: true,
      lastSent: null,
      nextScheduled: null,
      createdAt: START_DATE,
      updatedAt: START_DATE
    }));

    await db.collection('reminders').insertMany(reminderDocs);
    console.log(`✅ Đã tạo ${reminderDocs.length} reminders\n`);

    // ===========================================
    // 7. ALERTS (CẢNH BÁO)
    // ===========================================
    console.log('🚨 Đang tạo Alerts...');
    const alerts = [];

    const alertTemplates = [
      { type: 'warning', category: 'health_metric', title: 'Thiếu ngủ', message: 'Bạn chỉ ngủ 5.5 giờ đêm qua. Cần ngủ đủ 7-8 giờ!', severity: 'medium', metricType: 'sleep' },
      { type: 'info', category: 'goal', title: 'Đạt mục tiêu bước chân', message: 'Chúc mừng! Bạn đã đi được 12,000 bước hôm nay', severity: 'low' },
      { type: 'warning', category: 'health_metric', title: 'Thiếu nước', message: 'Bạn chỉ uống 1.5L nước hôm nay. Hãy uống thêm!', severity: 'medium', metricType: 'water' },
      { type: 'danger', category: 'health_metric', title: 'Huyết áp cao', message: 'Huyết áp 138/88 mmHg, cao hơn bình thường. Cần theo dõi!', severity: 'high', metricType: 'bloodPressure' },
      { type: 'success', category: 'goal', title: 'Hoàn thành mục tiêu tuần', message: 'Bạn đã tập luyện đủ 150 phút tuần này!', severity: 'low' }
    ];

    for (let i = 0; i < 15; i++) {
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      const alertDate = new Date(START_DATE);
      alertDate.setDate(alertDate.getDate() + Math.floor(Math.random() * 30));

      alerts.push({
        userId,
        type: template.type,
        category: template.category,
        title: template.title,
        message: template.message,
        severity: template.severity,
        metricType: template.metricType || null,
        isRead: Math.random() > 0.4,
        isResolved: Math.random() > 0.6,
        actionRequired: template.severity === 'high' || template.severity === 'critical',
        createdAt: alertDate,
        updatedAt: alertDate
      });
    }

    await db.collection('alerts').insertMany(alerts);
    console.log(`✅ Đã tạo ${alerts.length} alerts\n`);

    // ===========================================
    // 8. ARTICLES (BÀI VIẾT KIẾN THỨC)
    // ===========================================
    console.log('📚 Đang tạo Articles...');
    const articles = [
      {
        title: '7 Thói quen Ăn uống Lành mạnh cho Sức khỏe Tốt',
        content: 'Chế độ ăn uống lành mạnh là nền tảng của sức khỏe tốt...',
        category: 'Dinh dưỡng',
        excerpt: 'Khám phá 7 thói quen ăn uống giúp bạn duy trì sức khỏe tốt và năng lượng dồi dào mỗi ngày.',
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
        source: 'PHIHub Health Team',
        publishedAt: new Date('2025-10-01'),
        views: 245,
        createdAt: new Date('2025-10-01'),
        updatedAt: new Date('2025-10-01')
      },
      {
        title: 'Lợi ích của Việc Tập thể dục 30 phút Mỗi ngày',
        content: 'Tập thể dục đều đặn mang lại nhiều lợi ích cho sức khỏe...',
        category: 'Thể chất',
        excerpt: 'Tìm hiểu những lợi ích tuyệt vời của việc dành 30 phút mỗi ngày cho việc tập luyện.',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
        source: 'BS. Nguyễn Văn A',
        publishedAt: new Date('2025-10-05'),
        views: 189,
        createdAt: new Date('2025-10-05'),
        updatedAt: new Date('2025-10-05')
      },
      {
        title: 'Cách Quản lý Stress trong Cuộc sống Hiện đại',
        content: 'Stress là vấn đề phổ biến trong cuộc sống hiện đại...',
        category: 'Tinh thần',
        excerpt: 'Học cách quản lý stress hiệu quả để cải thiện chất lượng cuộc sống và sức khỏe tinh thần.',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        source: 'Th.S Tâm lý Trần Thị B',
        publishedAt: new Date('2025-10-10'),
        views: 312,
        createdAt: new Date('2025-10-10'),
        updatedAt: new Date('2025-10-10')
      },
      {
        title: 'Giấc ngủ Chất lượng: Chìa khóa Sức khỏe Toàn diện',
        content: 'Giấc ngủ đóng vai trò quan trọng trong sức khỏe tổng thể...',
        category: 'Tinh thần',
        excerpt: 'Tầm quan trọng của giấc ngủ chất lượng và cách cải thiện thói quen ngủ của bạn.',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
        source: 'TS. Phạm Văn C',
        publishedAt: new Date('2025-10-15'),
        views: 278,
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15')
      },
      {
        title: 'Phòng ngừa Bệnh tim Mạch: Hướng dẫn Toàn diện',
        content: 'Bệnh tim mạch là nguyên nhân gây tử vong hàng đầu...',
        category: 'Chung',
        excerpt: 'Hướng dẫn chi tiết về cách phòng ngừa bệnh tim mạch thông qua lối sống lành mạnh.',
        imageUrl: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800',
        source: 'PGS.TS. Lê Văn D',
        publishedAt: new Date('2025-10-20'),
        views: 401,
        createdAt: new Date('2025-10-20'),
        updatedAt: new Date('2025-10-20')
      }
    ];

    await db.collection('articles').insertMany(articles);
    console.log(`✅ Đã tạo ${articles.length} articles\n`);

    // ===========================================
    // 9. TẠO INDEXES
    // ===========================================
    console.log('🔍 Đang tạo indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('healthmetrics').createIndex({ userId: 1, metricType: 1, timestamp: -1 });
    await db.collection('healthmetrics').createIndex({ timestamp: 1 });
    await db.collection('goals').createIndex({ userId: 1, status: 1 });
    await db.collection('nutritions').createIndex({ userId: 1, date: -1 });
    await db.collection('moodlogs').createIndex({ userId: 1, date: -1 });
    await db.collection('reminders').createIndex({ userId: 1, enabled: 1 });
    await db.collection('alerts').createIndex({ userId: 1, isRead: 1, createdAt: -1 });
    await db.collection('articles').createIndex({ publishedAt: -1 });
    console.log('✅ Đã tạo indexes\n');

    // ===========================================
    // 10. THỐNG KÊ
    // ===========================================
    console.log('\n═══════════════════════════════════════════');
    console.log(`📊 THỐNG KÊ DATABASE - ${DAYS} NGÀY`);
    console.log('═══════════════════════════════════════════\n');

    const stats = {
      users: await db.collection('users').countDocuments(),
      healthmetrics: await db.collection('healthmetrics').countDocuments(),
      goals: await db.collection('goals').countDocuments(),
      nutritions: await db.collection('nutritions').countDocuments(),
      moodlogs: await db.collection('moodlogs').countDocuments(),
      reminders: await db.collection('reminders').countDocuments(),
      alerts: await db.collection('alerts').countDocuments(),
      articles: await db.collection('articles').countDocuments()
    };

    console.log(`👤 Users:          ${stats.users}`);
    console.log(`📊 Health Metrics: ${stats.healthmetrics}`);
    console.log(`🎯 Goals:          ${stats.goals}`);
    console.log(`🍽️  Nutrition:      ${stats.nutritions}`);
    console.log(`😊 Mood Logs:      ${stats.moodlogs}`);
    console.log(`⏰ Reminders:      ${stats.reminders}`);
    console.log(`🚨 Alerts:         ${stats.alerts}`);
    console.log(`📚 Articles:       ${stats.articles}`);

    console.log('\n───────────────────────────────────────────────');
    console.log('📈 CHI TIẾT HEALTH METRICS:');
    console.log('───────────────────────────────────────────────\n');

    const metricTypes = await db.collection('healthmetrics').distinct('metricType');
    for (const type of metricTypes.sort()) {
      const count = await db.collection('healthmetrics').countDocuments({ metricType: type });
      console.log(`   ✓ ${type.padEnd(18)}: ${count.toString().padStart(3)} records`);
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ IMPORT HOÀN TẤT!');
    console.log('═══════════════════════════════════════════════\n');
    console.log('🔐 Thông tin đăng nhập:');
    console.log('   Email:    phankhoavn@gmail.com');
    console.log('   Password: 123456\n');
    console.log(`📅 Dữ liệu: ${START_DATE.toLocaleDateString('vi-VN')} - ${END_DATE.toLocaleDateString('vi-VN')} (${DAYS} ngày)`);
    console.log('🎯 1 user duy nhất với đầy đủ dữ liệu\n');
    console.log('');

  } catch (error) {
    console.error('❌ LỖI:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.close();
    console.log('👋 Đã đóng kết nối MongoDB\n');
  }
}

// Chạy script
seedDatabase();
