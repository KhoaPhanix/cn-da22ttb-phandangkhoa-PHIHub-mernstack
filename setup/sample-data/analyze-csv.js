const fs = require('fs');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://admin:Silnix13670@healthtracker.xmrtodc.mongodb.net/phihub?retryWrites=true&w=majority&appName=HealthTracker';

async function analyze() {
  // Đọc CSV
  const csvContent = fs.readFileSync('d:\\12526_CN\\CN\\PHIHub\\du-lieu-suc-khoe-20251126.csv', 'utf8');
  const lines = csvContent.split('\n').slice(1).filter(line => line.trim());
  
  console.log('📊 PHÂN TÍCH FILE CSV\n');
  console.log(`Tổng dòng: ${lines.length}`);
  
  // Đếm theo ngày
  const byDate = {};
  const byType = {};
  
  lines.forEach(line => {
    const parts = line.split(',');
    if (parts.length >= 4) {
      const type = parts[0].trim();
      const dateTime = parts[3].trim();
      const date = dateTime.split(' ')[0];
      
      byDate[date] = (byDate[date] || 0) + 1;
      byType[type] = (byType[type] || 0) + 1;
    }
  });
  
  console.log('\n📅 Phân bố theo ngày trong CSV:');
  Object.entries(byDate).sort((a,b) => {
    const [d1,m1,y1] = a[0].split('/').map(Number);
    const [d2,m2,y2] = b[0].split('/').map(Number);
    return new Date(y1,m1-1,d1) - new Date(y2,m2-1,d2);
  }).forEach(([date, count]) => {
    console.log(`  ${date}: ${count} records`);
  });
  
  console.log('\n📋 Phân bố theo loại trong CSV:');
  Object.entries(byType).sort((a,b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} records`);
  });
  
  // Lấy ngày đầu và cuối
  const dates = Object.keys(byDate).sort((a,b) => {
    const [d1,m1,y1] = a.split('/').map(Number);
    const [d2,m2,y2] = b.split('/').map(Number);
    return new Date(y1,m1-1,d1) - new Date(y2,m2-1,d2);
  });
  
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
  console.log(`\n📌 Khoảng thời gian trong CSV: ${firstDate} - ${lastDate}`);
  console.log(`   Số ngày: ${dates.length} ngày`);
  
  // Kiểm tra database
  console.log('\n\n🔍 KIỂM TRA DATABASE\n');
  
  const client = new MongoClient(uri);
  await client.connect();
  
  const db = client.db('phihub');
  const collection = db.collection('healthmetrics');
  
  // Chuyển đổi ngày CSV sang Date object
  const [d1,m1,y1] = firstDate.split('/').map(Number);
  const [d2,m2,y2] = lastDate.split('/').map(Number);
  const startDate = new Date(y1, m1-1, d1, 0, 0, 0);
  const endDate = new Date(y2, m2-1, d2, 23, 59, 59);
  
  const dbMetrics = await collection.find({
    timestamp: { $gte: startDate, $lte: endDate }
  }).sort({ timestamp: -1 }).toArray();
  
  console.log(`Tổng records trong DB (${firstDate} - ${lastDate}): ${dbMetrics.length}`);
  
  const dbByDate = {};
  const dbByType = {};
  
  dbMetrics.forEach(m => {
    const date = new Date(m.timestamp);
    const dateStr = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    dbByDate[dateStr] = (dbByDate[dateStr] || 0) + 1;
    dbByType[m.type] = (dbByType[m.type] || 0) + 1;
  });
  
  console.log('\n📅 Phân bố theo ngày trong DB:');
  Object.entries(dbByDate).sort((a,b) => {
    const [d1,m1,y1] = a[0].split('/').map(Number);
    const [d2,m2,y2] = b[0].split('/').map(Number);
    return new Date(y1,m1-1,d1) - new Date(y2,m2-1,d2);
  }).forEach(([date, count]) => {
    const csvCount = byDate[date] || 0;
    const match = csvCount === count ? '✓' : '✗';
    console.log(`  ${date}: ${count} records (CSV: ${csvCount}) ${match}`);
  });
  
  console.log('\n📋 Phân bố theo loại trong DB:');
  Object.entries(dbByType).sort((a,b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} records`);
  });
  
  // So sánh
  console.log('\n\n⚠️  PHÁT HIỆN VẤN ĐỀ:\n');
  
  const csvDates = new Set(Object.keys(byDate));
  const dbDates = new Set(Object.keys(dbByDate));
  
  // Ngày thiếu trong CSV
  const missingInCSV = [...dbDates].filter(d => !csvDates.has(d));
  if (missingInCSV.length > 0) {
    console.log('❌ Ngày CÓ TRONG DB nhưng THIẾU TRONG CSV:');
    missingInCSV.sort((a,b) => {
      const [d1,m1,y1] = a.split('/').map(Number);
      const [d2,m2,y2] = b.split('/').map(Number);
      return new Date(y1,m1-1,d1) - new Date(y2,m2-1,d2);
    }).forEach(date => {
      console.log(`   ${date}: ${dbByDate[date]} records trong DB, 0 trong CSV`);
    });
  }
  
  // Ngày thiếu trong DB
  const missingInDB = [...csvDates].filter(d => !dbDates.has(d));
  if (missingInDB.length > 0) {
    console.log('\n❌ Ngày CÓ TRONG CSV nhưng THIẾU TRONG DB:');
    missingInDB.forEach(date => {
      console.log(`   ${date}: ${byDate[date]} records trong CSV, 0 trong DB`);
    });
  }
  
  // Loại dữ liệu mapping
  console.log('\n\n📝 MAPPING LOẠI DỮ LIỆU:\n');
  const typeMapping = {
    'Calo': 'calories',
    'Số bước chân': 'steps',
    'Nước uống': 'water',
    'Tập luyện': 'exercise',
    'Nhịp tim': 'heartRate',
    'Huyết áp': 'bloodPressure',
    'BMI': 'bmi',
    'Cân nặng': 'weight',
    'Đường huyết': 'bloodSugar',
    'Chất lượng giấc ngủ': 'sleepQuality',
    'Giấc ngủ': 'sleep'
  };
  
  console.log('CSV Type → DB Type:');
  Object.entries(typeMapping).forEach(([csv, db]) => {
    const csvCount = byType[csv] || 0;
    const dbCount = dbByType[db] || 0;
    const match = csvCount === dbCount ? '✓' : '✗';
    console.log(`  ${csv} (${csvCount}) → ${db} (${dbCount}) ${match}`);
  });
  
  await client.close();
}

analyze().catch(err => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
