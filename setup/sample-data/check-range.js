const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../../src/server/.env' });
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/phihub';

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('phihub');
    const collection = db.collection('healthmetrics');
    
    const start = new Date('2025-10-25T00:00:00Z');
    const end = new Date('2025-11-26T23:59:59Z');
    const metrics = await collection.find({ 
      timestamp: { $gte: start, $lte: end } 
    }).sort({ timestamp: -1 }).toArray();
  
  console.log('\n📊 PHÂN TÍCH DỮ LIỆU TỪ 25/10/2025 ĐẾN 26/11/2025\n');
  console.log('Tổng records:', metrics.length);
  
  // Phân bố theo loại
  const byType = {};
  metrics.forEach(m => { 
    byType[m.type] = (byType[m.type] || 0) + 1; 
  });
  console.log('\n📋 Phân bố theo loại:');
  Object.entries(byType)
    .sort((a,b) => b[1] - a[1])
    .forEach(([type, count]) => console.log(`  ${type}: ${count} records`));
  
  // Phân bố theo ngày
  const byDate = {};
  metrics.forEach(m => {
    const date = m.timestamp.toISOString().split('T')[0];
    byDate[date] = (byDate[date] || 0) + 1;
  });
  
  console.log('\n📅 Phân bố theo ngày:');
  Object.entries(byDate)
    .sort((a,b) => a[0].localeCompare(b[0]))
    .forEach(([date, count]) => {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      console.log(`  ${day}/${month}/2025: ${count} records`);
    });
  
  // Ngày đầu và cuối có dữ liệu
  if (metrics.length > 0) {
    const first = metrics[metrics.length - 1].timestamp;
    const last = metrics[0].timestamp;
    console.log('\n📌 Khoảng thời gian thực tế:');
    console.log(`  Từ: ${first.toLocaleDateString('vi-VN')} ${first.toLocaleTimeString('vi-VN')}`);
    console.log(`  Đến: ${last.toLocaleDateString('vi-VN')} ${last.toLocaleTimeString('vi-VN')}`);
    
    const days = Math.ceil((last - first) / (1000 * 60 * 60 * 24)) + 1;
    console.log(`  Tổng số ngày: ${days} ngày`);
  }
  
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await client.close();
  }
}

run();
