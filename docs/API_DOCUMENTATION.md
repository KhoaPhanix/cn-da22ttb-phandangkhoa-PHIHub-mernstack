# PHIHub API Documentation

> **Version:** 1.0.0  
> **Base URL:** `http://localhost:5000/api`  
> **Authentication:** JWT (HttpOnly Cookie)

---

## 📑 Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Health Metrics](#health-metrics)
- [Goals](#goals)
- [Nutrition](#nutrition)
- [Mood Journal](#mood-journal)
- [Reminders](#reminders)
- [Alerts](#alerts)
- [Articles](#articles)
- [Recommendations](#recommendations)
- [Error Handling](#error-handling)

---

## 🔐 Authentication

### Register
**POST** `/auth/register`

Đăng ký tài khoản người dùng mới.

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "dob": "1990-01-01",
  "gender": "male"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "_id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com"
  }
}
```

---

### Login
**POST** `/auth/login`

Đăng nhập và nhận JWT token (HttpOnly Cookie).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "user": {
    "_id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com"
  }
}
```

**Cookie Set:**
```
token=<jwt_token>; HttpOnly; Secure; SameSite=Strict
```

---

### Logout
**POST** `/auth/logout` 🔒

Đăng xuất và xóa JWT cookie.

**Response (200):**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

### Get Current User
**GET** `/auth/me` 🔒

Lấy thông tin user đang đăng nhập.

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "dob": "1990-01-01",
    "gender": "male",
    "avatar": "https://..."
  }
}
```

---

## 👤 Users

### Get User Profile
**GET** `/users/me` 🔒

Lấy thông tin profile đầy đủ.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "dob": "1990-01-01",
    "gender": "male",
    "phone": "0987654321",
    "address": "123 Nguyễn Huệ",
    "avatar": "https://...",
    "medicalInfo": {
      "chronicConditions": [...],
      "allergies": [...],
      "medications": [...],
      "emergencyContact": {...},
      "doctor": {...}
    }
  }
}
```

---

### Update Profile
**PUT** `/users/me` 🔒

Cập nhật thông tin profile.

**Request Body:**
```json
{
  "name": "Nguyễn Văn B",
  "phone": "0987654321",
  "address": "123 Nguyễn Huệ",
  "medicalInfo": {
    "chronicConditions": [
      {
        "name": "Tiểu đường type 2",
        "diagnosedDate": "2020-01-15",
        "severity": "moderate",
        "notes": "Đang điều trị"
      }
    ],
    "allergies": [
      {
        "allergen": "Penicillin",
        "reaction": "Phát ban",
        "severity": "severe"
      }
    ],
    "medications": [
      {
        "name": "Metformin",
        "dosage": "500mg",
        "frequency": "2 lần/ngày",
        "startDate": "2020-02-01",
        "purpose": "Kiểm soát đường huyết"
      }
    ],
    "emergencyContact": {
      "name": "Trần Thị B",
      "relationship": "Vợ",
      "phone": "0912345678"
    },
    "doctor": {
      "name": "BS. Lê Văn C",
      "specialty": "Nội tiết",
      "phone": "0923456789",
      "hospital": "Bệnh viện ABC"
    }
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật thành công",
  "data": {...}
}
```

---

### Upload Avatar
**POST** `/users/me/avatar` 🔒

Upload ảnh đại diện.

**Request:** `multipart/form-data`
```
avatar: <file>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Upload thành công",
  "avatar": "http://localhost:5000/uploads/avatars/..."
}
```

---

## 📊 Health Metrics

### Get Metrics
**GET** `/metrics` 🔒

Lấy danh sách metrics với filters.

**Query Parameters:**
- `metricType` (optional): `weight|sleep|calories|exercise|bmi|bloodPressure|heartRate|steps|water`
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `limit` (optional): Number (default: 100)

**Example:**
```
GET /metrics?metricType=weight&startDate=2025-01-01&limit=30
```

**Response (200):**
```json
{
  "success": true,
  "count": 30,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "metricType": "weight",
      "value": 70.5,
      "unit": "kg",
      "timestamp": "2025-01-15T10:00:00Z",
      "notes": "Sau bữa sáng",
      "metadata": {}
    }
  ]
}
```

---

### Create Metric
**POST** `/metrics` 🔒

Tạo metric mới.

**Request Body:**
```json
{
  "metricType": "weight",
  "value": 70.5,
  "unit": "kg",
  "timestamp": "2025-01-15T10:00:00Z",
  "notes": "Sau bữa sáng"
}
```

**Special Cases:**

**Blood Pressure:**
```json
{
  "metricType": "bloodPressure",
  "value": 120,
  "unit": "mmHg",
  "metadata": {
    "systolic": 120,
    "diastolic": 80
  }
}
```

**BMI (Auto-calculated):**
```json
{
  "metricType": "bmi",
  "value": 24.5,
  "unit": "kg/m²",
  "metadata": {
    "weight": 70,
    "height": 170
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tạo metric thành công",
  "data": {...}
}
```

---

### Get Metric Statistics
**GET** `/metrics/stats` 🔒

Thống kê metrics theo loại.

**Query Parameters:**
- `metricType` (required): metric type
- `days` (optional): Number (default: 7)

**Example:**
```
GET /metrics/stats?metricType=weight&days=30
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "metricType": "weight",
    "count": 30,
    "average": 71.2,
    "min": 69.5,
    "max": 73.0,
    "latest": 71.5,
    "change": -1.5,
    "changePercentage": -2.06
  }
}
```

---

### Delete Metric
**DELETE** `/metrics/:id` 🔒

Xóa metric.

**Response (200):**
```json
{
  "success": true,
  "message": "Xóa metric thành công"
}
```

---

## 🎯 Goals

### Get Goals
**GET** `/goals` 🔒

Lấy danh sách mục tiêu.

**Query Parameters:**
- `status` (optional): `active|completed|failed|cancelled`
- `goalType` (optional): `weight|bmi|bloodPressure|sleep|steps|exercise|calories|water|custom`

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "title": "Giảm 5kg",
      "description": "Giảm cân xuống 70kg",
      "goalType": "weight",
      "startValue": 75,
      "targetValue": 70,
      "currentValue": 72,
      "unit": "kg",
      "startDate": "2025-01-01",
      "targetDate": "2025-03-01",
      "status": "active",
      "progress": 60,
      "milestones": [...]
    }
  ]
}
```

---

### Create Goal
**POST** `/goals` 🔒

Tạo mục tiêu mới.

**Request Body:**
```json
{
  "title": "Giảm 5kg",
  "description": "Giảm cân xuống 70kg trong 2 tháng",
  "goalType": "weight",
  "startValue": 75,
  "targetValue": 70,
  "unit": "kg",
  "targetDate": "2025-03-01",
  "milestones": [
    { "value": 73, "date": "2025-01-15" },
    { "value": 71, "date": "2025-02-15" }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tạo mục tiêu thành công",
  "data": {...}
}
```

---

### Update Goal
**PUT** `/goals/:id` 🔒

Cập nhật mục tiêu.

**Request Body:** (partial update)
```json
{
  "title": "Giảm 6kg",
  "targetValue": 69
}
```

---

### Update Goal Progress
**PUT** `/goals/:id/progress` 🔒

Cập nhật tiến độ mục tiêu.

**Request Body:**
```json
{
  "currentValue": 72.5
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật tiến độ thành công",
  "data": {
    "progress": 50,
    "currentValue": 72.5
  }
}
```

---

### Get Goal Statistics
**GET** `/goals/stats` 🔒

Thống kê mục tiêu.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "active": 5,
    "completed": 3,
    "failed": 2,
    "averageProgress": 65
  }
}
```

---

### Delete Goal
**DELETE** `/goals/:id` 🔒

Xóa mục tiêu.

---

## 🍎 Nutrition

### Get Nutrition Logs
**GET** `/nutrition` 🔒

Lấy nhật ký dinh dưỡng.

**Query Parameters:**
- `startDate` (optional): ISO date
- `endDate` (optional): ISO date
- `mealType` (optional): `breakfast|lunch|dinner|snack`

**Response (200):**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "date": "2025-01-15",
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
      "totalCalories": 130,
      "totalMacros": {...},
      "notes": "Ăn sáng nhẹ"
    }
  ]
}
```

---

### Create Nutrition Log
**POST** `/nutrition` 🔒

Tạo nhật ký bữa ăn.

**Request Body:**
```json
{
  "date": "2025-01-15",
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
    },
    {
      "name": "Trứng",
      "quantity": 1,
      "unit": "quả",
      "calories": 70,
      "macros": {
        "protein": 6,
        "carbs": 0.6,
        "fats": 5,
        "fiber": 0
      }
    }
  ],
  "notes": "Ăn sáng đầy đủ"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tạo nhật ký thành công",
  "data": {
    "totalCalories": 200,
    "totalMacros": {
      "protein": 8.7,
      "carbs": 28.6,
      "fats": 5.3,
      "fiber": 0.4
    }
  }
}
```

---

### Get Daily Nutrition Summary
**GET** `/nutrition/daily/:date` 🔒

Tổng kết dinh dưỡng theo ngày.

**Example:**
```
GET /nutrition/daily/2025-01-15
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-15",
    "meals": {
      "breakfast": {...},
      "lunch": {...},
      "dinner": {...},
      "snack": {...}
    },
    "totalCalories": 2000,
    "totalMacros": {
      "protein": 80,
      "carbs": 250,
      "fats": 60,
      "fiber": 25
    }
  }
}
```

---

### Get Nutrition Statistics
**GET** `/nutrition/stats` 🔒

Thống kê dinh dưỡng.

**Query Parameters:**
- `days` (optional): Number (default: 7)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "7 days",
    "averageCalories": 2000,
    "averageMacros": {
      "protein": 80,
      "carbs": 250,
      "fats": 60
    },
    "mealDistribution": {
      "breakfast": 25,
      "lunch": 35,
      "dinner": 30,
      "snack": 10
    }
  }
}
```

