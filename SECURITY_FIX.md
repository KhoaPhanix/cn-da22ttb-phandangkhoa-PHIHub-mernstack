# ⚠️ CẢNH BÁO BẢO MẬT - SECURITY WARNING

## MongoDB Credentials bị lộ (Exposed)

GitHub đã phát hiện MongoDB connection string với credentials trong code. Đây là **lỗ hổng bảo mật nghiêm trọng**.

### ✅ Đã xử lý:

1. **Xóa tất cả credentials** khỏi 15+ files
2. **Chuyển sang environment variables** (`.env` files)
3. **Thêm dotenv** package vào `setup/sample-data/package.json`
4. **Cập nhật docker-compose.yml** để dùng env vars

### 🔐 Hành động bắt buộc:

1. **ĐỔI MẬT KHẨU MongoDB Atlas NGAY** (quan trọng nhất!)
   - Vào MongoDB Atlas Dashboard
   - Database Access → Edit User → Reset Password
   - Cập nhật lại connection string trong `.env`

2. **Xoay JWT_SECRET mới**
   - Generate secret mới: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Cập nhật trong `.env`

3. **Kiểm tra Git history**
   - Credentials cũ vẫn còn trong git history
   - Nên xem xét: `git filter-branch` hoặc tạo repository mới

### 📝 Files đã được sửa:

- ✅ `setup/sample-data/*.js` (7 files) - Chuyển sang `process.env.MONGO_URI`
- ✅ `setup/INSTALL.md` - Thay credentials thật bằng placeholders
- ✅ `setup/sample-data/README.md` - Xóa connection strings
- ✅ `docker/docker-compose.yml` - Dùng `${MONGODB_URI}` env var
- ✅ `docs/GUIDE_FOR_BOARD.md` - Xóa connection string

### 📖 Cách dùng sau khi fix:

#### Development:
```bash
cd src/server
cp .env.example .env
# Sửa MONGO_URI trong .env với credentials MỚI
npm run dev
```

#### Import sample data:
```bash
cd setup/sample-data
npm install  # Cài dotenv
# Script sẽ tự động đọc từ ../../src/server/.env
node import.js
```

#### Docker:
```bash
cd docker
cp .env.example .env
# Sửa MONGODB_URI và JWT_SECRET
docker-compose up -d
```

### ⚠️ Lưu ý:

- **KHÔNG BAO GIỜ** commit file `.env` vào Git
- `.gitignore` đã được cập nhật để ignore `.env`
- Chỉ commit `.env.example` với placeholders
- Trong production, dùng environment variables thật (không dùng file)

### 🔍 Kiểm tra xem còn credentials nào không:

```bash
# Tìm trong working directory
grep -r "Silnix13670" .
grep -r "admin:.*@healthtracker" .

# Tìm trong git history
git log --all -p -S "Silnix13670"
```

### 📚 Tham khảo:

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [MongoDB Security Best Practices](https://www.mongodb.com/docs/manual/security/)
- [OWASP Top 10 - Sensitive Data Exposure](https://owasp.org/www-project-top-ten/)
