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
- 📊 Trực quan hóa dữ liệu qua biểu đồ tương tác (LineChart, BarChart)
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

### 🎯 Đặt và Theo Dõi Mục Tiêu ⭐ MỚI
- Đặt mục tiêu cho các chỉ số sức khỏe (cân nặng, BMI, huyết áp, giấc ngủ, v.v.)
- Tự động tính toán tiến độ và cập nhật progress
- Hiển thị trực quan với progress bars
- Filter theo status (Active/Completed/Failed/All)
- Thống kê tổng quan về mục tiêu
- Quản lý milestones

### 🍎 Theo Dõi Dinh Dưỡng ⭐ MỚI
- Ghi nhật ký bữa ăn chi tiết (Sáng, Trưa, Tối, Snack)
- Theo dõi nhiều món ăn trong một bữa
- Tự động tính toán tổng calories và macros (protein, carbs, fats)
- Biểu đồ Pie Chart cho phân bố macronutrients
- Thống kê dinh dưỡng theo tuần
- Date picker để xem lịch sử

### 😊 Nhật Ký Tâm Trạng ⭐ MỚI
- Ghi nhật ký tâm trạng hàng ngày với emoji selector
- Theo dõi energy, stress, anxiety levels (sliders 1-10)
- Emotion và activity tags (multi-select)
- Journaling với textarea
- Gratitude list (3 items)
- Biểu đồ Line Chart hiển thị xu hướng tâm trạng 30 ngày
- Thống kê trung bình mood, energy, stress, anxiety

### ⏰ Hệ Thống Nhắc Nhở Thông Minh ⭐ MỚI
- Nhắc nhở uống thuốc, uống nước, tập luyện
- Lập lịch linh hoạt: daily, weekly, monthly, custom
- Toggle on/off nhanh chóng
- Tự động tính thời gian nhắc tiếp theo
- ReminderCard component với icons

### 🚨 Cảnh Báo Sức Khỏe Tự Động ⭐ MỚI
- Phân tích chỉ số và cảnh báo bất thường
- Severity levels: low, medium, high, critical
- Color-coded alerts (blue/yellow/orange/red)
- Mark as read/resolved actions
- Tự động tạo alerts khi metrics vượt ngưỡng
- AlertBanner hiển thị ở đầu Dashboard

### 📝 Ghi nhận dữ liệu
- Form nhập liệu thủ công
- Hỗ trợ nhiều loại metrics: weight, sleep, calories, exercise
- Lưu trữ với timestamp

### 🤖 Hệ thống khuyến nghị thông minh
- **Rule-based Engine** với `json-rules-engine`
- Phân tích dữ liệu 7 ngày gần nhất
- Khuyến nghị tự động về: giấc ngủ, cân nặng, hoạt động thể chất

### 📚 Góc kiến thức
- Thư viện bài viết sức khỏe
- Lọc theo danh mục (Dinh dưỡng, Thể chất, Tinh thần)
- Chi tiết bài viết với HTML rendering

---

## 🛠 Công nghệ

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool (cực nhanh)
- **React Router DOM 6** - Routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **date-fns** - Date utilities

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **json-rules-engine** - Recommendation engine
- **cookie-parser** - Cookie management

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend serving (production)

---

## 🏗 Kiến trúc

**Xem chi tiết trong:** `setup/INSTALL.md` - Phần "Sơ đồ triển khai"

```
PHIHub/
├── src/
│   ├── client/                  # Frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── components/     # Reusable components
│   │   │   ├── pages/          # Page components
│   │   │   ├── context/        # AuthContext (state management)
│   │   │   ├── services/       # API services
│   │   │   └── App.jsx
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   │
│   └── server/                  # Backend (Node.js + Express)
│       ├── src/
│       │   ├── models/         # Mongoose schemas
│       │   ├── controllers/    # Route handlers
│       │   ├── routes/         # API routes
│       │   ├── middleware/     # Auth, error handling
│       │   ├── services/       # Business logic
│       │   └── server.js
│       ├── Dockerfile
│       └── .env
│
└── docker/
    └── docker-compose.yml       # Container orchestration
```

