const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/tokenUtils');

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, dob, gender } = req.body;

  // Kiểm tra email đã tồn tại
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email đã được sử dụng');
  }

  // Tạo user mới
  const user = await User.create({
    name,
    email,
    password,
    dob,
    gender,
  });

  if (user) {
    sendTokenResponse(user, 201, res);
  } else {
    res.status(400);
    throw new Error('Dữ liệu người dùng không hợp lệ');
  }
});

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Vui lòng nhập email và mật khẩu');
  }

  // Tìm user (bao gồm password để so sánh)
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    sendTokenResponse(user, 200, res);
  } else {
    res.status(401);
    throw new Error('Email hoặc mật khẩu không chính xác');
  }
});

// @desc    Đăng xuất
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công',
  });
});

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};
