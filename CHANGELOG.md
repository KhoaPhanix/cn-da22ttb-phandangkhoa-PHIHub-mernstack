# Changelog - PHIHub

> **Personal Health Intelligence Hub** - Lịch sử phát triển và cập nhật

---

## [1.4.0] - 25/12/2025 - Code cleanup và production ready 🧹✨

### 🔧 Cải tiến

#### Code Quality
- ✅ **Xóa debugging statements**
  - Xóa tất cả console.log trong production code (frontend)
  - Xóa tất cả console.error không cần thiết
  - Giữ lại console.log cho server startup và database connection
  - Code sạch hơn, production-ready

- ✅ **Dọn dẹp components**
  - Xóa DebugPanel.jsx không được sử dụng
  - Tối ưu cấu trúc components

- ✅ **Cải thiện error handling**
  - Silent fail cho các lỗi không nghiêm trọng
  - Giữ lại error messages cho user
  - Xóa error logging không cần thiết

### 📊 Files Updated
- **Client Pages**: MoodJournalPage, GoalsPage, NutritionPage, DashboardPage, HistoryPage, KnowledgePage, ProfilePage, ArticleDetailPage
- **Client Components**: AlertBanner, AuthContext
- **Server Controllers**: moodController, nutritionController, goalController
- **Server Services**: recommendationService

### ✅ Kết quả
- ✅ Không còn lỗi compile/lint
- ✅ Code production-ready
- ✅ Performance được cải thiện
- ✅ Debugging statements đã được loại bỏ

---

## [1.3.0] - 20/12/2025 - Cập nhật UI và tối ưu hóa 🎨

### ✨ Tính năng mới

#### Cập nhật giao diện
- ✅ **Logo và favicon mới**
  - Thay thế Vite icon mặc định bằng logo PHIHub
  - SVG logo với gradient xanh lá và xanh dương
  - Tích hợp biểu tượng y tế và đường nhịp tim
  - Hỗ trợ đa nền tảng (web, mobile)

#### Tối ưu văn bản
- ✅ **Chuẩn hóa tiếng Việt**
  - Sửa tất cả lỗi viết hoa không đúng quy tắc
  - Chỉ viết hoa chữ cái đầu câu/tiêu đề
  - Cập nhật xuyên suốt tất cả file .md và .jsx
  
### 🗑️ Dọn dẹp
- ✅ Xóa file không cần thiết
  - PROJECT_SUMMARY.md (đã lỗi thời)
  - SECURITY_FIX.md (đã xử lý)
  - test-api-data.js, test-db-data.js (file test cũ)
  - import-december-data.js (script một lần)

---

## [1.2.0] - 30/11/2025 - Documentation & code cleanup 📚✨

### ✨ Tính năng mới

#### Documentation hoàn chỉnh
- ✅ **API Documentation** (`docs/API_DOCUMENTATION.md`)
  - Tài liệu đầy đủ 60+ API endpoints
  - Request/Response examples chi tiết
  - Authentication flow
  - Error handling guide
  - Query parameters và special cases
  
- ✅ **User Guide** (`docs/USER_GUIDE.md`)
  - Hướng dẫn sử dụng từng tính năng (13 sections)
  - Tips & best practices
  - FAQ và troubleshooting
  - Screenshots placeholders
  - Keyboard shortcuts

- ✅ **Guide for Board** (`docs/GUIDE_FOR_BOARD.md`)
  - Tài liệu tóm tắt cho hội đồng
  - Hướng dẫn demo nhanh
  - Thông tin liên hệ đầy đủ

#### UI components
- ✅ **Footer Component** (`src/client/src/components/Footer.jsx`)
  - 4-column layout responsive
  - Quick links, support, contact sections
  - Social media integration
  - Dark theme matching
  - Tích hợp vào 6 pages chính

### 🔧 Cải tiến

#### Code organization
- ✅ Dọn dẹp 18+ files cũ/thừa
- ✅ Tổ chức lại documentation structure
- ✅ Consolidate duplicate guides
- ✅ Cập nhật README với proper links

#### Cấu trúc thư mục mới
```
PHIHub/
├── README.md (updated)
├── CHANGELOG.md (rewritten)
├── FEATURES_IMPLEMENTATION_STATUS.md
├── docs/                           ⭐ MỚI
│   ├── API_DOCUMENTATION.md
│   ├── USER_GUIDE.md
│   └── GUIDE_FOR_BOARD.md
├── setup/
│   └── INSTALL.md
├── src/
│   ├── client/
│   │   └── src/
│   │       ├── components/
│   │       │   └── Footer.jsx      ⭐ MỚI
│   │       └── pages/ (updated with Footer)
│   └── server/
└── [other directories]
```

### 🗑️ Files Removed (18 files)

**Debug/Fix files (không còn cần):**
- API_TESTING.md
- BUGFIX_20241117.md
- BUGFIX_20241117_v2.md
- ERROR_500_FIX.md
- FIX_REPORT_DATA_DISPLAY.md
- LOGIN_DEBUG_GUIDE.md
- SYSTEM_CHECK_REPORT.md
- TEST_REPORT.md
- UNIT_TRANSLATION_REPORT.md

**Duplicate/Outdated guides:**
- CHARTS_UPDATE.md → Tích hợp vào code
- DEPLOYMENT_GUIDE.md → setup/INSTALL.md
- FEATURES.md → FEATURES_IMPLEMENTATION_STATUS.md
- HEALTH_METRICS_GUIDE.md → docs/USER_GUIDE.md
- IMPLEMENTATION_SUMMARY.md → FEATURES_IMPLEMENTATION_STATUS.md
- PROFILE_PAGE_GUIDE.md → docs/USER_GUIDE.md
- PROJECT_STRUCTURE.md → README.md
- QUICKSTART.md → README.md + setup/INSTALL.md
- QUICK_REFERENCE.md → docs/API_DOCUMENTATION.md

