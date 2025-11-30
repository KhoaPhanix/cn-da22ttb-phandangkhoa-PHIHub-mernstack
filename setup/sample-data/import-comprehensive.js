const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Cấu hình MongoDB
const MONGODB_URI = 'mongodb+srv://admin:Silnix13670@healthtracker.xmrtodc.mongodb.net/phihub?retryWrites=true&w=majority&appName=HealthTracker';
const DB_NAME = 'phihub';

// Kiểm tra clean flag
const shouldClean = process.argv.includes('--clean');

// Helper function để tạo ngày giờ ngẫu nhiên trong khoảng
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function để lấy ngày bắt đầu (30 ngày trước)
function getStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  date.setHours(0, 0, 0, 0);
  return date;
}

async function importComprehensiveData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Đang kết nối MongoDB...');
    await client.connect();
    console.log('✅ Kết nối thành công!\n');

    const db = client.db(DB_NAME);

    // Xóa dữ liệu cũ nếu có flag --clean
    if (shouldClean) {
      console.log('🗑️  Đang xóa TOÀN BỘ dữ liệu cũ...');
      await db.collection('articles').deleteMany({});
      await db.collection('users').deleteMany({});
      await db.collection('health_metrics').deleteMany({});
      await db.collection('goals').deleteMany({});
      await db.collection('nutrition').deleteMany({});
      await db.collection('mood_logs').deleteMany({});
      await db.collection('reminders').deleteMany({});
      await db.collection('alerts').deleteMany({});
      console.log('✅ Đã xóa toàn bộ dữ liệu cũ\n');
    }

    const startDate = getStartDate();
    const now = new Date();

    // =============================================
    // 1. IMPORT ARTICLES (Góc kiến thức)
    // =============================================
    console.log('📚 Đang import bài viết...');
    const articlesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf-8')
    );
    const articlesResult = await db.collection('articles').insertMany(articlesData);
    console.log(`✅ Đã import ${articlesResult.insertedCount} bài viết\n`);

    // =============================================
    // 2. CREATE TEST USERS
    // =============================================
    console.log('👤 Đang tạo tài khoản test...');
    const hashedPassword1 = await bcrypt.hash('Test123456', 10);
    const hashedPassword2 = await bcrypt.hash('Demo123456', 10);
    const hashedPassword3 = await bcrypt.hash('Admin123456', 10);

    const users = [
      {
        name: 'Nguyễn Văn Test',
        email: 'test@phihub.com',
        password: hashedPassword1,
        dob: new Date('1990-01-15'),
        gender: 'male',
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        emergencyContact: {
          name: 'Nguyễn Thị B',
          phone: '0912345678',
          relationship: 'Vợ'
        },
        medicalHistory: {
          bloodType: 'O+',
          allergies: ['Penicillin'],
          chronicConditions: [],
          currentMedications: []
        },
        createdAt: new Date(startDate),
        updatedAt: new Date()
      },
      {
        name: 'Trần Thị Demo',
        email: 'demo@phihub.com',
        password: hashedPassword2,
        dob: new Date('1995-05-20'),
        gender: 'female',
        phone: '0907654321',
        address: '456 Đường XYZ, Quận 3, TP.HCM',
        emergencyContact: {
          name: 'Trần Văn C',
          phone: '0923456789',
          relationship: 'Chồng'
        },
        medicalHistory: {
          bloodType: 'A+',
          allergies: [],
          chronicConditions: ['Tiểu đường type 2'],
          currentMedications: ['Metformin 500mg']
        },
        createdAt: new Date(startDate),
        updatedAt: new Date()
      },
      {
        name: 'Admin Khoa Phan',
        email: 'admin@phihub.com',
        password: hashedPassword3,
        dob: new Date('1988-12-10'),
        gender: 'male',
        phone: '0909999888',
        address: '789 Đường DEF, Quận 5, TP.HCM',
        role: 'admin',
        createdAt: new Date(startDate),
        updatedAt: new Date()
      }
    ];

    const usersResult = await db.collection('users').insertMany(users);
    const userIds = Object.values(usersResult.insertedIds);
    console.log(`✅ Đã tạo ${usersResult.insertedCount} tài khoản`);
    console.log('   - test@phihub.com (Password: Test123456)');
    console.log('   - demo@phihub.com (Password: Demo123456)');
    console.log('   - admin@phihub.com (Password: Admin123456)\n');

    // =============================================
    // 3. HEALTH METRICS (30 ngày - ĐẦY ĐỦ CHỈ SỐ)
    // =============================================
    console.log('📊 Đang tạo Health Metrics (30 ngày - đầy đủ chỉ số)...');
    const metrics = [];

    for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
      const userId = userIds[userIndex];
      const user = users[userIndex];
      
      // Base values theo gender
      const baseWeight = user.gender === 'male' ? 75 : 58;
      const baseHeight = user.gender === 'male' ? 172 : 160;
      const baseBP_sys = 120;
      const baseBP_dia = 80;
      const baseHeartRate = 72;
      const baseBodyFat = user.gender === 'male' ? 18 : 25;
      const baseBloodSugar = 95;

      // Tạo 30 ngày dữ liệu
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Thời điểm đo buổi sáng (6-8h)
        const measureTime = new Date(date);
        measureTime.setHours(6 + Math.random() * 2, Math.random() * 60, 0, 0);

        // 1. Weight (Cân nặng) - dao động nhẹ theo xu hướng giảm
        const weightTrend = -i * 0.05; // Giảm 0.05kg/ngày
        metrics.push({
          userId: userId,
          metricType: 'weight',
          value: Number((baseWeight + weightTrend + (Math.random() * 0.6 - 0.3)).toFixed(2)),
          unit: 'kg',
          timestamp: measureTime,
          notes: i % 7 === 0 ? 'Đo vào sáng sớm, bụng đói' : '',
          createdAt: measureTime,
          updatedAt: measureTime
        });

        // 2. Height (Chiều cao) - chỉ đo 1 lần đầu tháng
        if (i === 0) {
          metrics.push({
            userId: userId,
            metricType: 'height',
            value: baseHeight,
            unit: 'cm',
            timestamp: measureTime,
            notes: 'Đo chiều cao',
            createdAt: measureTime,
            updatedAt: measureTime
          });
        }

        // 3. BMI - tính từ weight và height
        const currentWeight = baseWeight + weightTrend + (Math.random() * 0.6 - 0.3);
        const bmi = currentWeight / ((baseHeight / 100) ** 2);
        metrics.push({
          userId: userId,
          metricType: 'bmi',
          value: Number(bmi.toFixed(1)),
          unit: 'kg/m²',
          timestamp: measureTime,
          notes: bmi < 18.5 ? 'Thiếu cân' : bmi < 25 ? 'Bình thường' : bmi < 30 ? 'Thừa cân' : 'Béo phì',
          createdAt: measureTime,
          updatedAt: measureTime
        });

        // 4. Blood Pressure (Huyết áp)
        const bpTime = new Date(date);
        bpTime.setHours(7 + Math.random() * 2, Math.random() * 60, 0, 0);
        
        metrics.push({
          userId: userId,
          metricType: 'bloodPressure',
          value: `${Math.round(baseBP_sys + (Math.random() * 20 - 10))}/${Math.round(baseBP_dia + (Math.random() * 10 - 5))}`,
          unit: 'mmHg',
          timestamp: bpTime,
          notes: Math.random() > 0.7 ? 'Đo sau khi nghỉ ngơi 5 phút' : '',
          createdAt: bpTime,
          updatedAt: bpTime
        });

        // 5. Heart Rate (Nhịp tim)
        const hrTime = new Date(date);
        hrTime.setHours(7 + Math.random() * 2, Math.random() * 60, 0, 0);
        
        metrics.push({
          userId: userId,
          metricType: 'heartRate',
          value: Math.round(baseHeartRate + (Math.random() * 20 - 10)),
          unit: 'nhịp/phút',
          timestamp: hrTime,
          notes: Math.random() > 0.8 ? 'Đo khi nghỉ ngơi' : '',
          createdAt: hrTime,
          updatedAt: hrTime
        });

        // 6. Body Fat (% Mỡ cơ thể) - đo mỗi 3 ngày - LOẠI BỎ vì không có trong enum
        // Model không hỗ trợ body_fat, chỉ có trong comment

        // 7. Blood Sugar (Đường huyết) - đo mỗi 2 ngày
        if (i % 2 === 0) {
          const bsTime = new Date(date);
          bsTime.setHours(6 + Math.random(), Math.random() * 60, 0, 0);
          
          metrics.push({
            userId: userId,
            metricType: 'bloodSugar',
            value: Math.round(baseBloodSugar + (Math.random() * 20 - 10)),
            unit: 'mg/dL',
            timestamp: bsTime,
            notes: 'Đo lúc đói',
            createdAt: bsTime,
            updatedAt: bsTime
          });
        }

        // 8. Sleep (Giấc ngủ) - mỗi đêm
        const sleepHours = 6 + Math.random() * 3; // 6-9 giờ
        const sleepTime = new Date(date);
        sleepTime.setHours(6, 0, 0, 0); // Ghi nhận lúc 6h sáng
        
        metrics.push({
          userId: userId,
          metricType: 'sleep',
          value: Number(sleepHours.toFixed(1)),
          unit: 'giờ',
          timestamp: sleepTime,
          notes: sleepHours < 6.5 ? 'Ngủ ít' : sleepHours > 8.5 ? 'Ngủ nhiều' : 'Giấc ngủ tốt',
          createdAt: sleepTime,
          updatedAt: sleepTime
        });

        // 9. Water Intake (Lượng nước uống) - mỗi ngày
        const waterTime = new Date(date);
        waterTime.setHours(20, 0, 0, 0); // Ghi nhận lúc 8h tối
        
        metrics.push({
          userId: userId,
          metricType: 'water',
          value: Number((1.5 + Math.random() * 1.5).toFixed(1)), // 1.5-3L
          unit: 'lít',
          timestamp: waterTime,
          notes: Math.random() > 0.7 ? 'Nhớ uống đủ nước' : '',
          createdAt: waterTime,
          updatedAt: waterTime
        });

        // 10. Exercise (Thời gian tập luyện) - 5 ngày/tuần
        if (i % 7 !== 0 && i % 7 !== 6) { // Không tập thứ 7, CN
          const exerciseTime = new Date(date);
          exerciseTime.setHours(17 + Math.random() * 2, Math.random() * 60, 0, 0);
          
          metrics.push({
            userId: userId,
            metricType: 'exercise',
            value: Math.round(30 + Math.random() * 60), // 30-90 phút
            unit: 'phút',
            timestamp: exerciseTime,
            notes: ['Chạy bộ', 'Gym', 'Yoga', 'Bơi lội', 'Đạp xe'][Math.floor(Math.random() * 5)],
            createdAt: exerciseTime,
            updatedAt: exerciseTime
          });
        }

        // 11. Steps (Số bước chân) - mỗi ngày
        const stepsTime = new Date(date);
        stepsTime.setHours(21, 0, 0, 0);
        
        metrics.push({
          userId: userId,
          metricType: 'steps',
          value: Math.round(5000 + Math.random() * 10000), // 5k-15k bước
          unit: 'bước',
          timestamp: stepsTime,
          notes: Math.random() > 0.8 ? 'Đạt mục tiêu 10,000 bước' : '',
          createdAt: stepsTime,
          updatedAt: stepsTime
        });

        // 12. Calories Burned (Calories tiêu hao) - mỗi ngày - LOẠI BỎ
        // Model chỉ có 'calories' không có 'calories_burned'
        // Sẽ dùng 'calories' thay thế
        const caloriesTime = new Date(date);
        caloriesTime.setHours(22, 0, 0, 0);
        
        metrics.push({
          userId: userId,
          metricType: 'calories',
          value: Math.round(1800 + Math.random() * 700), // 1800-2500 kcal
          unit: 'kcal',
          timestamp: caloriesTime,
          notes: 'Tổng calories tiêu hao trong ngày',
          createdAt: caloriesTime,
          updatedAt: caloriesTime
        });
      }
    }

    const metricsResult = await db.collection('health_metrics').insertMany(metrics);
    console.log(`✅ Đã tạo ${metricsResult.insertedCount} bản ghi health metrics\n`);

    // =============================================
    // 4. GOALS (Mục tiêu sức khỏe)
    // =============================================
    console.log('🎯 Đang tạo Goals...');
    const goals = [];

    const goalTemplates = [
      {
        title: 'Giảm cân xuống mức lý tưởng',
        description: 'Giảm cân từ {start}kg xuống {target}kg trong 3 tháng',
        goalType: 'weight',
        unit: 'kg',
        startVal: (gender) => gender === 'male' ? 75 : 58,
        targetVal: (gender) => gender === 'male' ? 70 : 53,
        daysToTarget: 90
      },
      {
        title: 'Tập thể dục đều đặn',
        description: 'Tăng thời gian tập luyện lên 150 phút/tuần',
        goalType: 'exercise',
        unit: 'phút',
        startVal: () => 60,
        targetVal: () => 150,
        daysToTarget: 60
      },
      {
        title: 'Ngủ đủ 8 tiếng mỗi ngày',
        description: 'Cải thiện chất lượng giấc ngủ, ngủ đủ 8 tiếng/đêm',
        goalType: 'sleep',
        unit: 'giờ',
        startVal: () => 6,
        targetVal: () => 8,
        daysToTarget: 30
      },
      {
        title: 'Đi bộ 10,000 bước/ngày',
        description: 'Duy trì đi bộ 10,000 bước mỗi ngày',
        goalType: 'steps',
        unit: 'bước',
        startVal: () => 5000,
        targetVal: () => 10000,
        daysToTarget: 30
      },
      {
        title: 'Uống đủ 2.5 lít nước/ngày',
        description: 'Tăng lượng nước uống hàng ngày',
        goalType: 'water',
        unit: 'lít',
        startVal: () => 1.5,
        targetVal: () => 2.5,
        daysToTarget: 30
      },
      {
        title: 'Kiểm soát huyết áp',
        description: 'Duy trì huyết áp ở mức bình thường',
        goalType: 'bloodPressure',
        unit: 'mmHg',
        startVal: () => 130,
        targetVal: () => 120,
        daysToTarget: 60
      },
      {
        title: 'Đốt cháy calories hiệu quả',
        description: 'Tăng lượng calories tiêu hao mỗi ngày',
        goalType: 'calories',
        unit: 'kcal',
        startVal: () => 1800,
        targetVal: () => 2500,
        daysToTarget: 45
      }
    ];

    for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
      const userId = userIds[userIndex];
      const user = users[userIndex];
      
      // Mỗi user có 4-5 goals
      const numGoals = 4 + Math.floor(Math.random() * 2);
      const selectedTemplates = goalTemplates.slice(0, numGoals);
      
      for (const template of selectedTemplates) {
        const startVal = typeof template.startVal === 'function' 
          ? template.startVal(user.gender) 
          : template.startVal;
        const targetVal = typeof template.targetVal === 'function' 
          ? template.targetVal(user.gender) 
          : template.targetVal;
        
        const targetDate = new Date(startDate);
        targetDate.setDate(targetDate.getDate() + template.daysToTarget);
        
        // Tính progress (20-60%)
        const progress = 20 + Math.random() * 40;
        const currentVal = startVal + (targetVal - startVal) * (progress / 100);
        
        goals.push({
          userId: userId,
          title: template.title,
          description: template.description
            .replace('{start}', startVal)
            .replace('{target}', targetVal),
          goalType: template.goalType,
          startValue: Number(startVal.toFixed(1)),
          targetValue: Number(targetVal.toFixed(1)),
          currentValue: Number(currentVal.toFixed(1)),
          unit: template.unit,
          startDate: new Date(startDate),
          targetDate: targetDate,
          status: Math.random() > 0.8 ? 'completed' : 'active',
          progress: Number(progress.toFixed(1)),
          createdAt: new Date(startDate),
          updatedAt: new Date()
        });
      }
    }

    const goalsResult = await db.collection('goals').insertMany(goals);
    console.log(`✅ Đã tạo ${goalsResult.insertedCount} goals\n`);

    // =============================================
    // 5. NUTRITION (Nhật ký dinh dưỡng - 30 ngày)
    // =============================================
    console.log('🍽️  Đang tạo Nutrition logs (30 ngày)...');
    const nutrition = [];

    const foodDatabase = {
      breakfast: [
        { name: 'Phở bò', calories: 450, protein: 25, carbs: 60, fat: 12 },
        { name: 'Bánh mì thịt', calories: 380, protein: 18, carbs: 45, fat: 15 },
        { name: 'Cháo gà', calories: 320, protein: 22, carbs: 40, fat: 8 },
        { name: 'Bún bò', calories: 420, protein: 23, carbs: 55, fat: 11 },
        { name: 'Trứng ốp la + bánh mì', calories: 400, protein: 20, carbs: 42, fat: 16 },
        { name: 'Yến mạch + sữa', calories: 280, protein: 12, carbs: 48, fat: 6 }
      ],
      lunch: [
        { name: 'Cơm gà', calories: 650, protein: 38, carbs: 75, fat: 18 },
        { name: 'Cơm sườn', calories: 720, protein: 35, carbs: 80, fat: 25 },
        { name: 'Bún chả', calories: 580, protein: 32, carbs: 65, fat: 20 },
        { name: 'Cơm tấm', calories: 680, protein: 30, carbs: 78, fat: 22 },
        { name: 'Mì xào hải sản', calories: 620, protein: 28, carbs: 70, fat: 24 },
        { name: 'Cơm chiên dương châu', calories: 700, protein: 25, carbs: 85, fat: 26 }
      ],
      dinner: [
        { name: 'Cơm + cá kho', calories: 550, protein: 35, carbs: 60, fat: 15 },
        { name: 'Cơm + gà xào', calories: 580, protein: 38, carbs: 62, fat: 16 },
        { name: 'Bún riêu', calories: 480, protein: 25, carbs: 58, fat: 14 },
        { name: 'Cơm + canh chua', calories: 520, protein: 28, carbs: 64, fat: 12 },
        { name: 'Salad ức gà', calories: 380, protein: 35, carbs: 25, fat: 15 },
        { name: 'Soup rau củ + thịt', calories: 420, protein: 30, carbs: 40, fat: 13 }
      ],
      snack: [
        { name: 'Trái cây', calories: 120, protein: 2, carbs: 30, fat: 0.5 },
        { name: 'Sữa chua Hy Lạp', calories: 150, protein: 12, carbs: 18, fat: 4 },
        { name: 'Hạt hỗn hợp', calories: 180, protein: 6, carbs: 12, fat: 14 },
        { name: 'Bánh protein', calories: 200, protein: 15, carbs: 20, fat: 8 },
        { name: 'Chuối + bơ đậu phộng', calories: 220, protein: 8, carbs: 28, fat: 10 },
        { name: 'Sinh tố', calories: 160, protein: 5, carbs: 32, fat: 2 }
      ]
    };

    for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
      const userId = userIds[userIndex];
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // 3-4 bữa mỗi ngày
        const mealsPerDay = 3 + Math.floor(Math.random() * 2);
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        
        for (let m = 0; m < mealsPerDay; m++) {
          const mealType = mealTypes[m];
          const foods = foodDatabase[mealType];
          const selectedFood = foods[Math.floor(Math.random() * foods.length)];
          
          const mealTime = new Date(date);
          mealTime.setHours(
            mealType === 'breakfast' ? 7 + Math.random() * 2 :
            mealType === 'lunch' ? 12 + Math.random() * 1.5 :
            mealType === 'dinner' ? 18 + Math.random() * 2 :
            15 + Math.random() * 3,
            Math.random() * 60, 0, 0
          );
          
          // Variation ±10%
          const variation = 0.9 + Math.random() * 0.2;
          
          nutrition.push({
            userId: userId,
            mealType: mealType,
            foodItems: [{
              name: selectedFood.name,
              calories: Math.round(selectedFood.calories * variation),
              protein: Number((selectedFood.protein * variation).toFixed(1)),
              carbs: Number((selectedFood.carbs * variation).toFixed(1)),
              fat: Number((selectedFood.fat * variation).toFixed(1))
            }],
            totalCalories: Math.round(selectedFood.calories * variation),
            totalProtein: Number((selectedFood.protein * variation).toFixed(1)),
            totalCarbs: Number((selectedFood.carbs * variation).toFixed(1)),
            totalFat: Number((selectedFood.fat * variation).toFixed(1)),
            mealTime: mealTime,
            notes: Math.random() > 0.7 ? ['Ngon', 'No', 'Vừa đủ', 'Hơi nhiều'][Math.floor(Math.random() * 4)] : '',
            createdAt: mealTime,
            updatedAt: mealTime
          });
        }
      }
    }

    const nutritionResult = await db.collection('nutrition').insertMany(nutrition);
    console.log(`✅ Đã tạo ${nutritionResult.insertedCount} nutrition logs\n`);

    // =============================================
    // 6. MOOD LOGS (Nhật ký tâm trạng - 30 ngày)
    // =============================================
    console.log('😊 Đang tạo Mood logs (30 ngày)...');
    const moodLogs = [];
    
    const moods = ['very_bad', 'bad', 'neutral', 'good', 'very_good'];
    const moodEmojis = ['😢', '😟', '😐', '🙂', '😊'];
    const activities = [
      'Tập thể dục', 'Đọc sách', 'Gặp bạn bè', 'Làm việc',
      'Nấu ăn', 'Xem phim', 'Nghe nhạc', 'Thiền',
      'Dạo phố', 'Chơi game', 'Học tập', 'Nghỉ ngơi',
      'Du lịch', 'Mua sắm', 'Café', 'Làm vườn'
    ];
    const notesTemplates = [
      'Hôm nay cảm thấy rất tốt',
      'Hơi mệt nhưng vẫn ổn',
      'Công việc hơi căng thẳng',
      'Ngủ đủ giấc rất thoải mái',
      'Vui vì hoàn thành mục tiêu',
      'Hơi lo lắng về deadline',
      'Tâm trạng bình thường',
      'Rất hài lòng với bản thân',
      'Cần thư giãn nhiều hơn',
      'Năng lượng tràn đầy',
      'Stress vì công việc',
      'Vui vì gặp bạn cũ',
      'Hơi buồn vì thời tiết',
      'Thoải mái sau khi tập',
      'Mệt mỏi cả ngày'
    ];

    for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
      const userId = userIds[userIndex];
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        date.setHours(20 + Math.random() * 2, Math.random() * 60, 0, 0);
        
        // Random mood (thiên về positive 60%)
        const moodIndex = Math.random() < 0.6 
          ? 3 + Math.floor(Math.random() * 2) // good hoặc very_good
          : Math.floor(Math.random() * 5); // random
        
        const mood = moods[moodIndex];
        
        // Stress level (0-10) - ngược với mood
        const stressLevel = Math.max(0, Math.min(10, 
          10 - moodIndex * 2 + Math.floor(Math.random() * 3)
        ));
        
        // Energy level (1-10) - tương quan với mood
        const energyLevel = Math.max(1, Math.min(10, 
          moodIndex * 2 + 1 + Math.floor(Math.random() * 3)
        ));
        
        // Random 1-4 activities
        const selectedActivities = [];
        const activityCount = 1 + Math.floor(Math.random() * 4);
        const shuffled = [...activities].sort(() => Math.random() - 0.5);
        for (let a = 0; a < activityCount; a++) {
          selectedActivities.push(shuffled[a]);
        }
        
        moodLogs.push({
          userId: userId,
          mood: mood,
          stressLevel: stressLevel,
          energyLevel: energyLevel,
          activities: selectedActivities,
          notes: Math.random() > 0.2 
            ? notesTemplates[Math.floor(Math.random() * notesTemplates.length)]
            : '',
          logDate: date,
          createdAt: date,
          updatedAt: date
        });
      }
    }

    const moodResult = await db.collection('mood_logs').insertMany(moodLogs);
    console.log(`✅ Đã tạo ${moodResult.insertedCount} mood logs\n`);

    // =============================================
    // 7. REMINDERS (Nhắc nhở)
    // =============================================
    console.log('⏰ Đang tạo Reminders...');
    const reminders = [];

    const reminderTemplates = [
      { type: 'medication', message: 'Uống thuốc Metformin', time: '08:00' },
      { type: 'exercise', message: 'Tập thể dục buổi chiều', time: '17:00' },
      { type: 'medication', message: 'Uống vitamin', time: '09:00' },
      { type: 'water', message: 'Uống nước', time: '10:00' },
      { type: 'water', message: 'Uống nước', time: '14:00' },
      { type: 'water', message: 'Uống nước', time: '16:00' },
      { type: 'sleep', message: 'Chuẩn bị đi ngủ', time: '22:00' },
      { type: 'meal', message: 'Ăn trưa', time: '12:00' },
      { type: 'meal', message: 'Ăn tối', time: '18:30' },
      { type: 'checkup', message: 'Đo huyết áp', time: '07:00' }
    ];

    for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
      const userId = userIds[userIndex];
      
      // Mỗi user có 5-8 reminders
      const numReminders = 5 + Math.floor(Math.random() * 4);
      const selectedReminders = reminderTemplates
        .sort(() => Math.random() - 0.5)
        .slice(0, numReminders);
      
      for (const template of selectedReminders) {
        const [hour, minute] = template.time.split(':');
        
        reminders.push({
          userId: userId,
          type: template.type,
          message: template.message,
          time: template.time,
          frequency: 'daily',
          isActive: Math.random() > 0.1, // 90% active
          createdAt: new Date(startDate),
          updatedAt: new Date()
        });
      }
    }

    const remindersResult = await db.collection('reminders').insertMany(reminders);
    console.log(`✅ Đã tạo ${remindersResult.insertedCount} reminders\n`);

    // =============================================
    // 8. ALERTS (Cảnh báo sức khỏe)
    // =============================================
    console.log('🚨 Đang tạo Health Alerts...');
    const alerts = [];

    const alertTemplates = [
      {
        type: 'high_blood_pressure',
        message: 'Huyết áp cao: 145/95 mmHg. Cần theo dõi!',
        severity: 'high',
        metricType: 'bloodPressure'
      },
      {
        type: 'low_sleep',
        message: 'Bạn chỉ ngủ 5.2 giờ đêm qua. Cần ngủ đủ giấc!',
        severity: 'medium',
        metricType: 'sleep'
      },
      {
        type: 'high_blood_sugar',
        message: 'Đường huyết cao: 145 mg/dL. Cần kiểm soát!',
        severity: 'high',
        metricType: 'bloodSugar'
      },
      {
        type: 'low_water',
        message: 'Bạn chỉ uống 1.2L nước hôm nay. Nhớ bổ sung!',
        severity: 'low',
        metricType: 'water'
      },
      {
        type: 'no_exercise',
        message: 'Bạn chưa tập luyện trong 3 ngày. Hãy vận động!',
        severity: 'medium',
        metricType: 'exercise'
      },
      {
        type: 'weight_gain',
        message: 'Cân nặng tăng 1.5kg trong tuần qua',
        severity: 'medium',
        metricType: 'weight'
      },
      {
        type: 'high_heart_rate',
        message: 'Nhịp tim nghỉ cao: 95 bpm',
        severity: 'medium',
        metricType: 'heartRate'
      }
    ];

    for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
      const userId = userIds[userIndex];
      
      // Tạo 5-10 alerts trong 30 ngày
      const numAlerts = 5 + Math.floor(Math.random() * 6);
      
      for (let i = 0; i < numAlerts; i++) {
        const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
        const alertDate = randomDate(startDate, now);
        
        alerts.push({
          userId: userId,
          type: template.type,
          message: template.message,
          severity: template.severity,
          metricType: template.metricType,
          isRead: Math.random() > 0.3, // 70% đã đọc
          isResolved: Math.random() > 0.5, // 50% đã giải quyết
          createdAt: alertDate,
          updatedAt: alertDate
        });
      }
    }

    const alertsResult = await db.collection('alerts').insertMany(alerts);
    console.log(`✅ Đã tạo ${alertsResult.insertedCount} alerts\n`);

    // =============================================
    // 9. TẠO INDEXES
    // =============================================
    console.log('🔍 Đang tạo indexes...');
    
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('health_metrics').createIndex({ userId: 1, metricType: 1, timestamp: -1 });
    await db.collection('goals').createIndex({ userId: 1, status: 1 });
    await db.collection('nutrition').createIndex({ userId: 1, mealTime: -1 });
    await db.collection('mood_logs').createIndex({ userId: 1, logDate: -1 });
    await db.collection('reminders').createIndex({ userId: 1, isActive: 1 });
    await db.collection('alerts').createIndex({ userId: 1, isRead: 1, createdAt: -1 });
    
    console.log('✅ Đã tạo indexes\n');

    // =============================================
    // 10. THỐNG KÊ TỔNG QUAN
    // =============================================
    console.log('═══════════════════════════════════════════════════');
    console.log('📈 THỐNG KÊ DATABASE TOÀN DIỆN - 30 NGÀY');
    console.log('═══════════════════════════════════════════════════\n');
    
    const collections = [
      'users', 'articles', 'health_metrics', 'goals',
      'nutrition', 'mood_logs', 'reminders', 'alerts'
    ];
    
    for (const collection of collections) {
      const count = await db.collection(collection).countDocuments();
      const emoji = {
        users: '👥',
        articles: '📚',
        health_metrics: '📊',
        goals: '🎯',
        nutrition: '🍽️',
        mood_logs: '😊',
        reminders: '⏰',
        alerts: '🚨'
      }[collection];
      
      console.log(`${emoji} ${collection.padEnd(20)}: ${count.toString().padStart(6)} records`);
    }
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📝 CHI TIẾT HEALTH METRICS (Các chỉ số đã thu thập):');
    console.log('═══════════════════════════════════════════════════\n');
    
    const metricTypes = await db.collection('health_metrics').distinct('metricType');
    for (const type of metricTypes.sort()) {
      const count = await db.collection('health_metrics').countDocuments({ metricType: type });
      console.log(`   ✓ ${type.padEnd(20)}: ${count} records`);
    }
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🎉 IMPORT HOÀN TẤT!');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('🔐 Thông tin đăng nhập:');
    console.log('   ➤ Email: test@phihub.com');
    console.log('   ➤ Password: Test123456');
    console.log('');
    console.log('   ➤ Email: demo@phihub.com');
    console.log('   ➤ Password: Demo123456');
    console.log('');
    console.log('   ➤ Email: admin@phihub.com');
    console.log('   ➤ Password: Admin123456');
    console.log('\n📱 Hãy đăng nhập và khám phá dữ liệu đầy đủ của bạn!');

  } catch (error) {
    console.error('❌ LỖI:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Đã đóng kết nối MongoDB\n');
  }
}

// Chạy script
importComprehensiveData();