### Database Schema

**Collection: users**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  dob: Date,
  gender: String (male/female/other),
  phone: String,
  address: String,
  medicalInfo: {
    chronicConditions: [{
      name: String,
      diagnosedDate: Date,
      severity: String (mild/moderate/severe),
      notes: String
    }],
    allergies: [{
      allergen: String,
      reaction: String,
      severity: String (mild/moderate/severe)
    }],
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date,
      purpose: String,
      prescribedBy: String
    }],
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },
    doctor: {
      name: String,
      specialty: String,
      phone: String,
      hospital: String
    }
  }
}
```

**Collection: health_metrics**
```javascript
{
  userId: ObjectId (ref: User),
  metricType: String (weight/sleep/calories/exercise),
  value: Number,
  unit: String,
  timestamp: Date
}
```

**Collection: goals** ⭐ MỚI
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  goalType: String (weight/bmi/bloodPressure/sleep/steps/exercise/calories/water/custom),
  startValue: Number,
  targetValue: Number,
  currentValue: Number,
  unit: String,
  startDate: Date,
  targetDate: Date,
  status: String (active/completed/failed/cancelled),
  progress: Number (0-100),
  milestones: [{
    value: Number,
    date: Date,
    achieved: Boolean
  }],
  reminders: {
    enabled: Boolean,
    frequency: String (daily/weekly/custom)
  }
}
```

**Collection: nutrition** ⭐ MỚI
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  mealType: String (breakfast/lunch/dinner/snack),
  foodItems: [{
    name: String,
    quantity: Number,
    unit: String,
    calories: Number,
    macros: {
      protein: Number,
      carbs: Number,
      fats: Number,
      fiber: Number
    }
  }],
  totalCalories: Number (auto-calculated),
  totalMacros: {
    protein: Number,
    carbs: Number,
    fats: Number,
    fiber: Number
  },
  notes: String
}
```

**Collection: mood_logs** ⭐ MỚI
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  mood: String (excellent/good/okay/bad/terrible),
  moodScore: Number (1-10),
  energy: String (very_high/high/medium/low/very_low),
  energyScore: Number (1-10),
  stress: String (none/low/medium/high/very_high),
  stressScore: Number (1-10),
  anxiety: Number (0-10),
  activities: [String] (work/exercise/social/family/hobby/meditation/relaxation/other),
  emotions: [String] (happy/sad/angry/anxious/excited/tired/motivated/grateful/frustrated/peaceful),
  journal: String,
  gratitude: [String] (max 3),
  sleepQuality: Number (1-10),
  productivity: Number (1-10)
}
```

**Collection: reminders** ⭐ MỚI
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  type: String (medication/water/exercise/meal/checkup/custom),
  time: String (HH:MM),
  frequency: String (once/daily/weekly/monthly/custom),
  daysOfWeek: [Number] (for weekly),
  customDays: [Date] (for custom),
  isActive: Boolean,
  lastTriggered: Date,
  nextScheduled: Date (auto-calculated)
}
```

**Collection: alerts** ⭐ MỚI
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  message: String,
  severity: String (low/medium/high/critical),
  category: String (weight/bloodPressure/heartRate/sleep/exercise/nutrition),
  relatedMetric: ObjectId (ref: HealthMetric),
  isRead: Boolean,
  isResolved: Boolean,
  resolvedAt: Date,
  expiresAt: Date (auto-set to +7 days)
}
```

**Collection: articles**
```javascript
{
  title: String,
  content: String (HTML),
  category: String,
  imageUrl: String,
  publishedAt: Date
}
```

---

## 🚀 Cài đặt

> **📖 Xem hướng dẫn đầy đủ tại:** [`setup/INSTALL.md`](setup/INSTALL.md)

