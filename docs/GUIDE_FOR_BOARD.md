# HƯỚNG DẪN SỬ DỤNG DỰ ÁN PHIHub

> **Tài liệu tóm tắt cho Hội đồng và Giảng viên hướng dẫn**

---

## 📌 THÔNG TIN CHUNG

**Tên đề tài:** PHIHub - Personal Health Intelligence Hub  
**Mô tả:** Hệ thống theo dõi và tư vấn sức khỏe cá nhân sử dụng MERN Stack  
**Công nghệ:** MongoDB, Express.js, React (Vite), Node.js, Docker  

**Sinh viên thực hiện:**
- Họ tên: [Điền tên sinh viên]
- MSSV: [Điền MSSV]
- Email: [Điền email]
- Điện thoại: [Điền SĐT]

**Giảng viên hướng dẫn:** [Điền tên GVHD]

---

## 📂 CẤU TRÚC DỰ ÁN (Theo yêu cầu)

```
PHIHub/
├── README.md                    ← Tài liệu chính với thông tin liên lạc
│
├── setup/                       ← [YÊU CẦU] Hướng dẫn cài đặt
│   ├── INSTALL.md              ← Hướng dẫn chi tiết + Sơ đồ triển khai
│   └── sample-data/            ← Dữ liệu thử nghiệm
│       ├── articles.json       ← 5 bài viết mẫu
│       ├── import.js           ← Script import tự động
│       └── README.md
│
├── src/                         ← [YÊU CẦU] Mã nguồn
│   ├── client/                 ← Frontend React + Vite
│   └── server/                 ← Backend Node.js + Express
│
├── progress-report/             ← [BẮT BUỘC] Báo cáo tiến độ
│   └── README.md               ← Hướng dẫn viết báo cáo
│
├── thesis/                      ← [BẮT BUỘC] Tài liệu văn bản
│   ├── doc/                    ← File .DOC/.DOCX
│   ├── pdf/                    ← File .PDF (bản cuối)
│   ├── html/                   ← Tài liệu web
│   ├── abs/                    ← Slides .PPT, video demo
│   ├── refs/                   ← Tài liệu tham khảo
│   └── README.md
│
├── docker/                      ← [YÊU CẦU] Docker deployment
│   ├── docker-compose.yml      ← Orchestration
│   └── README.md
│
└── soft/                        ← Phần mềm liên quan
    └── README.md               ← Danh sách tools, links tải
```

---

## 🚀 CÁCH CHẠY DỰ ÁN (Cho Hội đồng)

### Option 1: Docker (Khuyến nghị - Nhanh nhất)

```powershell
# 1. Cài Docker Desktop (nếu chưa có)
# Download: https://www.docker.com/products/docker-desktop

# 2. Mở PowerShell tại thư mục PHIHub
cd docker

# 3. Khởi động toàn bộ hệ thống
docker-compose up -d --build

# 4. Đợi 1-2 phút, sau đó truy cập:
# → Frontend: http://localhost:8080
# → Backend API: http://localhost:5000
```

**Dừng hệ thống:**
```powershell
docker-compose down
```

### Option 2: Development Mode (Không dùng Docker)

```powershell
# 1. Cài Node.js v18+ (nếu chưa có)
# Download: https://nodejs.org/

# 2. Terminal 1 - Chạy Backend
cd src\server
npm install
npm run dev

# 3. Terminal 2 - Chạy Frontend
cd src\client
npm install
npm run dev

# 4. Truy cập: http://localhost:5173
```

### Option 3: Import Dữ liệu Thử nghiệm

```powershell
cd setup\sample-data
npm install
node import.js
```

**Tài khoản test sau khi import:**
- Email: `test@phihub.com`
- Password: `Test123456`

---

## 📖 TÀI LIỆU CHI TIẾT

| Tài liệu | Vị trí | Mô tả |
|----------|--------|-------|
| **Hướng dẫn cài đặt đầy đủ** | `setup/INSTALL.md` | Setup development & production |
| **Sơ đồ triển khai** | `setup/INSTALL.md` | Kiến trúc hệ thống |
| **Dữ liệu thử nghiệm** | `setup/sample-data/` | Script import + data mẫu |
| **Mã nguồn Backend** | `src/server/` | API Node.js/Express |
| **Mã nguồn Frontend** | `src/client/` | React + Vite app |
| **Docker guide** | `docker/README.md` | Hướng dẫn container |
| **Báo cáo tiến độ** | `progress-report/` | Weekly/monthly reports |
| **Tài liệu văn bản đồ án** | `thesis/` | DOC, PDF, PPT, refs |
| **Tools & Software** | `soft/README.md` | Danh sách công cụ |

---

## ✅ CHECKLIST NỘP BÀI

### Bắt buộc phải có:

