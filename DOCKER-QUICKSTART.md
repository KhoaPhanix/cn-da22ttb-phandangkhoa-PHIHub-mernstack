# 🐳 PHIHub Docker Quick Start

## ✅ Dự án đang chạy trên Docker!

### 🌐 Truy cập ứng dụng:

- **Frontend (Client)**: http://localhost:8080
- **Backend (API)**: http://localhost:5000
- **MongoDB**: localhost:27017

### 🔐 Đăng nhập:

```
Email: test@phihub.com
Password: Test123!
```

*(Dữ liệu test tháng 12/2025 chưa được import. Xem bên dưới để import)*

---

## 📦 Containers đang chạy:

1. **phihub-client** (Frontend) - Port 8080
2. **phihub-server** (Backend API) - Port 5000
3. **phihub-mongo** (MongoDB) - Port 27017

---

## 🛠️ Các lệnh Docker hữu ích:

### Kiểm tra trạng thái
```bash
docker ps
```

### Xem logs
```bash
docker logs phihub-server
docker logs phihub-client
docker logs phihub-mongo
```

### Xem logs realtime
```bash
docker logs -f phihub-server
```

### Restart containers
```bash
docker compose -f docker/docker-compose.yml restart
```

### Stop containers
```bash
docker compose -f docker/docker-compose.yml stop
```

### Start containers (nếu đã stop)
```bash
docker compose -f docker/docker-compose.yml start
```

### Stop và xóa containers
```bash
docker compose -f docker/docker-compose.yml down
```

### Stop, xóa containers VÀ xóa data
```bash
docker compose -f docker/docker-compose.yml down -v
```

### Rebuild và restart
```bash
docker compose -f docker/docker-compose.yml up -d --build
```

---

## 📊 Import dữ liệu test (Tháng 12/2025)

Sau khi containers đang chạy, import dữ liệu test:

```bash
# Cách 1: Chạy script từ host machine
cd src/server
# Sửa MONGODB_URI trong .env thành: mongodb://localhost:27017/phihub
node seed-december-2025.js

# Cách 2: Chạy script trong container
docker exec -it phihub-server node seed-december-2025.js
```

**Lưu ý**: Nếu chạy từ host, đảm bảo `.env` trong `src/server/` có:
```
MONGODB_URI=mongodb://localhost:27017/phihub
```

---

## 🔧 Troubleshooting

### Port đã được sử dụng?

Nếu port 8080, 5000, hoặc 27017 đã được sử dụng, sửa trong `docker/docker-compose.yml`:

```yaml
ports:
  - "8081:80"    # Thay 8080 -> 8081
```

### Container không start?

```bash
# Xem logs chi tiết
docker logs phihub-server
docker logs phihub-client

# Restart container
docker restart phihub-server
```

### MongoDB connection error?

```bash
# Kiểm tra MongoDB đang chạy
docker logs phihub-mongo

# Restart MongoDB
docker restart phihub-mongo

# Sau đó restart server
docker restart phihub-server
```

### Rebuild hoàn toàn

```bash
cd docker
docker compose down -v
docker compose up -d --build
```

---

## 🚀 Production Deployment

### Cập nhật environment variables

Sửa file `docker/.env`:

```env
# MongoDB (sử dụng MongoDB Atlas cho production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phihub

# JWT Secret (QUAN TRỌNG: Đổi thành secret key mạnh)
JWT_SECRET=your-super-secret-key-min-32-characters-long
```

### Build cho production

```bash
cd docker
docker compose build --no-cache
docker compose up -d
```

---

## 📝 Notes

- Dữ liệu MongoDB được lưu trong Docker volume `docker_mongo-data`
- Data sẽ được giữ lại ngay cả khi stop containers
- Chỉ mất data khi chạy `docker compose down -v` (xóa volumes)
- Frontend được build với Vite và serve bằng Nginx
- Backend chạy trong production mode

---

## 🎯 Next Steps

1. ✅ Dự án đã chạy trên Docker
2. 🔄 Import dữ liệu test: `docker exec -it phihub-server node seed-december-2025.js`
3. 🌐 Truy cập: http://localhost:8080
4. 🔐 Đăng nhập với test@phihub.com / Test123!
5. 🎉 Demo và test các tính năng!

---

**Happy Coding! 🚀**