### Yêu cầu hệ thống
- **Node.js** >= 18.x
- **npm** hoặc **yarn**
- **Docker** & **Docker Compose** (cho deployment)

### Quick Start - Development

```bash
# 1. Clone repository
git clone <repository-url>
cd PHIHub

# 2. Cài đặt Backend
cd src/server
npm install
# Tạo file .env (xem .env.example)

# 3. Cài đặt Frontend
cd ../client
npm install

# 4. Chạy ứng dụng
# Terminal 1 - Backend
cd src/server && npm run dev

# Terminal 2 - Frontend  
cd src/client && npm run dev
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

## 💻 Sử dụng

### Development Mode

**Backend (Port 5000):**
```bash
cd src/server
npm run dev
```

**Frontend (Port 5173):**
```bash
cd src/client
npm run dev
```

Truy cập: `http://localhost:5173`

### Production Build

```bash
# Build Frontend
cd src/client
npm run build

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

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/auth/register`
Đăng ký người dùng mới
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "dob": "1990-01-01",
  "gender": "male"
}
```

#### POST `/auth/login`
Đăng nhập (set HttpOnly Cookie)
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/auth/me` 🔒
Lấy thông tin user hiện tại

#### POST `/auth/logout` 🔒
Đăng xuất (xóa cookie)

### Metrics Endpoints

#### GET `/metrics` 🔒
Lấy danh sách metrics
```
Query params:
- metricType: weight|sleep|calories|exercise
- startDate: ISO date
- endDate: ISO date
- limit: number (default: 100)
```

#### POST `/metrics` 🔒
Tạo metric mới
```json
{
  "metricType": "weight",
  "value": 70.5,
  "unit": "kg",
  "timestamp": "2025-01-15T10:00:00Z"
}
```

#### GET `/metrics/stats` 🔒
Lấy thống kê metrics
```
Query params:
- metricType: weight|sleep|calories|exercise
- days: number (default: 7)
```

### Recommendations Endpoint

#### GET `/recommendations` 🔒
Lấy khuyến nghị sức khỏe dựa trên Rule Engine

### User Endpoints

#### PUT `/users/me` 🔒
Cập nhật profile (bao gồm cả medicalInfo)
```json
{
  "name": "Nguyễn Văn B",
  "dob": "1990-01-01",
  "gender": "male",
  "phone": "0987654321",
  "address": "123 Nguyễn Huệ",
  "medicalInfo": {
    "chronicConditions": [...],
    "allergies": [...],
    "medications": [...],
    "emergencyContact": {...},
    "doctor": {...}
  }
}
```

### Goals Endpoints ⭐ MỚI

#### GET `/goals` 🔒
Lấy danh sách mục tiêu
```
Query params:
- status: active|completed|failed|cancelled
- goalType: weight|bmi|bloodPressure|sleep|steps|exercise
```

#### POST `/goals` 🔒
Tạo mục tiêu mới
```json
{
  "title": "Giảm cân",
  "description": "Giảm 5kg trong 2 tháng",
  "goalType": "weight",
  "startValue": 75,
  "targetValue": 70,
  "unit": "kg",
  "targetDate": "2025-03-15"
}
```

#### PUT `/goals/:id` 🔒
Cập nhật mục tiêu

#### PUT `/goals/:id/progress` 🔒
Cập nhật tiến độ
```json
{
  "currentValue": 72.5
}
```

#### DELETE `/goals/:id` 🔒
Xóa mục tiêu

#### GET `/goals/stats` 🔒
Thống kê mục tiêu

### Nutrition Endpoints ⭐ MỚI

#### GET `/nutrition` 🔒
Lấy nhật ký dinh dưỡng
```
Query params:
- startDate: ISO date
- endDate: ISO date
- mealType: breakfast|lunch|dinner|snack
```

