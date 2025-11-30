import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true, // Gửi cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor để xử lý lỗi global
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ redirect đến login nếu:
    // 1. Response status là 401
    // 2. Không phải request /auth/me (để tránh loop khi check auth)
    // 3. Không đã ở trang login hoặc register
    if (
      error.response?.status === 401 &&
      !error.config.url.includes('/auth/me') &&
      !window.location.pathname.includes('/login') &&
      !window.location.pathname.includes('/register')
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
