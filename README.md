# PHIHub - Personal Health Intelligence Hub 🏥

> Trung tâm Thông minh Sức khỏe Cá nhân - Website tư vấn và theo dõi sức khỏe được xây dựng với MERN Stack

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)](https://github.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://mongodb.com)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Deploy-Docker-2496ED?logo=docker)](https://docker.com)

---

## 📞 THÔNG TIN LIÊN HỆ

**Sinh viên thực hiện:**
- **Họ tên:** Phan Đăng Khoa
- **MSSV:** 110122227
- **Email:** phandangkhoawork@gmail.com
- **Điện thoại:** 0867570650

**Giảng viên hướng dẫn:**
- **Họ tên:** TH.Sỹ  

**Trường:** Đại học Trà Vinh
**Khoa:** Công nghệ thông tin
**Năm học:** 2025-2026

**Repository:** https://github.com/KhoaPhanix/cn-da22ttb-phandangkhoa-PHIHub-mernstack

---

## 📋 Mục Lục

- [Thông tin liên hệ](#-thông-tin-liên-hệ)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Kiến trúc](#-kiến-trúc)
- [Cài đặt](#-cài-đặt)
- [Documentation](#-documentation)
- [Sử dụng](#-sử-dụng)
- [API Documentation](#-api-documentation)
- [Docker Deploy](#-docker-deployment)

---

## 📁 CẤU TRÚC DỰ ÁN

```
PHIHub/
├── README.md                    # Tài liệu chính (file này)
│
├── setup/                       # Hướng dẫn cài đặt và triển khai
│   ├── INSTALL.md              # Hướng dẫn cài đặt chi tiết
│   └── sample-data/            # Dữ liệu thử nghiệm
│       ├── articles.json       # Dữ liệu bài viết mẫu
│       ├── import.js           # Script import dữ liệu
│       ├── package.json
│       └── README.md
│
├── src/                         # Mã nguồn chương trình
│   ├── client/                 # Frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── pages/         # Các trang chính
│   │   │   ├── context/       # State management
│   │   │   ├── services/      # API services
│   │   │   └── App.jsx
│   │   ├── public/
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── server/                 # Backend (Node.js + Express)
│       ├── src/
│       │   ├── models/        # Mongoose schemas
│       │   ├── controllers/   # Route handlers
│       │   ├── routes/        # API routes
│       │   ├── middleware/    # Auth, error handling
│       │   ├── services/      # Business logic
│       │   ├── config/        # Database config
│       │   └── server.js      # Entry point
│       ├── Dockerfile
│       ├── package.json
│       └── .env.example
│
├── docker/                      # Docker deployment
│   └── docker-compose.yml      # Container orchestration
│
├── docs/                        # Tài liệu dự án
│   ├── API_DOCUMENTATION.md    # Tài liệu API đầy đủ
│   ├── USER_GUIDE.md          # Hướng dẫn người dùng
│   └── GUIDE_FOR_BOARD.md     # Báo cáo cho hội đồng
│
├── progress-report/             # [BẮT BUỘC] Báo cáo tiến độ
│   └── [Các file báo cáo tuần/tháng]
│
├── thesis/                      # [BẮT BUỘC] Tài liệu đồ án
│   ├── doc/                    # Tài liệu .DOC/.DOCX
│   ├── pdf/                    # Tài liệu .PDF
│   ├── html/                   # Tài liệu web
│   ├── abs/                    # Báo cáo tóm tắt (.PPT, .AVI, ...)
│   └── refs/                   # Tài liệu tham khảo
│
└── soft/                        # Phần mềm liên quan (nếu có)
    └── [Các công cụ, thư viện hỗ trợ]
```

### Chi tiết các thư mục

#### 📂 setup/
Chứa tài liệu hướng dẫn cài đặt chi tiết và dữ liệu thử nghiệm:
- `INSTALL.md`: Hướng dẫn setup development và production
- `sample-data/`: Script và dữ liệu mẫu để test hệ thống

#### 📂 src/
Mã nguồn chính của ứng dụng:
- `client/`: Frontend React application
- `server/`: Backend API Node.js/Express

#### 📂 docker/
Cấu hình triển khai Docker với docker-compose

#### 📂 docs/
Tài liệu dự án đầy đủ:
- API Documentation, User Guide, Board Guide

#### 📂 progress-report/
**[BẮT BUỘC]** Các báo cáo tiến độ theo tuần/tháng

#### 📂 thesis/
**[BẮT BUỘC]** Tài liệu đồ án đầy đủ với các định dạng khác nhau

#### 📂 soft/
Các phần mềm, công cụ hỗ trợ (nếu có)

---

## 🎯 Giới thiệu

**PHIHub** là một ứng dụng web full-stack giúp người dùng:
- ✅ Theo dõi chỉ số sức khỏe hàng ngày (cân nặng, giấc ngủ, calo, hoạt động thể chất)
- 📊 Trực quan hóa dữ liệu qua biểu đồ tương tác (LineChart, BarChart, PieChart)
- 🤖 Nhận khuyến nghị sức khỏe tự động dựa trên **Rule-based AI Engine**
- 📚 Truy cập thư viện kiến thức y tế
- 🔐 Xác thực an toàn với JWT (HttpOnly Cookie)

---

## ✨ Tính năng

### 🔐 Xác thực & Quản lý người dùng
- Đăng ký/Đăng nhập với JWT Authentication
- HttpOnly Cookie (bảo mật cao, chống XSS)
- Quản lý hồ sơ cá nhân đầy đủ với 3 tabs:
  - **Thông tin cơ bản**: Tên, ngày sinh, giới tính, địa chỉ
  - **Thông tin y tế**: Quản lý bệnh lý nền, dị ứng, thuốc đang dùng
  - **Liên hệ khẩn cấp**: Người liên hệ khẩn cấp và thông tin bác sĩ

### 📊 Dashboard & Trực quan hóa
- Biểu đồ đường (LineChart): Theo dõi biến động cân nặng 30 ngày
- Biểu đồ cột (BarChart): Phân tích giấc ngủ 7 ngày gần nhất
- Thống kê tổng hợp: Trung bình, Min, Max
- **Cảnh báo sức khỏe thông minh** (AlertBanner) với severity levels
- **Hiển thị mục tiêu** đang hoạt động (top 3) với progress bars
- Sử dụng **Recharts** library

### 🎯 Đặt và Theo Dõi Mục Tiêu
- Đặt mục tiêu cho các chỉ số sức khỏe (cân nặng, BMI, huyết áp, giấc ngủ, v.v.)
- Tự động tính toán tiến độ và cập nhật progress
- Hiển thị trực quan với progress bars
- Filter theo status (Active/Completed/Failed/All)
- Thống kê tổng quan về mục tiêu
- Quản lý milestones

### 🍎 Theo Dõi Dinh Dưỡng
- Ghi nhật ký bữa ăn chi tiết (Sáng, Trưa, Tối, Snack)
- Theo dõi nhiều món ăn trong một bữa
- Tự động tính toán tổng calories và macros (protein, carbs, fats)
- Biểu đồ Pie Chart cho phân bố macronutrients
- Thống kê dinh dưỡng theo tuần
- Date picker để xem lịch sử

### 😊 Nhật Ký Tâm Trạng
- Ghi nhật ký tâm trạng hàng ngày với emoji selector
- Theo dõi energy, stress, anxiety levels (sliders 1-10)
- Emotion và activity tags (multi-select)
- Journaling với textarea
- Gratitude list (3 items)
- Biểu đồ Line Chart hiển thị xu hướng tâm trạng 30 ngày
- Thống kê trung bình mood, energy, stress, anxiety

### ⏰ Hệ Thống Nhắc Nhở Thông Minh
- Nhắc nhở uống thuốc, uống nước, tập luyện
- Lập lịch linh hoạt: daily, weekly, monthly, custom
- Toggle on/off nhanh chóng
- Tự động tính thời gian nhắc tiếp theo
- ReminderCard component với icons

### 🚨 Cảnh Báo Sức Khỏe Tự Động
- Phân tích chỉ số và cảnh báo bất thường
- Severity levels: low, medium, high, critical
- Color-coded alerts (blue/yellow/orange/red)
- Mark as read/resolved actions
- Tự động tạo alerts khi metrics vượt ngưỡng
- AlertBanner hiển thị ở đầu Dashboard

### 📝 Ghi nhận dữ liệu
- Form nhập liệu thủ công với MetricsEntryPage
- Hỗ trợ 11 loại metrics: weight, height, BMI, blood pressure, heart rate, blood sugar, temperature, sleep, calories, steps, exercise
- Lưu trữ với timestamp
- Date picker để chọn ngày

### 📈 Lịch Sử & Phân Tích
- HistoryPage với 2 chế độ xem: Charts và Table
- Export dữ liệu ra CSV
- Filter theo loại metric và khoảng thời gian
- Phân tích xu hướng dài hạn

### 🤖 Hệ thống khuyến nghị thông minh
- **Rule-based Engine** với `json-rules-engine`
- Phân tích dữ liệu 7 ngày gần nhất
- 15 rules: giấc ngủ, cân nặng, BMI, huyết áp, đường huyết, hoạt động thể chất, calories
- Khuyến nghị tự động hiển thị trên Dashboard

### 📚 Góc kiến thức
- Thư viện bài viết sức khỏe (KnowledgePage)
- Lọc theo danh mục (Dinh dưỡng, Thể chất, Tinh thần, Chung)
- Chi tiết bài viết với HTML rendering
- Search functionality

---

## 🛠 Công nghệ

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool (cực nhanh)
- **React Router DOM 6** - Routing
- **Recharts** - Data visualization (LineChart, BarChart, PieChart)
- **Axios** - HTTP client
- **Tailwind CSS** - Styling (dark theme)
- **date-fns** - Date utilities

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **json-rules-engine** - Recommendation engine (15 rules)
- **cookie-parser** - Cookie management
- **multer** - File uploads (avatars)

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend serving (production)
- **Git** - Version control

---

## 🏗 Kiến trúc

**Xem chi tiết trong:** `setup/INSTALL.md` - Phần "Sơ đồ triển khai"

```
Client (React + Vite)
    ↓ HTTP/HTTPS
Nginx (Production) → Backend API (Express)
                         ↓
                    MongoDB
```

### Cấu trúc thư mục

```
src/
├── client/                      # Frontend
│   ├── src/
│   │   ├── components/         # 7 components (Footer, Navbar, AlertBanner, etc.)
│   │   ├── pages/              # 11 pages (Dashboard, Goals, Nutrition, Mood, etc.)
│   │   ├── context/            # AuthContext
│   │   ├── services/           # 11 API services
│   │   └── App.jsx
│   ├── Dockerfile
│   └── nginx.conf
│
└── server/                      # Backend
    ├── src/
    │   ├── models/             # 8 Mongoose models
    │   ├── controllers/        # 10 controllers
    │   ├── routes/             # 10 route files
    │   ├── middleware/         # auth.js, errorHandler.js
    │   ├── services/           # recommendationService.js (15 rules)
    │   └── server.js
    └── Dockerfile
```

### Database Schema (8 Models)

**Collection: users**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  dob: Date,
  gender: String,
  phone: String,
  address: String,
  avatar: String,
  medicalInfo: {
    chronicConditions: [...],
    allergies: [...],
    medications: [...],
    emergencyContact: {...},
    doctor: {...}
  }
}
```

**Collection: health_metrics**
```javascript
{
  userId: ObjectId (ref: User),
  metricType: String (weight/sleep/calories/exercise/bmi/bloodPressure/heartRate/bloodSugar/temperature/steps/height),
  value: Number,
  unit: String,
  timestamp: Date,
  notes: String
}
```

**Collection: goals**
```javascript
{
  userId: ObjectId,
  title: String,
  description: String,
  goalType: String,
  startValue: Number,
  targetValue: Number,
  currentValue: Number,
  unit: String,
  startDate: Date,
  targetDate: Date,
  status: String (active/completed/failed/cancelled),
  progress: Number (0-100),
  milestones: [...],
  reminders: {...}
}
```

**Collection: nutrition**
```javascript
{
  userId: ObjectId,
  date: Date,
  mealType: String (breakfast/lunch/dinner/snack),
  foodItems: [{
    name: String,
    quantity: Number,
    unit: String,
    calories: Number,
    macros: { protein, carbs, fats, fiber }
  }],
  totalCalories: Number,
  totalMacros: {...},
  notes: String
}
```

**Collection: mood_logs**
```javascript
{
  userId: ObjectId,
  date: Date,
  mood: String (excellent/good/okay/bad/terrible),
  moodScore: Number (1-10),
  energy: String,
  energyScore: Number,
  stress: String,
  stressScore: Number,
  anxiety: Number,
  activities: [String],
  emotions: [String],
  journal: String,
  gratitude: [String],
  sleepQuality: Number,
  productivity: Number
}
```

**Collection: reminders**
```javascript
{
  userId: ObjectId,
  title: String,
  description: String,
  type: String (medication/water/exercise/meal/checkup/custom),
  time: String (HH:MM),
  frequency: String (once/daily/weekly/monthly/custom),
  daysOfWeek: [Number],
  customDays: [Date],
  isActive: Boolean,
  lastTriggered: Date,
  nextScheduled: Date
}
```

**Collection: alerts**
```javascript
{
  userId: ObjectId,
  title: String,
  message: String,
  severity: String (low/medium/high/critical),
  category: String,
  relatedMetric: ObjectId,
  isRead: Boolean,
  isResolved: Boolean,
  resolvedAt: Date,
  expiresAt: Date
}
```

**Collection: articles**
```javascript
{
  title: String,
  content: String (HTML),
  category: String,
  imageUrl: String,
  author: String,
  publishedAt: Date
}
```

---

## 🚀 Cài đặt

> **📖 Xem hướng dẫn đầy đủ tại:** [`setup/INSTALL.md`](setup/INSTALL.md)

### Yêu cầu hệ thống
- **Node.js** >= 18.x
- **npm** hoặc **yarn**
- **MongoDB** (local hoặc Atlas)
- **Docker** & **Docker Compose** (cho deployment)

### Quick Start - Development

```bash
# 1. Clone repository
git clone https://github.com/KhoaPhanix/cn-da22ttb-phandangkhoa-PHIHub-mernstack.git
cd PHIHub

# 2. Cài đặt Backend
cd src/server
npm install
# Tạo file .env (xem .env.example)
# Điền MONGO_URI, JWT_SECRET, PORT, CLIENT_URL

# 3. Cài đặt Frontend
cd ../client
npm install

# 4. Chạy ứng dụng
# Terminal 1 - Backend (port 5000)
cd src/server
npm run dev

# Terminal 2 - Frontend (port 5173)
cd src/client
npm run dev
```

### Quick Start - Docker

```bash
cd docker
docker-compose up -d --build
# Truy cập: http://localhost:8080
```

**Xem thêm:**
- Hướng dẫn cài đặt chi tiết: `setup/INSTALL.md`
- Import dữ liệu mẫu: `setup/sample-data/README.md`

---

## 📚 Documentation

### 📖 Tài Liệu Hướng Dẫn

- **[API Documentation](docs/API_DOCUMENTATION.md)** - Tài liệu API đầy đủ với 60+ endpoints
- **[User Guide](docs/USER_GUIDE.md)** - Hướng dẫn sử dụng chi tiết cho người dùng
- **[Installation Guide](setup/INSTALL.md)** - Hướng dẫn cài đặt và triển khai
- **[Board Guide](docs/GUIDE_FOR_BOARD.md)** - Báo cáo cho hội đồng
- **[Features Status](FEATURES_IMPLEMENTATION_STATUS.md)** - Trạng thái triển khai tính năng
- **[Changelog](CHANGELOG.md)** - Lịch sử phát triển dự án

### 🎯 Quick Links

**Cho Người Dùng:**
- [Bắt đầu sử dụng](docs/USER_GUIDE.md#đăng-ký--đăng-nhập)
- [Nhập liệu sức khỏe](docs/USER_GUIDE.md#nhập-liệu-sức-khỏe)
- [Quản lý mục tiêu](docs/USER_GUIDE.md#quản-lý-mục-tiêu)
- [FAQ](docs/USER_GUIDE.md#faq-câu-hỏi-thường-gặp)

**Cho Developers:**
- [API Endpoints](docs/API_DOCUMENTATION.md#authentication)
- [Database Schema](docs/API_DOCUMENTATION.md#database-schema)
- [Error Handling](docs/API_DOCUMENTATION.md#error-handling)
- [Authentication Flow](docs/API_DOCUMENTATION.md#authentication-flow)

**Cho Admin:**
- [Setup Development](setup/INSTALL.md#development-setup)
- [Deploy Docker](setup/INSTALL.md#docker-deployment)
- [Troubleshooting](setup/INSTALL.md#troubleshooting)

---

## 💻 Sử dụng

### Development Mode

**Backend (Port 5000):**
```bash
cd src/server
npm run dev  # nodemon
```

**Frontend (Port 5173):**
```bash
cd src/client
npm run dev  # Vite dev server
```

Truy cập: `http://localhost:5173`

### Production Build

```bash
# Build Frontend
cd src/client
npm run build  # → dist/

# Run Backend
cd ../server
npm start
```

### Docker Deployment

```bash
cd docker
docker-compose up -d
```

**Services:**
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

**Xem thêm:** `setup/INSTALL.md` - Xử lý sự cố

---

## 📡 API Documentation

> **📖 Xem tài liệu đầy đủ:** [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)

### Base URL
```
http://localhost:5000/api
```

### 10 API Route Groups (60+ Endpoints)

1. **Authentication** (`/api/auth`) - Register, Login, Logout, Get Me
2. **Users** (`/api/users`) - Profile management, Avatar upload
3. **Health Metrics** (`/api/metrics`) - CRUD, Statistics, Charts data
4. **Goals** (`/api/goals`) - CRUD, Progress tracking, Statistics
5. **Nutrition** (`/api/nutrition`) - Meal logging, Daily summary, Stats
6. **Mood Logs** (`/api/mood`) - CRUD, Trend analysis, Statistics
7. **Reminders** (`/api/reminders`) - CRUD, Toggle, Upcoming reminders
8. **Alerts** (`/api/alerts`) - Auto-generated health alerts, CRUD
9. **Articles** (`/api/articles`) - Knowledge base (public + admin)
10. **Recommendations** (`/api/recommendations`) - AI-powered health advice

### Example Requests

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "dob": "1990-01-01",
  "gender": "male"
}
```

#### Get Dashboard Data
```bash
GET /api/metrics?metricType=weight&days=30
Authorization: Bearer <token>
```

#### Create Goal
```bash
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Giảm cân",
  "goalType": "weight",
  "startValue": 75,
  "targetValue": 70,
  "unit": "kg",
  "targetDate": "2025-03-15"
}
```

🔒 = Yêu cầu authentication (JWT token in HttpOnly cookie)

---

## 🐳 Docker Deployment

> **📖 Xem hướng dẫn chi tiết:** [`setup/INSTALL.md`](setup/INSTALL.md) - Phần "Docker"

### Chạy toàn bộ hệ thống

```bash
cd docker
docker-compose up -d --build
```

### Quản lý containers

```bash
# Xem logs
docker-compose logs -f

# Xem logs specific service
docker-compose logs -f server

# Dừng containers
docker-compose down

# Xóa volumes
docker-compose down -v

# Rebuild
docker-compose up -d --build
```

### Cấu trúc Docker

```yaml
services:
  mongo:    # MongoDB 7.0 (port 27017)
  server:   # Backend API (port 5000)
  client:   # Frontend Nginx (port 8080)
```

**Volumes:** `mongo-data` (persistent storage)  
**Network:** `phihub-network` (bridge)

---

## 🤖 AI Recommendation Engine

Sử dụng **json-rules-engine** để tạo rule-based AI với **15 rules**:

### Categories:

1. **Sleep** - 3 rules (insufficient, good, excessive)
2. **Weight** - 2 rules (rapid loss, rapid gain)
3. **BMI** - 3 rules (underweight, overweight, obese)
4. **Blood Pressure** - 2 rules (high, low)
5. **Blood Sugar** - 2 rules (high, low)
6. **Exercise** - 1 rule (insufficient)
7. **Calories** - 2 rules (excessive, insufficient)

### Thêm rule mới:

Edit file `src/server/src/services/recommendationService.js`

```javascript
engine.addRule({
  conditions: {
    all: [
      {
        fact: 'averageSleep',
        operator: 'lessThan',
        value: 7,
      },
    ],
  },
  event: {
    type: 'sleep_insufficient',
    params: {
      message: 'Custom message here',
      priority: 'high',
      category: 'sleep',
    },
  },
});
```

---

## 📊 Thống Kê Dự Án

### Code Statistics
- **Total Files:** 200+
- **Lines of Code:** 25,000+
- **Frontend Components:** 7 reusable components
- **Frontend Pages:** 11 pages
- **Backend Models:** 8 Mongoose schemas
- **Backend Controllers:** 10 controllers
- **Backend Routes:** 10 route groups
- **API Endpoints:** 60+
- **AI Rules:** 15 health recommendation rules

### Tech Stack Versions
- React: 18.3.1
- Node.js: >= 18.x
- Express: 4.21.2
- MongoDB: 7.0
- Mongoose: 8.8.4
- Vite: 6.0.3
- Tailwind CSS: 3.4.17
- Recharts: 2.15.0

---

## 📝 Tính Năng Nổi Bật

### ✅ Đã Hoàn Thành (Backend: 100%, Frontend: 100%)

**Backend (100%):**
- ✅ 8 Mongoose models với validation
- ✅ 10 controllers với error handling
- ✅ 60+ API endpoints
- ✅ JWT authentication với HttpOnly cookies
- ✅ AI recommendation engine (15 rules)
- ✅ File upload (multer)
- ✅ CORS configuration
- ✅ Error middleware

**Frontend (100%):**
- ✅ 11 pages hoàn chỉnh
- ✅ 7 reusable components
- ✅ AuthContext state management
- ✅ 11 API service clients
- ✅ Responsive design (Tailwind CSS)
- ✅ Dark theme
- ✅ Charts (Line, Bar, Pie)
- ✅ Form validation
- ✅ Date pickers
- ✅ CSV export
- ✅ Search & Filter

**DevOps:**
- ✅ Docker setup (3 containers)
- ✅ Docker Compose orchestration
- ✅ Nginx configuration
- ✅ Environment variables
- ✅ Git version control

**Documentation:**
- ✅ README.md (file này)
- ✅ API Documentation (60+ endpoints)
- ✅ User Guide (13 sections)
- ✅ Installation Guide
- ✅ Board Guide
- ✅ Changelog

---

## 🔒 Security Features

1. **JWT Authentication**
   - HttpOnly Cookie (không thể truy cập từ JavaScript → chống XSS)
   - Secure flag (HTTPS only in production)
   - SameSite strict (chống CSRF)
   - 24h expiration

2. **Password Security**
   - bcryptjs hashing (salt rounds: 10)
   - Password không bao giờ trả về trong response
   - Min length validation

3. **CORS Configuration**
   - Chỉ cho phép client URL cụ thể
   - Credentials: true (cho phép cookies)
   - Methods: GET, POST, PUT, PATCH, DELETE

4. **Input Validation**
   - Mongoose schema validation
   - Email format validation
   - Required fields checking
   - Enum validation

5. **File Upload Security**
   - File type restriction (images only)
   - File size limit (5MB)
   - Unique filenames (UUID)

---

## 🎨 UI/UX Features

- **Responsive Design** - Mobile, Tablet, Desktop
- **Dark Theme** - Tailwind CSS với dark mode
- **Loading States** - LoadingSpinner component
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Success/Error feedback
- **Progress Indicators** - Progress bars, percentages
- **Charts & Visualizations** - Recharts library
- **Date Pickers** - HTML5 date inputs
- **Multi-select Tags** - Emotion, Activity tags
- **Sliders** - Energy, Stress, Anxiety levels
- **Tabs Navigation** - ProfilePage (3 tabs)
- **Modal Forms** - Add/Edit dialogs
- **Search & Filter** - KnowledgePage, HistoryPage
- **CSV Export** - HistoryPage data export

---

## 📝 License

MIT License - Free to use for personal and commercial projects.

---

## 👨‍💻 Author

**Developed with ❤️ by KhoaPhanix**

- **GitHub:** [@KhoaPhanix](https://github.com/KhoaPhanix)
- **Email:** phandangkhoawork@gmail.com
- **University:** Trà Vinh University
- **Major:** Information Technology
- **Year:** 2025-2026

---

## 🙏 Acknowledgments

- **Recharts** - Beautiful charts library
- **MongoDB** - Flexible NoSQL database
- **Tailwind CSS** - Utility-first CSS framework
- **json-rules-engine** - Rule-based decision engine
- **React** - Powerful UI library
- **Express** - Fast, minimalist web framework
- **Vite** - Lightning-fast build tool
- **Docker** - Containerization platform

---

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:

1. **Email:** phandangkhoawork@gmail.com
2. **GitHub Issues:** [Create an issue](https://github.com/KhoaPhanix/cn-da22ttb-phandangkhoa-PHIHub-mernstack/issues)
3. **Documentation:** Xem `docs/` folder
4. **FAQ:** [User Guide - FAQ Section](docs/USER_GUIDE.md#faq-câu-hỏi-thường-gặp)

---

**Happy Coding! 🚀**