#### POST `/nutrition` 🔒
Tạo nhật ký bữa ăn
```json
{
  "date": "2025-11-17",
  "mealType": "breakfast",
  "foodItems": [
    {
      "name": "Cơm",
      "quantity": 100,
      "unit": "g",
      "calories": 130,
      "macros": {
        "protein": 2.7,
        "carbs": 28,
        "fats": 0.3,
        "fiber": 0.4
      }
    }
  ],
  "notes": "Ăn sáng nhẹ"
}
```

#### GET `/nutrition/daily/:date` 🔒
Tổng kết dinh dưỡng theo ngày

#### GET `/nutrition/stats` 🔒
Thống kê dinh dưỡng (weekly/monthly)

#### DELETE `/nutrition/:id` 🔒
Xóa nhật ký

### Mood Endpoints ⭐ MỚI

#### GET `/mood` 🔒
Lấy nhật ký tâm trạng
```
Query params:
- days: number (default: 30)
```

#### POST `/mood` 🔒
Tạo nhật ký tâm trạng
```json
{
  "mood": "good",
  "moodScore": 7,
  "energy": "high",
  "energyScore": 8,
  "stress": "low",
  "stressScore": 3,
  "anxiety": 2,
  "activities": ["work", "exercise"],
  "emotions": ["happy", "motivated"],
  "journal": "Ngày hôm nay rất tốt...",
  "gratitude": ["Sức khỏe", "Gia đình", "Công việc"],
  "sleepQuality": 8,
  "productivity": 7
}
```

#### GET `/mood/stats` 🔒
Thống kê xu hướng tâm trạng

#### DELETE `/mood/:id` 🔒
Xóa nhật ký

### Reminders Endpoints ⭐ MỚI

#### GET `/reminders` 🔒
Lấy danh sách nhắc nhở

#### POST `/reminders` 🔒
Tạo nhắc nhở mới
```json
{
  "title": "Uống thuốc",
  "description": "Uống thuốc huyết áp",
  "type": "medication",
  "time": "08:00",
  "frequency": "daily",
  "isActive": true
}
```

#### PATCH `/reminders/:id/toggle` 🔒
Bật/tắt nhắc nhở

#### GET `/reminders/upcoming` 🔒
Lấy nhắc nhở sắp tới

#### DELETE `/reminders/:id` 🔒
Xóa nhắc nhở

### Alerts Endpoints ⭐ MỚI

#### GET `/alerts` 🔒
Lấy danh sách cảnh báo
```
Query params:
- severity: low|medium|high|critical
- isRead: true|false
```

#### POST `/alerts/check-health` 🔒
Kiểm tra chỉ số và tạo alerts tự động

#### PATCH `/alerts/:id/read` 🔒
Đánh dấu đã đọc

#### PATCH `/alerts/:id/resolve` 🔒
Giải quyết cảnh báo

#### PATCH `/alerts/read-all` 🔒
Đánh dấu tất cả đã đọc

#### GET `/alerts/unread/count` 🔒
Số lượng cảnh báo chưa đọc

#### DELETE `/alerts/:id` 🔒
Xóa cảnh báo

### Articles Endpoints

#### GET `/articles`
Lấy danh sách bài viết (public)
```
Query params:
- category: Dinh dưỡng|Thể chất|Tinh thần|Chung
- page: number
- limit: number
```

#### GET `/articles/:id`
Lấy chi tiết bài viết

🔒 = Yêu cầu authentication

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

# Dừng containers
docker-compose down

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

## 📊 Screenshots

### 🏠 Dashboard
- Biểu đồ LineChart (cân nặng 30 ngày)
- Biểu đồ BarChart (giấc ngủ 7 ngày)
- Stats cards với metrics overview
- AI Recommendations
- **AlertBanner** với color-coded severity ⭐ MỚI
- **Top 3 Active Goals** với progress bars ⭐ MỚI

