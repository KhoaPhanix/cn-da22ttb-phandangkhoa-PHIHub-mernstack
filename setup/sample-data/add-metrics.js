const { MongoClient } = require('mongodb');

// Cấu hình MongoDB
const MONGODB_URI = 'mongodb+srv://admin:Silnix13670@healthtracker.xmrtodc.mongodb.net/phihub?retryWrites=true&w=majority&appName=HealthTracker';
const DB_NAME = 'phihub';

async function addMetricsToExistingUsers() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Đang kết nối MongoDB...');
    await client.connect();
    console.log('✅ Kết nối thành công!\n');

    const db = client.db(DB_NAME);

    // Lấy 2 users đầu
    const users = await db.collection('users').find({
      email: { $in: ['test@phihub.com', 'demo@phihub.com'] }
    }).toArray();

    if (users.length === 0) {
      console.log('❌ Không tìm thấy users');
      return;
    }

    console.log(`✅ Tìm thấy ${users.length} users`);
    users.forEach(u => console.log(`   - ${u.email}`));

    // Xóa metrics cũ (nếu có)
    const userIds = users.map(u => u._id);
    const deleteResult = await db.collection('health_metrics').deleteMany({
      userId: { $in: userIds }
    });
    console.log(`\n🗑️  Đã xóa ${deleteResult.deletedCount} metrics cũ\n`);

    // Tạo metrics mới (30 ngày)
    console.log('📊 Đang tạo dữ liệu metrics (30 ngày)...');
    const metrics = [];

    for (const user of users) {
      const isUser1 = user.email === 'test@phihub.com';
      
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(8, 0, 0, 0); // 8:00 AM

        // Weight (70±2kg cho user1, 54±2kg cho user2)
        const baseWeight = isUser1 ? 70 : 54;
        const weight = baseWeight + (Math.random() * 4 - 2);
        metrics.push({
          userId: user._id,
          metricType: 'weight',
          value: weight,
          unit: 'kg',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });

        // Height (170cm cho user1, 160cm cho user2)
        const height = isUser1 ? 170 : 160;
        metrics.push({
          userId: user._id,
          metricType: 'height',
          value: height,
          unit: 'cm',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });

        // BMI (tính từ weight và height)
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        metrics.push({
          userId: user._id,
          metricType: 'bmi',
          value: parseFloat(bmi.toFixed(2)),
          unit: 'kg/m²',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });

        // Blood Pressure (110-130 / 70-85 mmHg)
        const systolic = 110 + Math.random() * 20;
        const diastolic = 70 + Math.random() * 15;
        metrics.push({
          userId: user._id,
          metricType: 'bloodPressure',
          value: systolic,
          unit: 'mmHg',
          timestamp: new Date(date),
          createdAt: new Date(date),
          metadata: {
            systolic: systolic,
            diastolic: diastolic,
          },
        });

        // Heart Rate (60-100 bpm)
        metrics.push({
          userId: user._id,
          metricType: 'heartRate',
          value: 60 + Math.random() * 40,
          unit: 'bpm',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });

        // Sleep (6-9 giờ)
        const sleepHours = 6 + Math.random() * 3;
        metrics.push({
          userId: user._id,
          metricType: 'sleep',
          value: sleepHours,
          unit: 'hours',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });

        // Sleep Quality (5-10 điểm)
        metrics.push({
          userId: user._id,
          metricType: 'sleepQuality',
          value: 5 + Math.random() * 5,
          unit: 'score',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });

        // Steps (5000-12000 bước)
        metrics.push({
          userId: user._id,
          metricType: 'steps',
          value: 5000 + Math.random() * 7000,
          unit: 'steps',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });

        // Exercise (0-60 phút)
        metrics.push({
          userId: user._id,
          metricType: 'exercise',
          value: Math.random() * 60,
          unit: 'minutes',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });

        // Calories (1800-2500)
        metrics.push({
          userId: user._id,
          metricType: 'calories',
          value: 1800 + Math.random() * 700,
          unit: 'kcal',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });

        // Water intake (1500-3000 ml)
        metrics.push({
          userId: user._id,
          metricType: 'water',
          value: 1500 + Math.random() * 1500,
          unit: 'ml',
          timestamp: new Date(date),
          createdAt: new Date(date),
        });
      }
    }

    const result = await db.collection('health_metrics').insertMany(metrics);
    console.log(`✅ Đã tạo ${result.insertedCount} bản ghi metrics\n`);

    // Thống kê
    console.log('📈 THỐNG KÊ:');
    console.log('═══════════════════════════════════════');
    for (const user of users) {
      const count = await db.collection('health_metrics').countDocuments({
        userId: user._id
      });
      console.log(`📧 ${user.email}: ${count} metrics`);
    }
    console.log('═══════════════════════════════════════\n');

    console.log('🎉 HOÀN TẤT!\n');
    console.log('🔐 Bạn có thể đăng nhập với:');
    console.log('   1. test@phihub.com / Test123456');
    console.log('   2. demo@phihub.com / Demo123456');
    console.log('   3. testuser@phihub.com / Test123456\n');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('👋 Đã đóng kết nối MongoDB');
  }
}

// Chạy script
addMetricsToExistingUsers();