---

### Delete Nutrition Log
**DELETE** `/nutrition/:id` 🔒

Xóa nhật ký dinh dưỡng.

---

## 😊 Mood Journal

### Get Mood Logs
**GET** `/mood` 🔒

Lấy nhật ký tâm trạng.

**Query Parameters:**
- `days` (optional): Number (default: 30)

**Response (200):**
```json
{
  "success": true,
  "count": 30,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "date": "2025-01-15",
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
  ]
}
```

---

### Create Mood Log
**POST** `/mood` 🔒

Tạo nhật ký tâm trạng.

**Request Body:**
```json
{
  "date": "2025-01-15",
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

---

### Get Mood Statistics
**GET** `/mood/stats` 🔒

Thống kê xu hướng tâm trạng.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "30 days",
    "averageMoodScore": 7,
    "averageEnergyScore": 7.5,
    "averageStressScore": 4,
    "averageAnxiety": 3,
    "moodDistribution": {
      "excellent": 10,
      "good": 15,
      "okay": 4,
      "bad": 1,
      "terrible": 0
    },
    "topEmotions": ["happy", "motivated", "grateful"],
    "topActivities": ["work", "exercise", "family"]
  }
}
```

---

### Delete Mood Log
**DELETE** `/mood/:id` 🔒

Xóa nhật ký tâm trạng.

