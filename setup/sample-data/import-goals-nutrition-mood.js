const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../../src/server/.env' });

// Cấu hình MongoDB
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/phihub';
const DB_NAME = 'phihub';

// Kiểm tra clean flag
const shouldClean = process.argv.includes('--clean');

async function importGoalsNutritionMood() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Đang kết nối MongoDB...');
    await client.connect();
    console.log('✅ Kết nối thành công!\n');

    const db = client.db(DB_NAME);

    // Lấy danh sách users
    const users = await db.collection('users').find({}).toArray();
    if (users.length === 0) {
      console.log('⚠️  Không tìm thấy users! Hãy chạy import.js trước.');
      return;
    }
    console.log(`👥 Tìm thấy ${users.length} users\n`);

    // Xóa dữ liệu cũ nếu có flag --clean
    if (shouldClean) {
      console.log('🗑️  Đang xóa dữ liệu cũ...');
      await db.collection('goals').deleteMany({});
      await db.collection('nutrition').deleteMany({});
      await db.collection('mood_logs').deleteMany({});
      console.log('✅ Đã xóa dữ liệu cũ\n');
    }

    // ======================
    // 1. IMPORT GOALS
    // ======================
    console.log('🎯 Đang tạo Goals...');
    const goals = [];
    const goalTypes = ['weight', 'exercise', 'sleep', 'calories', 'water'];
    const goalNames = {
      weight: 'Giảm cân',
      exercise: 'Tập thể dục đều đặn',
      sleep: 'Ngủ đủ giấc',
      calories: 'Kiểm soát calories',
      water: 'Uống đủ nước'
    };

    for (const user of users) {
      // Mỗi user có 3-4 goals
      const selectedGoals = goalTypes.slice(0, 3 + Math.floor(Math.random() * 2));
      
      for (const goalType of selectedGoals) {
        let startValue, targetValue, unit, deadline;

        switch (goalType) {
          case 'weight':
            startValue = user.gender === 'male' ? 75 : 60;
            targetValue = user.gender === 'male' ? 70 : 55;
            unit = 'kg';
            break;
          case 'exercise':
            startValue = 0;
            targetValue = 150; // 150 phút/tuần
            unit = 'minutes/week';
            break;
          case 'sleep':
            startValue = 6;
            targetValue = 8;
            unit = 'hours/day';
            break;
          case 'calories':
            startValue = 2500;
            targetValue = 2000;
            unit = 'kcal/day';
            break;
          case 'water':
            startValue = 1.5;
            targetValue = 2.5;
            unit = 'liters/day';
            break;
        }

        // Deadline: 30-90 ngày từ bây giờ
        deadline = new Date();
        deadline.setDate(deadline.getDate() + 30 + Math.floor(Math.random() * 60));

        goals.push({
          userId: user._id,
          name: goalNames[goalType],
          description: `Mục tiêu ${goalNames[goalType].toLowerCase()} trong ${Math.floor((deadline - new Date()) / (1000 * 60 * 60 * 24))} ngày`,
          startValue: startValue,
          targetValue: targetValue,
          currentValue: startValue + (targetValue - startValue) * (0.2 + Math.random() * 0.3), // 20-50% progress
          unit: unit,
          deadline: deadline,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    const goalsResult = await db.collection('goals').insertMany(goals);
    console.log(`✅ Đã tạo ${goalsResult.insertedCount} goals\n`);

    // ======================
    // 2. IMPORT NUTRITION
    // ======================
    console.log('🍽️  Đang tạo Nutrition logs...');
    const nutrition = [];

    for (const user of users) {
      // Tạo 14 ngày dữ liệu dinh dưỡng
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        // 3-4 bữa ăn mỗi ngày
        const mealsCount = 3 + Math.floor(Math.random() * 2);
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

        for (let m = 0; m < mealsCount; m++) {
          const mealType = mealTypes[m];
          let calories, protein, carbs, fat;

          // Phân bổ calories theo bữa ăn
          switch (mealType) {
            case 'breakfast':
              calories = 300 + Math.random() * 200; // 300-500
              protein = 15 + Math.random() * 15; // 15-30g
              carbs = 40 + Math.random() * 30; // 40-70g
              fat = 10 + Math.random() * 15; // 10-25g
              break;
            case 'lunch':
              calories = 500 + Math.random() * 300; // 500-800
              protein = 30 + Math.random() * 20; // 30-50g
              carbs = 60 + Math.random() * 40; // 60-100g
              fat = 15 + Math.random() * 20; // 15-35g
              break;
            case 'dinner':
              calories = 400 + Math.random() * 300; // 400-700
              protein = 25 + Math.random() * 20; // 25-45g
              carbs = 50 + Math.random() * 40; // 50-90g
              fat = 12 + Math.random() * 18; // 12-30g
              break;
            case 'snack':
              calories = 100 + Math.random() * 150; // 100-250
              protein = 5 + Math.random() * 10; // 5-15g
              carbs = 15 + Math.random() * 20; // 15-35g
              fat = 3 + Math.random() * 10; // 3-13g
              break;
          }

          const mealTime = new Date(date);
          mealTime.setHours(
            mealType === 'breakfast' ? 7 + Math.random() * 2 :
            mealType === 'lunch' ? 12 + Math.random() * 2 :
            mealType === 'dinner' ? 18 + Math.random() * 2 :
            15 + Math.random() * 3
          );

          nutrition.push({
            userId: user._id,
            mealType: mealType,
            foodItems: [
              {
                name: `${mealType} - ${['Món 1', 'Món 2', 'Món 3'][Math.floor(Math.random() * 3)]}`,
                calories: calories,
                protein: protein,
                carbs: carbs,
                fat: fat
              }
            ],
            totalCalories: calories,
            totalProtein: protein,
            totalCarbs: carbs,
            totalFat: fat,
            mealTime: mealTime,
            notes: Math.random() > 0.7 ? `Ăn ${['ngon', 'no', 'vừa đủ'][Math.floor(Math.random() * 3)]}` : '',
            createdAt: mealTime,
            updatedAt: mealTime
          });
        }
      }
    }

    const nutritionResult = await db.collection('nutrition').insertMany(nutrition);
    console.log(`✅ Đã tạo ${nutritionResult.insertedCount} nutrition logs\n`);

    // ======================
    // 3. IMPORT MOOD LOGS
    // ======================
    console.log('😊 Đang tạo Mood logs...');
    const moodLogs = [];
    const moods = ['very_bad', 'bad', 'neutral', 'good', 'very_good'];
    const activities = [
      'Tập thể dục', 'Đọc sách', 'Gặp bạn bè', 'Làm việc',
      'Nấu ăn', 'Xem phim', 'Nghe nhạc', 'Thiền',
      'Dạo phố', 'Chơi game', 'Học tập', 'Nghỉ ngơi'
    ];
    const notes = [
      'Hôm nay cảm thấy tốt',
      'Hơi mệt nhưng vẫn ổn',
      'Công việc hơi căng thẳng',
      'Ngủ đủ giấc rất thoải mái',
      'Vui vì hoàn thành mục tiêu',
      'Hơi lo lắng về deadline',
      'Tâm trạng bình thường',
      'Rất hài lòng với bản thân',
      'Cần thư giãn nhiều hơn',
      'Năng lượng tràn đầy'
    ];

    for (const user of users) {
      // Tạo 20 ngày mood logs
      for (let i = 0; i < 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(20 + Math.random() * 2, Math.random() * 60, 0, 0); // 20:00-22:00

        // Random mood (thiên về positive)
        const moodIndex = Math.floor(Math.random() * moods.length);
        const mood = moods[moodIndex];

        // Stress level (0-10) - ngược với mood
        const stressLevel = 10 - moodIndex * 2 + Math.floor(Math.random() * 3);

        // Energy level (1-10) - tương quan với mood
        const energyLevel = moodIndex * 2 + 1 + Math.floor(Math.random() * 3);

        // Random 1-3 activities
        const selectedActivities = [];
        const activityCount = 1 + Math.floor(Math.random() * 3);
        for (let a = 0; a < activityCount; a++) {
          const randomActivity = activities[Math.floor(Math.random() * activities.length)];
          if (!selectedActivities.includes(randomActivity)) {
            selectedActivities.push(randomActivity);
          }
        }

        moodLogs.push({
          userId: user._id,
          mood: mood,
          stressLevel: Math.max(0, Math.min(10, stressLevel)),
          energyLevel: Math.max(1, Math.min(10, energyLevel)),
          activities: selectedActivities,
          notes: Math.random() > 0.3 ? notes[Math.floor(Math.random() * notes.length)] : '',
          logDate: date,
          createdAt: date,
          updatedAt: date
        });
      }
    }

    const moodResult = await db.collection('mood_logs').insertMany(moodLogs);
    console.log(`✅ Đã tạo ${moodResult.insertedCount} mood logs\n`);

    // ======================
    // THỐNG KÊ
    // ======================
    console.log('📈 THỐNG KÊ SAU KHI IMPORT:');
    console.log('═══════════════════════════════════════');
    const goalsCount = await db.collection('goals').countDocuments();
    const nutritionCount = await db.collection('nutrition').countDocuments();
    const moodCount = await db.collection('mood_logs').countDocuments();

    console.log(`🎯 Goals: ${goalsCount}`);
    console.log(`🍽️  Nutrition: ${nutritionCount}`);
    console.log(`😊 Mood Logs: ${moodCount}`);
    console.log('═══════════════════════════════════════\n');

    console.log('🎉 IMPORT HOÀN TẤT!');
    console.log('\n📊 Dữ liệu mẫu đã được tạo cho:');
    console.log('   - Goals (Mục tiêu sức khỏe)');
    console.log('   - Nutrition (Nhật ký dinh dưỡng)');
    console.log('   - Mood Logs (Theo dõi tâm trạng)');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Đã đóng kết nối MongoDB');
  }
}

// Chạy script
importGoalsNutritionMood();
