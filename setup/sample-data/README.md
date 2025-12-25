# 📦 Dữ liệu Mẫu PHIHub

> Scripts để import dữ liệu thử nghiệm vào MongoDB cho ứng dụng PHIHub

## 📋 Danh sách Files

| File | Mô tả |
|------|-------|
| `articles.json` | 10 bài viết kiến thức sức khỏe tiếng Việt |
| `import-articles.js` | Script import bài viết vào database |
| `seed-realistic-data.js` | Script tạo dữ liệu sức khỏe thực tế đầy đủ |

## 🚀 Cách Sử Dụng

### 1. Cài đặt dependencies

```bash
cd setup/sample-data
npm install
```

### 2. Đảm bảo MongoDB đang chạy

```bash
# Nếu dùng Docker
cd docker
docker-compose up -d mongo

# Hoặc local MongoDB
mongod --dbpath /data/db
```

### 3. Import dữ liệu

#### Import bài viết kiến thức:
```bash
node import-articles.js
```

#### Tạo dữ liệu sức khỏe thực tế:
```bash
node seed-realistic-data.js
```

## 📊 Dữ liệu được tạo

### 📰 Articles (10 bài viết)
- Dinh dưỡng: Ăn uống lành mạnh, thực phẩm tăng miễn dịch
- Thể chất: Tập thể dục, bài tập văn phòng
- Tinh thần: Quản lý stress, thiền định, giấc ngủ
- Chung: Phòng bệnh tim mạch, kiểm tra sức khỏe định kỳ

### 🏥 Health Metrics (290 bản ghi/25 ngày)
- **Cân nặng**: Theo dõi hàng ngày với biến động tự nhiên
- **BMI**: Tính toán từ cân nặng và chiều cao
- **Huyết áp**: Đo sáng và tối, có metadata chi tiết
- **Nhịp tim**: Nghỉ ngơi và sau tập luyện
- **Bước chân**: Khác biệt ngày thường/cuối tuần
- **Giấc ngủ**: Số giờ và chất lượng
- **Nước uống**: Theo dõi lượng nước hàng ngày
- **Đường huyết**: Đo lúc đói
- **SpO2**: Nồng độ oxy trong máu
- **Tập thể dục**: Thời gian và loại hoạt động

### 😊 Mood Logs (25 bản ghi)
- Tâm trạng và điểm số (1-10)
- Năng lượng và stress
- Cảm xúc và hoạt động trong ngày
- Nhật ký cá nhân
- Danh sách biết ơn

### 🍜 Nutrition Logs (91 bữa ăn)
- Bữa sáng: Phở, bánh mì, xôi, bún bò, cháo...
- Bữa trưa: Cơm sườn, bún chả, cơm tấm, mì Quảng...
- Bữa tối: Cá kho, thịt kho, lẩu, gà nướng...
- Snack: Sữa chua, trái cây, hạt, sinh tố...
- Đầy đủ calories, protein, carbs, fat, fiber

### 🎯 Goals (7 mục tiêu)
- Giảm cân xuống 68kg
- Đi bộ 10,000 bước/ngày
- Hạ huyết áp
- Ngủ đủ 7-8 tiếng
- Uống đủ 2 lít nước
- Tập thể dục 30 phút/ngày
- Giảm BMI xuống mức bình thường

## 👤 Tài khoản Test

Sau khi chạy seed-realistic-data.js:
- **Email:** phankhoavn@gmail.com
- **Password:** 123456

## ⚠️ Lưu ý

- Scripts kết nối đến `mongodb://127.0.0.1:27017/phihub`
- Nếu dùng Docker, đảm bảo port 27017 được expose
- Chạy `seed-realistic-data.js` sẽ xóa dữ liệu cũ của user trước khi tạo mới
