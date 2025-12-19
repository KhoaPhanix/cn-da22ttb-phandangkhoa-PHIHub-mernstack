const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect routes - Yêu cầu xác thực
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Đọc token từ HttpOnly Cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Alternatively, read from Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Kiểm tra token có tồn tại không
  if (!token) {
    res.status(401);
    throw new Error('Không có quyền truy cập. Vui lòng đăng nhập.');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user từ database (không bao gồm password)
    // Support both userId and id in JWT payload
    const userId = decoded.userId || decoded.id;
    req.user = await User.findById(userId).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Người dùng không tồn tại');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }
});

module.exports = { protect };
