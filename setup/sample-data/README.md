# Script Import Dữ liệu Mẫu - PHIHub

> Script tự động import dữ liệu thử nghiệm vào MongoDB

## Yêu cầu
- Node.js đã cài đặt
- MongoDB URI (Atlas hoặc Local)

## Cách sử dụng

### 1. Cài đặt dependencies

```bash
cd setup/sample-data
npm install
```

### 2. Cấu hình MongoDB URI

Sửa file `import.js`, thay đổi `MONGODB_URI`:

```javascript
const MONGODB_URI = 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/phihub';
// Thay <username>, <password>, <cluster> bằng thông tin MongoDB Atlas của bạn
```

### 3. Chạy script

```bash
node import.js
```

## Dữ liệu sẽ được import

### Articles (5 bài viết)
- 7 Thói quen Ăn uống Lành mạnh
- Lợi ích của Việc Tập thể dục 30 phút
- Cách Quản lý Stress trong Cuộc sống Hiện đại
- Giấc ngủ Chất lượng
- Phòng ngừa Bệnh tim Mạch

### Users (2 tài khoản test)
- Email: test@phihub.com (Password: Test123456)
- Email: demo@phihub.com (Password: Demo123456)

### Health Metrics (30 ngày dữ liệu mẫu)
Cho mỗi user:
- Weight (cân nặng): 30 bản ghi
- Sleep (giấc ngủ): 30 bản ghi
- Calories: 30 bản ghi
- Exercise: 30 bản ghi

## Xóa dữ liệu cũ

Nếu muốn xóa toàn bộ dữ liệu và import lại:

```bash
node import.js --clean
```

## Kiểm tra sau import

```bash
# Đặt MONGO_URI từ file .env hoặc thay trực tiếp
export MONGO_URI="<your-mongodb-uri>"

# Đếm số bài viết
mongosh "$MONGO_URI" --eval "db.articles.countDocuments()"

# Đếm số users
mongosh "$MONGO_URI" --eval "db.users.countDocuments()"

# Đếm số metrics
mongosh "$MONGO_URI" --eval "db.health_metrics.countDocuments()"
```