### 🎯 Goals Page ⭐ MỚI
- Danh sách mục tiêu với filter tabs (All/Active/Completed/Failed)
- Goal cards với progress bars
- Statistics cards (Total/Active/Completed/Failed)
- Modal form thêm/sửa mục tiêu
- Tự động tính toán tiến độ

### 🍎 Nutrition Page ⭐ MỚI
- Date picker để chọn ngày
- Meal type selector (Breakfast/Lunch/Dinner/Snack)
- Multiple food items per meal
- Pie chart phân bố macronutrients (Protein/Carbs/Fats)
- Weekly summary cards
- Tự động tính tổng calories và macros

### 😊 Mood Journal Page ⭐ MỚI
- Date picker
- 5-level mood selector với emojis (😢 😕 😐 🙂 😄)
- Sliders cho Energy, Stress, Anxiety (1-10)
- Emotion tags (multi-select pills)
- Activity tags (multi-select pills)
- Journal textarea
- Gratitude list (3 items)
- Line chart xu hướng tâm trạng 30 ngày
- Stats cards (Average mood, energy, stress, anxiety)

### 👤 Profile Page (Updated)
- **Tab 1: Thông tin cơ bản** - Name, DOB, Gender, Phone, Address
- **Tab 2: Thông tin y tế** ⭐ MỚI
  - Quản lý bệnh lý nền (add/edit/delete)
  - Quản lý dị ứng (add/edit/delete)
  - Quản lý thuốc đang dùng (add/edit/delete)
- **Tab 3: Liên hệ khẩn cấp** ⭐ MỚI
  - Emergency contact info
  - Doctor information

### 📝 Metrics Entry
- Form nhập liệu đa chỉ số
- Date picker
- Input validation

### 📚 Knowledge Base
- Danh sách bài viết
- Filter by category
- Article detail với HTML rendering

---

## 🔒 Security Features

1. **JWT Authentication**
   - HttpOnly Cookie (không thể truy cập từ JavaScript)
   - Secure flag (HTTPS only in production)
   - SameSite strict

2. **Password Security**
   - bcryptjs hashing (salt rounds: 10)
   - Password không bao giờ trả về trong response

3. **CORS Configuration**
   - Chỉ cho phép client URL cụ thể
   - Credentials: true (cho phép cookies)

4. **Input Validation**
   - Mongoose schema validation
   - Email format validation
   - Required fields checking

---

## 🤖 AI Recommendation Engine

Sử dụng **json-rules-engine** để tạo rule-based AI:

### Rules hiện tại:

1. **Sleep Insufficient** - Giấc ngủ < 7h/ngày
2. **Weight Loss Rapid** - Giảm cân > 2kg/tuần
3. **Exercise Insufficient** - Tập < 20 phút/ngày
4. **Calories Excessive** - Tiêu thụ > 2500 kcal/ngày
5. **Sleep Good** - Giấc ngủ 7-9h (positive feedback)

### Thêm rule mới:

Edit file `server/src/services/recommendationService.js`

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

## 📚 Documentation

### 📖 Tài Liệu Hướng Dẫn

- **[API Documentation](docs/API_DOCUMENTATION.md)** - Tài liệu API đầy đủ với examples
- **[User Guide](docs/USER_GUIDE.md)** - Hướng dẫn sử dụng chi tiết cho người dùng
- **[Installation Guide](setup/INSTALL.md)** - Hướng dẫn cài đặt và triển khai
- **[Features Status](FEATURES_IMPLEMENTATION_STATUS.md)** - Trạng thái triển khai tính năng

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

## 📝 License

MIT License - Free to use for personal and commercial projects.

---

## 👨‍💻 Author

Developed with ❤️ by **KhoaPhanix**

---

## 🙏 Acknowledgments

- **Recharts** - Beautiful charts library
- **MongoDB Atlas** - Cloud database
- **Tailwind CSS** - Utility-first CSS framework
- **json-rules-engine** - Rule-based decision engine

---

**Happy Coding! 🚀**
