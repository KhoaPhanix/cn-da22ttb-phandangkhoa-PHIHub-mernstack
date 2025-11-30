const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Cấu hình MongoDB
const MONGODB_URI = 'mongodb+srv://admin:Silnix13670@healthtracker.xmrtodc.mongodb.net/phihub?retryWrites=true&w=majority&appName=HealthTracker';
const DB_NAME = 'phihub';

// Kiểm tra clean flag
const shouldClean = process.argv.includes('--clean');

async function importData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Đang kết nối MongoDB...');
    await client.connect();
    console.log('✅ Kết nối thành công!\n');

    const db = client.db(DB_NAME);

    // Xóa dữ liệu cũ nếu có flag --clean
    if (shouldClean) {
      console.log('🗑️  Đang xóa dữ liệu cũ...');
      await db.collection('articles').deleteMany({});
      await db.collection('users').deleteMany({});
      await db.collection('health_metrics').deleteMany({});
      console.log('✅ Đã xóa dữ liệu cũ\n');
    }

    // 1. Import Articles
    console.log('📚 Đang import bài viết...');
    const articlesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf-8')
    );
    const articlesResult = await db.collection('articles').insertMany(articlesData);
    console.log(`✅ Đã import ${articlesResult.insertedCount} bài viết\n`);

    // 2. Create Test Users
    console.log('👤 Đang tạo tài khoản test...');
    const hashedPassword1 = await bcrypt.hash('Test123456', 10);
    const hashedPassword2 = await bcrypt.hash('Demo123456', 10);

    const users = [
      {
        name: 'Nguyễn Văn Test',
        email: 'test@phihub.com',
        password: hashedPassword1,
        dob: new Date('1990-01-15'),
        gender: 'male',
        createdAt: new Date(),
      },
      {
        name: 'Trần Thị Demo',
        email: 'demo@phihub.com',
        password: hashedPassword2,
        dob: new Date('1995-05-20'),
        gender: 'female',
        createdAt: new Date(),
      },
    ];

    const usersResult = await db.collection('users').insertMany(users);
    console.log(`✅ Đã tạo ${usersResult.insertedCount} tài khoản`);
    console.log('   - test@phihub.com (Password: Test123456)');
    console.log('   - demo@phihub.com (Password: Demo123456)\n');

    // 3. Generate Health Metrics (30 ngày dữ liệu)
    console.log('📊 Đang tạo dữ liệu metrics (30 ngày)...');
    const userIds = Object.values(usersResult.insertedIds);
    const metrics = [];

    for (const userId of userIds) {
      // Tạo 30 ngày dữ liệu
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Weight (dao động 68-72kg cho user 1, 52-56kg cho user 2)
        const baseWeight = userId === userIds[0] ? 70 : 54;
        metrics.push({
          userId: userId,
          metricType: 'weight',
          value: baseWeight + (Math.random() * 4 - 2), // ±2kg
          unit: 'kg',
          timestamp: date,
          createdAt: date,
        });

        // Sleep (dao động 6-9 giờ)
        metrics.push({
          userId: userId,
          metricType: 'sleep',
          value: 6 + Math.random() * 3,
          unit: 'hours',
          timestamp: date,
          createdAt: date,
        });

        // Calories (dao động 1800-2500)
        metrics.push({
          userId: userId,
          metricType: 'calories',
          value: 1800 + Math.random() * 700,
          unit: 'kcal',
          timestamp: date,
          createdAt: date,
        });

        // Exercise (dao động 0-60 phút)
        metrics.push({
          userId: userId,
          metricType: 'exercise',
          value: Math.random() * 60,
          unit: 'minutes',
          timestamp: date,
          createdAt: date,
        });
      }
    }

    const metricsResult = await db.collection('health_metrics').insertMany(metrics);
    console.log(`✅ Đã tạo ${metricsResult.insertedCount} bản ghi metrics\n`);

    // Tạo indexes
    console.log('🔍 Đang tạo indexes...');
    await db.collection('health_metrics').createIndex({ userId: 1, metricType: 1, timestamp: -1 });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Đã tạo indexes\n');

    // Thống kê
    console.log('📈 THỐNG KÊ SAU KHI IMPORT:');
    console.log('═══════════════════════════════════════');
    const articlesCount = await db.collection('articles').countDocuments();
    const usersCount = await db.collection('users').countDocuments();
    const metricsCount = await db.collection('health_metrics').countDocuments();

    console.log(`📚 Bài viết: ${articlesCount}`);
    console.log(`👥 Users: ${usersCount}`);
    console.log(`📊 Health Metrics: ${metricsCount}`);
    console.log('═══════════════════════════════════════\n');

    console.log('🎉 IMPORT HOÀN TẤT!');
    console.log('\n🚀 Bạn có thể đăng nhập với:');
    console.log('   Email: test@phihub.com');
    console.log('   Password: Test123456');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Đã đóng kết nối MongoDB');
  }
}

// Chạy script
importData();