### 📊 Thống kê

**Before cleanup:**
- 28+ markdown files ở root
- Documentation phân tán
- Nhiều file trùng lặp

**After cleanup:**
- 3 markdown files chính ở root
- Documentation tập trung trong `docs/`
- Clear structure, easy to navigate

### 🎯 Pages với Footer

1. DashboardPage
2. GoalsPage
3. NutritionPage
4. MoodJournalPage
5. ProfilePage
6. KnowledgePage

---

## [1.1.0] - 17/11/2025 - Feature Complete 🎉

### 📂 Sắp xếp lại cấu trúc thư mục

#### Đã thực hiện:
- ✅ Di chuyển `Tuần 1` → `progress-report/Tuần 1`
- ✅ Tạo `progress-report/weekly-reports/`
- ✅ Di chuyển tài liệu tham khảo → `thesis/refs/`
- ✅ Cấu trúc tuân thủ quy định đồ án

### 📋 Cập nhật README.md

#### Đã thêm:
- ✅ Thông tin liên hệ đầy đủ
- ✅ Họ tên, MSSV, Email, SĐT
- ✅ Thông tin GVHD
- ✅ Trường/Khoa/Năm học
- ✅ Link repository & demo

### 🏥 Mở rộng chỉ số sức khỏe

#### Backend - HealthMetric Model
Thêm 6 metricType mới:
- ✅ `height` - Chiều cao (cm)
- ✅ `bmi` - BMI (kg/m²)
- ✅ `bloodPressure` - Huyết áp (mmHg)
- ✅ `sleepQuality` - Chất lượng giấc ngủ (1-10)
- ✅ `water` - Lượng nước uống (ml)
- ✅ `bloodSugar` - Đường huyết (mg/dL)

**Metadata structure:**
```javascript
metadata: {
  type: Map,
  of: mongoose.Schema.Types.Mixed,
  // bloodPressure: { systolic: 120, diastolic: 80 }
  // sleepQuality: { deep: 3.5, light: 4.5, rem: 1.5 }
}
```

#### Frontend - MetricsEntryPage
Form inputs mới:
- ✅ Chiều cao
- ✅ Huyết áp tâm thu/tâm trương
- ✅ Nhịp tim
- ✅ Số bước chân
- ✅ Chất lượng giấc ngủ
- ✅ Lượng nước uống
- 🤖 Tự động tính BMI

#### Frontend - DashboardPage
5 cards mới:
1. ✅ BMI (với status: Bình thường/Cần chú ý)
2. ✅ Huyết áp (với thresholds)
3. ✅ Nhịp tim (60-100 bpm normal)
4. ✅ Số bước (8,000+ target)
5. ✅ Nước uống (2L+ target)

**Tổng cộng:** 8 cards (từ 4 ban đầu)

### 🤖 AI Recommendation Engine

Thêm 7 rules mới:
1. **Rule 9**: BMI Underweight (< 18.5)
2. **Rule 10**: BMI Overweight (> 24.9)
3. **Rule 11**: BMI Normal (18.5-24.9) ✨
4. **Rule 12**: Blood Pressure High (> 130/80)
5. **Rule 13**: Blood Pressure Low (< 90/60)
6. **Rule 14**: Water Insufficient (< 2000ml)
7. **Rule 15**: Water Sufficient (≥ 2000ml) ✨

**Facts calculation:**
- `averageBloodPressure` (từ systolic)
- `averageWater` (ml/ngày)
- `latestBMI`

### 📊 Sample Data

**File:** `setup/sample-data/add-metrics.js`

Dữ liệu 30 ngày với ~11 metrics/day:
- ✅ Weight & Height → Auto BMI
- ✅ Blood Pressure (110-130 / 70-85)
- ✅ Heart Rate (60-100 bpm)
- ✅ Sleep + Quality (6-9h, 5-10)
- ✅ Steps (5000-12000)
- ✅ Exercise (0-60 min)
- ✅ Calories (1800-2500)
- ✅ Water (1500-3000 ml)

**Total:** ~330 records/user

---

## [1.0.0] - 10/11/2025 - Initial Release 🚀

### ✨ Core Features

#### Authentication
- ✅ Register với validation
- ✅ Login với JWT (HttpOnly Cookie)
- ✅ Logout
- ✅ Protected routes

#### Dashboard
- ✅ 4 Stats cards
- ✅ LineChart (weight 30 days)
- ✅ BarChart (sleep 7 days)
- ✅ AI Recommendations (8 rules)

#### Metrics Entry
- ✅ Form nhập 4 loại chỉ số
- ✅ Date/time picker
- ✅ Notes field

#### History
- ✅ Date range filter
- ✅ Metric type filter
- ✅ Chart/Table view toggle
- ✅ Export CSV

#### Knowledge Base
- ✅ Search articles
- ✅ Category filter
- ✅ Pagination
- ✅ Article detail view

#### Profile
- ✅ Basic info
- ✅ Avatar upload
- ✅ Update profile

### 🛠 Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Recharts
- React Router DOM 6
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- json-rules-engine

**DevOps:**
- Docker + Docker Compose
- Nginx

### 📦 Database Schema

**Collections:**
- users
- health_metrics
- articles

---

## 🎯 Roadmap

### Version 1.3.0 (Future)
- [ ] Push Notifications
- [ ] Email Notifications
- [ ] RemindersPage riêng
- [ ] Food Database integration
- [ ] Gamification system
- [ ] Unit/Integration tests
- [ ] Medical documents upload
- [ ] Multi-language support

---

**Maintained by:** PHIHub Development Team  
**Last Updated:** November 30, 2025

