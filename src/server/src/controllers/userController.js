const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const path = require('path');

// @desc    Lấy profile của user
// @route   GET /api/users/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    res.status(404);
    throw new Error('Người dùng không tìm thấy');
  }
});

// @desc    Cập nhật profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.dob = req.body.dob || user.dob;
    user.gender = req.body.gender || user.gender;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    
    // Cập nhật avatar nếu có
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    // Cập nhật medicalInfo nếu có
    if (req.body.medicalInfo) {
      if (!user.medicalInfo) {
        user.medicalInfo = {};
      }
      
      // Cập nhật từng field của medicalInfo
      if (req.body.medicalInfo.chronicConditions !== undefined) {
        user.medicalInfo.chronicConditions = req.body.medicalInfo.chronicConditions;
      }
      if (req.body.medicalInfo.allergies !== undefined) {
        user.medicalInfo.allergies = req.body.medicalInfo.allergies;
      }
      if (req.body.medicalInfo.medications !== undefined) {
        user.medicalInfo.medications = req.body.medicalInfo.medications;
      }
      if (req.body.medicalInfo.emergencyContact !== undefined) {
        user.medicalInfo.emergencyContact = req.body.medicalInfo.emergencyContact;
      }
      if (req.body.medicalInfo.doctor !== undefined) {
        user.medicalInfo.doctor = req.body.medicalInfo.doctor;
      }
    }

    // Cập nhật password nếu có
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatar: updatedUser.avatar,
        medicalInfo: updatedUser.medicalInfo,
      },
    });
  } else {
    res.status(404);
    throw new Error('Người dùng không tìm thấy');
  }
});

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Vui lòng chọn file ảnh');
  }

  const user = await User.findById(req.user._id);

  if (user) {
    // Construct avatar URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        avatar: updatedUser.avatar,
      },
      message: 'Upload ảnh đại diện thành công',
    });
  } else {
    res.status(404);
    throw new Error('Người dùng không tìm thấy');
  }
});

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
};