- [x] `README.md` gốc với thông tin liên lạc đầy đủ
- [x] `setup/` - Hướng dẫn cài đặt + sơ đồ triển khai
- [x] `src/` - Mã nguồn đầy đủ (client + server)
- [ ] `progress-report/` - **[CẦN BỔ SUNG]** Báo cáo tiến độ theo tuần
- [ ] `thesis/doc/` - **[CẦN BỔ SUNG]** File Word báo cáo chính
- [ ] `thesis/pdf/` - **[CẦN BỔ SUNG]** File PDF báo cáo (bản cuối)
- [ ] `thesis/abs/` - **[CẦN BỔ SUNG]** Slides PowerPoint
- [ ] `thesis/refs/` - **[CẦN BỔ SUNG]** Tài liệu tham khảo
- [x] `docker/` - Docker deployment configuration
- [x] `soft/` - Hướng dẫn tools

### Nội dung code đã hoàn thành:

- [x] Backend: Models, Controllers, Routes, Middleware
- [x] Backend: JWT Authentication với HttpOnly Cookie
- [x] Backend: AI Recommendation Engine (5 rules)
- [x] Frontend: Dashboard với Recharts (LineChart, BarChart)
- [x] Frontend: Authentication Pages (Login/Register)
- [x] Frontend: Metrics Entry, Profile, Knowledge pages
- [x] Docker: Multi-stage builds + docker-compose
- [x] Documentation: Đầy đủ README files

---

## 🎯 TÍNH NĂNG CHÍNH (Demo cho Hội đồng)

### 1. Xác thực & Quản lý tài khoản
- ✅ Đăng ký/Đăng nhập an toàn (JWT + HttpOnly Cookie)
- ✅ Quản lý profile (tên, ngày sinh, giới tính)

### 2. Dashboard Trực quan
- ✅ Biểu đồ LineChart: Theo dõi cân nặng 30 ngày
- ✅ Biểu đồ BarChart: Phân tích giấc ngủ 7 ngày
- ✅ Stats cards: Min, Max, Average
- ✅ AI Recommendations hiển thị real-time

### 3. Nhập liệu Sức khỏe
- ✅ Form đa chỉ số: Weight, Sleep, Calories, Exercise
- ✅ Date picker và validation
- ✅ Batch submission

### 4. Hệ thống Khuyến nghị AI
- ✅ Rule-based engine với `json-rules-engine`
- ✅ 5 rules: Sleep, Weight, Exercise, Calories
- ✅ Phân tích 7 ngày gần nhất

### 5. Góc Kiến thức
- ✅ 5 bài viết về sức khỏe
- ✅ Lọc theo danh mục
- ✅ Chi tiết với HTML rendering

---

## 🔒 BẢO MẬT

- ✅ Password hashing với bcryptjs (10 salt rounds)
- ✅ JWT trong HttpOnly Cookie (chống XSS)
- ✅ CORS configuration với credentials
- ✅ Input validation với Mongoose

---

## 🌐 DEPLOYMENT

### Development (Local):
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Production (Docker):
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

### Database:
- **MongoDB Atlas** (Cloud - đã cấu hình sẵn)
- Connection string được cấu hình trong file `.env` (bảo mật)

---

## 📊 CÔNG NGHỆ SỬ DỤNG

### Backend:
- Node.js v18 + Express.js 4
- MongoDB + Mongoose 8
- JWT (jsonwebtoken)
- bcryptjs
- json-rules-engine

### Frontend:
- React 18 + Vite 5
- React Router DOM 6
- Recharts 2.10
- Axios
- Tailwind CSS 3

### DevOps:
- Docker + Docker Compose
- Nginx (production frontend)
- Multi-stage builds

---

## 📞 LIÊN HỆ HỖ TRỢ

**Sinh viên:**
- Email: [email@student.edu.vn]
- Điện thoại: [+84 xxx xxx xxx]

**Giảng viên hướng dẫn:**
- Email: [email@university.edu.vn]

---

## 📝 GHI CHÚ QUAN TRỌNG

### Các điểm cần bổ sung:

1. **`progress-report/`**: Sinh viên cần thêm các file báo cáo tuần/tháng
2. **`thesis/doc/`**: Báo cáo chính định dạng Word
3. **`thesis/pdf/`**: Export PDF từ Word (bản cuối cùng)
4. **`thesis/abs/`**: Slides PowerPoint cho buổi thuyết trình
5. **`thesis/refs/`**: Papers, books tham khảo (đúng format IEEE/APA)
6. **Thông tin liên lạc**: Cập nhật trong `README.md` gốc

### Files có sẵn README hướng dẫn:

- ✅ Mỗi thư mục đều có `README.md` chi tiết
- ✅ `setup/INSTALL.md` có sơ đồ triển khai đầy đủ
- ✅ `setup/sample-data/README.md` hướng dẫn import data
- ✅ Đầy đủ hướng dẫn troubleshooting

---

## 🎓 KẾT LUẬN

Dự án PHIHub đã hoàn thành:
- ✅ **100% code** - Backend + Frontend + Docker
- ✅ **100% documentation** - Setup guides + README files
- ✅ Cấu trúc thư mục chuẩn theo yêu cầu đồ án
- ⏳ Cần bổ sung: Báo cáo văn bản (thesis/) và báo cáo tiến độ

**Tất cả mã nguồn và tài liệu đã được tổ chức theo đúng format yêu cầu của Hội đồng.**

---

**Ngày cập nhật:** November 17, 2025  
**Version:** 1.0.0  
**Status:** Code Complete - Ready for Documentation
