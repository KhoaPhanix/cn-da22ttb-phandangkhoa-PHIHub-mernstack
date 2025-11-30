# Docker Configuration - PHIHub

> Cấu hình triển khai ứng dụng PHIHub với Docker và Docker Compose

---

## 📋 Tổng quan

Thư mục này chứa cấu hình Docker để triển khai toàn bộ stack PHIHub:
- **Frontend:** React app với Nginx
- **Backend:** Node.js API với Express
- **Database:** MongoDB 7.0

---

## 📁 Files trong thư mục

```
docker/
└── docker-compose.yml          # Orchestration file chính
```

**Lưu ý:** Các Dockerfile nằm trong thư mục source:
- Frontend Dockerfile: `src/client/Dockerfile`
- Backend Dockerfile: `src/server/Dockerfile`

---

## 🚀 Cách sử dụng

### 1. Khởi động toàn bộ hệ thống

```bash
cd docker
docker-compose up -d --build
```

**Giải thích:**
- `up`: Khởi động containers
- `-d`: Chạy ở background (detached mode)
- `--build`: Rebuild images nếu có thay đổi

### 2. Kiểm tra trạng thái

```bash
docker-compose ps
```

**Kết quả mong đợi:**
```
NAME                IMAGE               STATUS          PORTS
phihub-client       phihub-client       Up              0.0.0.0:8080->80/tcp
phihub-server       phihub-server       Up              0.0.0.0:5000->5000/tcp
phihub-mongo        mongo:7.0           Up              0.0.0.0:27017->27017/tcp
```

### 3. Xem logs

```bash
# Tất cả services
docker-compose logs -f

# Service cụ thể
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f mongo

# 100 dòng cuối
docker-compose logs --tail=100 server
```

### 4. Dừng hệ thống

```bash
# Dừng containers (giữ data)
docker-compose down

# Dừng và xóa volumes (MẤT DATA!)
docker-compose down -v
```

### 5. Restart service cụ thể

```bash
docker-compose restart server
docker-compose restart client
```

### 6. Rebuild sau khi sửa code

```bash
# Rebuild tất cả
docker-compose up -d --build

# Rebuild service cụ thể
docker-compose up -d --build server
```

---

## 🏗 Kiến trúc Docker

### Services

#### 1. **mongo** - MongoDB Database
- **Image:** mongo:7.0
- **Container name:** phihub-mongo
- **Port:** 27017:27017
- **Volume:** mongo-data:/data/db
- **Network:** phihub-network

#### 2. **server** - Backend API
- **Build context:** ../src/server
- **Dockerfile:** src/server/Dockerfile
- **Container name:** phihub-server
- **Port:** 5000:5000
- **Dependencies:** mongo (phải chạy trước)
- **Environment:**
  ```env
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=mongodb+srv://...
  JWT_SECRET=...
  CLIENT_URL=http://localhost:8080
  ```
- **Network:** phihub-network

#### 3. **client** - Frontend App
- **Build context:** ../src/client
- **Dockerfile:** src/client/Dockerfile (multi-stage với Nginx)
- **Container name:** phihub-client
- **Port:** 8080:80
- **Dependencies:** server (phải chạy trước)
- **Network:** phihub-network

### Volumes

- **mongo-data:** Persistent storage cho MongoDB data

### Networks

- **phihub-network:** Bridge network kết nối các containers

---

## 🔧 Cấu hình nâng cao

### Thay đổi ports

Sửa file `docker-compose.yml`:

```yaml
services:
  client:
    ports:
      - "3000:80"  # Thay vì 8080:80
  
  server:
    ports:
      - "4000:5000"  # Thay vì 5000:5000
```

Nhớ cập nhật `CLIENT_URL` trong server environment variables.

### Sử dụng MongoDB local thay vì Atlas

```yaml
server:
  environment:
    MONGODB_URI: mongodb://mongo:27017/phihub  # Dùng service name 'mongo'
```

### Scale containers

```bash
# Chạy nhiều instances của server
docker-compose up -d --scale server=3
```

**Lưu ý:** Cần thêm load balancer (Nginx) để phân phối traffic.

### Giới hạn tài nguyên

```yaml
server:
  deploy:
    resources:
      limits:
        cpus: '1.0'
        memory: 512M
      reservations:
        cpus: '0.5'
        memory: 256M
```

---

## 🐛 Troubleshooting

### Container không start

```bash
# Xem logs chi tiết
docker-compose logs server

# Kiểm tra container status
docker ps -a

# Vào trong container để debug
docker exec -it phihub-server sh
```

### Port đã được sử dụng

```powershell
# Windows - Tìm process sử dụng port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Hoặc đổi port trong docker-compose.yml
```

### Không connect được MongoDB Atlas

Kiểm tra:
1. Internet connection
2. MongoDB Atlas IP whitelist (set 0.0.0.0/0)
3. Connection string đúng trong environment variables

### Frontend không gọi được Backend API

Kiểm tra:
1. `CLIENT_URL` trong server environment
2. Network `phihub-network` đã được tạo
3. Containers cùng network:
   ```bash
   docker network inspect phihub-network
   ```

### Rebuild không áp dụng changes

```bash
# Xóa cache và rebuild
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Monitoring

### Xem resource usage

```bash
docker stats

# Kết quả:
CONTAINER ID   NAME            CPU %   MEM USAGE / LIMIT
abc123         phihub-client   0.50%   50MiB / 1GiB
def456         phihub-server   2.00%   150MiB / 1GiB
ghi789         phihub-mongo    1.50%   300MiB / 1GiB
```

### Backup MongoDB data

```bash
# Export database
docker exec phihub-mongo mongodump --out /backup

# Copy backup ra host
docker cp phihub-mongo:/backup ./mongodb-backup-$(date +%Y%m%d)
```

### Restore MongoDB data

```bash
# Copy backup vào container
docker cp ./mongodb-backup phihub-mongo:/restore

# Restore
docker exec phihub-mongo mongorestore /restore
```

---

## 🚀 Production Deployment

### Checklist

- [ ] Đổi `JWT_SECRET` thành giá trị bảo mật
- [ ] Set `NODE_ENV=production`
- [ ] Cấu hình SSL/HTTPS (dùng Nginx reverse proxy)
- [ ] Setup automatic backups cho MongoDB
- [ ] Configure health checks
- [ ] Setup monitoring (Prometheus, Grafana)
- [ ] Configure logging (ELK stack)

### Docker Compose Production Template

```yaml
services:
  server:
    restart: always
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}  # Từ .env file
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 📚 Tài liệu tham khảo

- Docker Compose Docs: https://docs.docker.com/compose/
- Docker Best Practices: https://docs.docker.com/develop/dev-best-practices/
- Multi-stage Builds: https://docs.docker.com/build/building/multi-stage/

---

**Cập nhật cuối:** November 2025  
**Maintainer:** PHIHub Development Team
