const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
