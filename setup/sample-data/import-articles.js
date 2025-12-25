const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../../src/server/.env' });

// Cấu hình MongoDB
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/phihub';
const DB_NAME = 'phihub';

async function importArticles() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Đang kết nối MongoDB...');
    await client.connect();
    console.log('✅ Kết nối thành công!\n');

    const db = client.db(DB_NAME);

    // Xóa articles cũ
    console.log('🗑️  Đang xóa articles cũ...');
    await db.collection('articles').deleteMany({});

    // Import Articles
    console.log('📚 Đang import bài viết...');
    const articlesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf-8')
    );
    const articlesResult = await db.collection('articles').insertMany(articlesData);
    console.log(`✅ Đã import ${articlesResult.insertedCount} bài viết\n`);

    // Tạo indexes
    console.log('🔍 Đang tạo indexes...');
    await db.collection('articles').createIndex({ category: 1 });
    await db.collection('articles').createIndex({ publishedAt: -1 });
    console.log('✅ Đã tạo indexes\n');

    console.log('🎉 IMPORT ARTICLES HOÀN TẤT!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Đã đóng kết nối MongoDB');
  }
}

importArticles();