---

## ⏰ Reminders

### Get Reminders
**GET** `/reminders` 🔒

Lấy danh sách nhắc nhở.

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "title": "Uống thuốc",
      "message": "Uống thuốc huyết áp",
      "type": "medication",
      "time": "08:00",
      "frequency": "daily",
      "daysOfWeek": [],
      "enabled": true,
      "lastTriggered": null,
      "nextScheduled": "2025-01-16T08:00:00Z"
    }
  ]
}
```

---

### Create Reminder
**POST** `/reminders` 🔒

Tạo nhắc nhở mới.

**Request Body:**
```json
{
  "title": "Uống thuốc",
  "message": "Uống thuốc huyết áp",
  "type": "medication",
  "time": "08:00",
  "frequency": "daily",
  "enabled": true
}
```

**Frequency Types:**
- `once` - Một lần
- `daily` - Hàng ngày
- `weekly` - Hàng tuần (cần `daysOfWeek`)
- `monthly` - Hàng tháng
- `custom` - Tùy chỉnh (cần `customDays`)

**Weekly Example:**
```json
{
  "frequency": "weekly",
  "daysOfWeek": ["monday", "wednesday", "friday"]
}
```

---

### Toggle Reminder
**PATCH** `/reminders/:id/toggle` 🔒

Bật/tắt nhắc nhở.

**Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật thành công",
  "enabled": true
}
```

---

### Get Upcoming Reminders
**GET** `/reminders/upcoming` 🔒

Lấy nhắc nhở sắp tới.

**Query Parameters:**
- `hours` (optional): Number (default: 24)

---

### Delete Reminder
**DELETE** `/reminders/:id` 🔒

Xóa nhắc nhở.

---

## 🚨 Alerts

### Get Alerts
**GET** `/alerts` 🔒

