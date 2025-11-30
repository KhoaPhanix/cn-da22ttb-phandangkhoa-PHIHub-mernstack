# Software & Tools - PHIHub

> Thư mục chứa các phần mềm, công cụ hỗ trợ sử dụng trong quá trình thực hiện đồ án

---

## 📋 Mục đích

Thư mục `soft/` chứa các công cụ, thư viện, phần mềm cần thiết cho:
- Phát triển ứng dụng
- Testing và debugging
- Deployment và monitoring
- Documentation

---

## 🛠 Danh sách công cụ sử dụng

### Development Tools

#### 1. **Visual Studio Code** (Code Editor)
- Version: 1.85+
- Extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - MongoDB for VS Code
  - Docker
  - Thunder Client (API testing)

#### 2. **Node.js & npm**
- Node.js: v18.x LTS
- npm: v9.x
- Quản lý dependencies

#### 3. **Git & GitHub**
- Version control
- Collaboration
- Repository: [link]

### Database Tools

#### 4. **MongoDB Atlas**
- Cloud database
- Connection string đã được cấu hình
- Free tier M0

#### 5. **MongoDB Compass** (Optional)
- GUI tool để quản lý MongoDB
- Tải tại: https://www.mongodb.com/products/compass

### API Testing

#### 6. **Postman**
- Version: 10.x
- Testing API endpoints
- Collection: `PHIHub_API.postman_collection.json` (nếu có)

#### 7. **Thunder Client** (VS Code Extension)
- Lightweight API client
- Tích hợp trong VS Code

### Container & Deployment

#### 8. **Docker Desktop**
- Version: 24.x
- Containerization
- Tải tại: https://www.docker.com/products/docker-desktop

#### 9. **Docker Compose**
- Version: 2.x
- Multi-container orchestration

### Browser DevTools

#### 10. **Chrome DevTools**
- React Developer Tools extension
- Redux DevTools extension (nếu dùng Redux)

---

## 📦 Thư viện & Frameworks chính

### Backend (Node.js)
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "json-rules-engine": "^6.5.0"
}
```

### Frontend (React)
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "recharts": "^2.10.3",
  "axios": "^1.6.2",
  "tailwindcss": "^3.3.6"
}
```

---

## 📂 Cấu trúc đề xuất

```
soft/
├── installers/                 # Các file cài đặt (nếu cần)
│   ├── node-v18.x-x64.msi     # Node.js installer (Windows)
│   ├── Docker_Desktop.exe     # Docker installer
│   └── README.txt             # Hướng dẫn cài đặt
│
├── libraries/                  # Thư viện offline (nếu cần)
│   └── npm-packages/          # npm packages tải về
│
├── tools/                      # Công cụ hỗ trợ
│   ├── postman-collections/   # Postman collections
│   └── database-backups/      # Database backups
│
├── docs/                       # Documentation của tools
│   ├── nodejs-docs.pdf
│   ├── react-docs.pdf
│   └── mongodb-manual.pdf
│
└── README.md                   # File này
```

---

## 🚀 Hướng dẫn cài đặt môi trường

### Windows

```powershell
# 1. Cài đặt Node.js
# Download từ: https://nodejs.org/
# Hoặc dùng installer trong soft/installers/

# 2. Verify installation
node --version
npm --version

# 3. Cài đặt Docker Desktop
# Download từ: https://www.docker.com/products/docker-desktop

# 4. Clone project
git clone <repository-url>
cd PHIHub

# 5. Setup project (xem setup/INSTALL.md)
```

### macOS

```bash
# 1. Install Homebrew (nếu chưa có)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Node.js
brew install node@18

# 3. Install Docker Desktop
brew install --cask docker

# 4. Clone và setup project
git clone <repository-url>
cd PHIHub
# (xem setup/INSTALL.md)
```

### Linux (Ubuntu/Debian)

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose

# 3. Clone và setup
git clone <repository-url>
cd PHIHub
# (xem setup/INSTALL.md)
```

---

## 🔗 Links tải phần mềm

| Phần mềm | Link tải | Version khuyến nghị |
|----------|----------|---------------------|
| Node.js | https://nodejs.org/ | v18.x LTS |
| Docker Desktop | https://www.docker.com/products/docker-desktop | v24.x |
| VS Code | https://code.visualstudio.com/ | Latest |
| MongoDB Compass | https://www.mongodb.com/products/compass | v1.40+ |
| Postman | https://www.postman.com/downloads/ | v10.x |
| Git | https://git-scm.com/downloads | v2.40+ |

---

## 📝 Lưu ý

### Về việc lưu trữ installers:

- **KHÔNG** commit các file installer lớn vào Git repository
- Nếu cần lưu trữ, sử dụng:
  - Google Drive
  - OneDrive
  - USB/External HDD
- Trong `soft/installers/README.txt`, ghi rõ:
  - Link tải chính thức
  - Version sử dụng
  - Checksum (MD5/SHA256) để verify

### Licensing:

Đảm bảo tất cả phần mềm sử dụng đều:
- Open-source (MIT, Apache, GPL, ...)
- Free tier (MongoDB Atlas, ...)
- Educational license (nếu là sinh viên)

---

## 📞 Support

Nếu gặp vấn đề cài đặt tools:
1. Kiểm tra `setup/INSTALL.md` - Phần "Xử lý sự cố"
2. Xem documentation chính thức của tool
3. Liên hệ team qua email

---

**Cập nhật cuối:** November 2025  
**Người thực hiện:** PHIHub Development Team
