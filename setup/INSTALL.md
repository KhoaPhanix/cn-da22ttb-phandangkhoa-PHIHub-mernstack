# HƯỚNG DẪN CÀI ĐẶT PHIHub

> **Personal Health Intelligence Hub** - Hệ thống Theo dõi và Tư vấn Sức khỏe

---

## 📋 MỤC LỤC
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Sơ đồ triển khai](#sơ-đồ-triển-khai)
3. [Cài đặt Development](#cài-đặt-development)
4. [Cài đặt Production với Docker](#cài-đặt-production-với-docker)
5. [Cấu hình Database](#cấu-hình-database)
6. [Dữ liệu thử nghiệm](#dữ-liệu-thử-nghiệm)
7. [Xử lý sự cố](#xử-lý-sự-cố)

---

## ✅ YÊU CẦU HỆ THỐNG

### Phần mềm cần thiết:
- **Node.js**: v18.x hoặc cao hơn
- **npm**: v9.x hoặc cao hơn (đi kèm với Node.js)
- **Docker Desktop**: v24.x trở lên (khuyến nghị cho production)
- **Docker Compose**: v2.x trở lên
- **Git**: v2.x trở lên

### Hệ điều hành được hỗ trợ:
- ✅ Windows 10/11 (64-bit)
- ✅ macOS 11+ (Big Sur trở lên)
- ✅ Linux (Ubuntu 20.04+, Debian 11+, CentOS 8+)

### Cấu hình phần cứng khuyến nghị:
- **RAM**: Tối thiểu 4GB (Khuyến nghị 8GB)
- **CPU**: 2 cores trở lên
- **Ổ cứng**: 10GB dung lượng trống
- **Mạng**: Kết nối Internet (để kết nối MongoDB Atlas)

---

## 🏗 SƠ ĐỒ TRIỂN KHAI

### Kiến trúc tổng quan:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                           │
│              (http://localhost:8080)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 NGINX (Frontend Server)                     │
│              React App (Vite Build)                         │
│              - Dashboard với Recharts                       │
│              - Authentication Pages                         │
│              - Metrics Entry Form                           │
│              Port: 8080                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS.JS (Backend API)                       │
│              - RESTful API Endpoints                        │
│              - JWT Authentication                           │
│              - Recommendation Engine                        │
│              Port: 5000                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Mongoose ODM
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              MONGODB ATLAS (Cloud Database)                 │
│              - Collection: users                            │
│              - Collection: health_metrics                   │
│              - Collection: articles                         │
│              Port: 27017                                    │
└─────────────────────────────────────────────────────────────┘
```

### Luồng dữ liệu:

```
User Login → Frontend → POST /api/auth/login → Backend 
→ Verify Password → Generate JWT → Set HttpOnly Cookie 
→ Return User Data → Redirect to Dashboard

User Entry Metrics → Frontend Form → POST /api/metrics 
→ Backend Validate → Save to MongoDB → Return Success 
→ Fetch Updated Chart Data → Recharts Render

Get Recommendations → Frontend Request → GET /api/recommendations 
→ Backend Fetch 7-day Metrics → Rule Engine Analysis 
→ Return AI Suggestions → Display on Dashboard
```

---

## 🚀 CÀI ĐẶT DEVELOPMENT

### BƯỚC 1: Clone Repository

```bash
git clone <repository-url>
cd PHIHub
```

### BƯỚC 2: Cài đặt Backend

```bash
cd src/server
npm install
```

**Tạo file `.env`** trong `src/server/`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://admin:Silnix13670@healthtracker.xmrtodc.mongodb.net/phihub?retryWrites=true&w=majority&appName=HealthTracker
JWT_SECRET=phihub_secret_key_2025_health_tracker_secure
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Lưu ý**: Đổi `JWT_SECRET` thành chuỗi bí mật của bạn trong production

### BƯỚC 3: Cài đặt Frontend

```bash
cd ../client
npm install
```

### BƯỚC 4: Chạy ứng dụng

**Terminal 1 - Backend:**
```bash
cd src/server
npm run dev
```
✅ Backend chạy tại: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd src/client
npm run dev
```
✅ Frontend chạy tại: `http://localhost:5173`

### BƯỚC 5: Kiểm tra hoạt động

Mở trình duyệt và truy cập:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health` (nên trả về status "ok")

---

## 🐳 CÀI ĐẶT PRODUCTION VỚI DOCKER

### Yêu cầu:
- Docker Desktop đã được cài đặt và đang chạy
- Docker Compose đã được cài đặt

### BƯỚC 1: Chuẩn bị môi trường

Đảm bảo file `.env` trong `src/server/` đã được cấu hình đúng:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://admin:Silnix13670@healthtracker.xmrtodc.mongodb.net/phihub?retryWrites=true&w=majority&appName=HealthTracker
JWT_SECRET=your_production_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:8080
```

### BƯỚC 2: Build và chạy containers

```bash
cd docker
docker-compose up -d --build
```

### BƯỚC 3: Kiểm tra containers

```bash
docker-compose ps
```

Kết quả mong đợi:
```
NAME                IMAGE               STATUS          PORTS
phihub-client       phihub-client       Up 30 seconds   0.0.0.0:8080->80/tcp
phihub-server       phihub-server       Up 30 seconds   0.0.0.0:5000->5000/tcp
phihub-mongo        mongo:7.0           Up 30 seconds   0.0.0.0:27017->27017/tcp
```

### BƯỚC 4: Xem logs

```bash
# Xem tất cả logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f server
docker-compose logs -f client
```

### BƯỚC 5: Truy cập ứng dụng

- **Frontend**: `http://localhost:8080`
- **Backend API**: `http://localhost:5000`

### Các lệnh Docker hữu ích:

```bash
# Dừng containers
docker-compose down

# Dừng và xóa volumes (xóa dữ liệu database)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build

# Restart service cụ thể
docker-compose restart server

# Xem resource usage
docker stats
```

---

## 🗄 CẤU HÌNH DATABASE

### Sử dụng MongoDB Atlas (Khuyến nghị)

Dự án đã được cấu hình sẵn với MongoDB Atlas:

```
mongodb+srv://admin:Silnix13670@healthtracker.xmrtodc.mongodb.net/phihub
```

**Ưu điểm:**
- ✅ Không cần cài đặt MongoDB local
- ✅ Free tier 512MB
- ✅ Tự động backup
- ✅ High availability

### Sử dụng MongoDB Local (Optional)

Nếu muốn sử dụng MongoDB local:

1. **Cài đặt MongoDB Community Edition**:
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Khởi động MongoDB**:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

3. **Sửa file `.env`**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/phihub
   ```

### Tạo Database và Collections

MongoDB sẽ tự động tạo database và collections khi có dữ liệu đầu tiên. Collections:

- `users`: Thông tin người dùng
- `health_metrics`: Dữ liệu sức khỏe
- `articles`: Bài viết kiến thức

---

## 🧪 DỮ LIỆU THỬ NGHIỆM

### Import dữ liệu mẫu

File dữ liệu mẫu nằm trong `setup/sample-data/`:

```bash
# Nếu sử dụng MongoDB Atlas
mongoimport --uri "mongodb+srv://admin:Silnix13670@healthtracker.xmrtodc.mongodb.net/phihub" \
  --collection articles \
  --file setup/sample-data/articles.json

# Nếu sử dụng MongoDB Local
mongoimport --db phihub --collection articles --file setup/sample-data/articles.json
```

### Tạo tài khoản test

Truy cập `http://localhost:8080/register` và đăng ký với thông tin:

```
Email: test@phihub.com
Password: Test123456
Tên: Nguyễn Văn A
Ngày sinh: 1990-01-01
Giới tính: Nam
```

### Tạo dữ liệu metrics test

Sau khi đăng nhập, truy cập "Nhập liệu" và nhập:

```
Cân nặng: 70 kg
Giấc ngủ: 7 giờ
Calo: 2000 kcal
Tập luyện: 30 phút
```

Lặp lại cho nhiều ngày để có dữ liệu biểu đồ đầy đủ.

---

## 🔧 XỬ LÝ SỰ CỐ

### Lỗi: "Cannot connect to MongoDB"

**Nguyên nhân**: Không thể kết nối đến MongoDB Atlas

**Giải pháp**:
1. Kiểm tra kết nối Internet
2. Verify MongoDB URI trong file `.env`
3. Kiểm tra IP whitelist trên MongoDB Atlas (0.0.0.0/0 cho phép tất cả)
4. Thử kết nối bằng MongoDB Compass: `mongodb+srv://admin:Silnix13670@healthtracker.xmrtodc.mongodb.net/`

### Lỗi: "Port 5000 already in use"

**Giải pháp**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

Hoặc đổi PORT trong `.env`:
```env
PORT=5001
```

### Lỗi: "JWT must be provided"

**Nguyên nhân**: Cookie không được gửi kèm request

**Giải pháp**:
1. Kiểm tra CORS configuration trong `src/server/src/server.js`
2. Đảm bảo `CLIENT_URL` trong `.env` khớp với URL frontend
3. Xóa cookies và đăng nhập lại

### Lỗi: Docker "no space left on device"

**Giải pháp**:
```bash
# Xóa unused images và containers
docker system prune -a

# Xóa volumes không dùng
docker volume prune
```

### Frontend không load sau khi build

**Giải pháp**:
1. Kiểm tra Nginx logs:
   ```bash
   docker-compose logs client
   ```

2. Verify file `nginx.conf` trong `src/client/nginx.conf`

3. Rebuild container:
   ```bash
   docker-compose up -d --build client
   ```

### Recharts không hiển thị dữ liệu

**Nguyên nhân**: Chưa có đủ dữ liệu metrics

**Giải pháp**:
- Nhập ít nhất 3-5 bản ghi metrics
- Kiểm tra console browser (F12) xem có lỗi API
- Verify data format trong DevTools Network tab

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề không nằm trong tài liệu này:

1. Kiểm tra logs:
   ```bash
   # Backend logs
   cd src/server && npm run dev
   
   # Docker logs
   cd docker && docker-compose logs -f
   ```

2. Kiểm tra Browser Console (F12) để xem lỗi frontend

3. Liên hệ team qua email hoặc điện thoại (xem README.md gốc)

---

**Cập nhật lần cuối: November 2025**  
**Phiên bản: 1.0.0**