Lấy danh sách cảnh báo.

**Query Parameters:**
- `severity` (optional): `low|medium|high|critical`
- `isRead` (optional): `true|false`
- `category` (optional): `weight|bloodPressure|heartRate|sleep|exercise|nutrition`

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "title": "Huyết áp cao",
      "message": "Huyết áp của bạn đang ở mức cao (140/90)",
      "severity": "high",
      "category": "bloodPressure",
      "relatedMetric": "...",
      "isRead": false,
      "isResolved": false,
      "createdAt": "2025-01-15T10:00:00Z",
      "expiresAt": "2025-01-22T10:00:00Z"
    }
  ]
}
```

---

### Check Health & Generate Alerts
**POST** `/alerts/check-health` 🔒

Kiểm tra chỉ số sức khỏe và tạo alerts tự động.

**Response (200):**
```json
{
  "success": true,
  "message": "Kiểm tra hoàn tất",
  "alertsCreated": 2,
  "alerts": [...]
}
```

---

### Mark Alert as Read
**PATCH** `/alerts/:id/read` 🔒

Đánh dấu đã đọc.

---

### Resolve Alert
**PATCH** `/alerts/:id/resolve` 🔒

Giải quyết cảnh báo.

---

### Mark All as Read
**PATCH** `/alerts/read-all` 🔒

Đánh dấu tất cả đã đọc.

---

### Get Unread Count
**GET** `/alerts/unread/count` 🔒

Số lượng cảnh báo chưa đọc.

**Response (200):**
```json
{
  "success": true,
  "count": 3
}
```

---

### Delete Alert
**DELETE** `/alerts/:id` 🔒

Xóa cảnh báo.

---

## 📚 Articles

### Get Articles
**GET** `/articles`

Lấy danh sách bài viết (public).

**Query Parameters:**
- `category` (optional): `Dinh dưỡng|Thể chất|Tinh thần|Chung`
- `search` (optional): Search query
- `page` (optional): Number (default: 1)
- `limit` (optional): Number (default: 10)

**Response (200):**
```json
{
  "success": true,
  "count": 25,
  "page": 1,
  "totalPages": 3,
  "data": [
    {
      "_id": "...",
      "title": "10 Thực phẩm tốt cho tim mạch",
      "content": "<p>...</p>",
      "excerpt": "Khám phá...",
      "category": "Dinh dưỡng",
      "imageUrl": "https://...",
      "views": 150,
      "publishedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Article by ID
**GET** `/articles/:id`

Lấy chi tiết bài viết.

---

## 🤖 Recommendations

### Get Health Recommendations
**GET** `/recommendations` 🔒

Lấy khuyến nghị sức khỏe dựa trên AI Rule Engine.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "sleep_insufficient",
      "message": "Giấc ngủ của bạn trung bình chỉ 6.2 giờ/đêm. Khuyến nghị ngủ 7-9 giờ/đêm.",
      "priority": "high",
      "category": "sleep",
      "actionItems": [
        "Đi ngủ trước 11 giờ tối",
        "Tránh caffeine sau 4 giờ chiều",
        "Tạo môi trường ngủ tối và yên tĩnh"
      ]
    }
  ]
}
```

---

## ❌ Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (only in development)"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Thành công |
| 201 | Created - Tạo thành công |
| 400 | Bad Request - Dữ liệu không hợp lệ |
| 401 | Unauthorized - Chưa xác thực |
| 403 | Forbidden - Không có quyền |
| 404 | Not Found - Không tìm thấy |
| 500 | Internal Server Error - Lỗi server |

### Common Error Messages

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Không có token, truy cập bị từ chối"
}
```

**400 Validation Error:**
```json
{
  "success": false,
  "message": "Vui lòng điền đầy đủ thông tin"
}
```

---

## 🔧 Authentication Flow

1. **Register/Login** → Receive JWT in HttpOnly Cookie
2. **Make API Requests** → Cookie automatically sent with each request
3. **Token Validation** → Middleware validates JWT
4. **Access Protected Routes** → If valid, proceed
5. **Logout** → Cookie cleared

---

## 📝 Notes

- 🔒 = Requires Authentication (JWT Cookie)
- All dates use ISO 8601 format
- All timestamps in UTC
- Response pagination uses `page` and `limit` params
- File uploads use `multipart/form-data`
- Max file size for avatars: 5MB

---

**Last Updated:** November 30, 2025  
**Maintained by:** PHIHub Development Team
