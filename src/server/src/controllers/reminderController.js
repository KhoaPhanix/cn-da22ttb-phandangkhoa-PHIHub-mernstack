const Reminder = require('../models/Reminder');

// @desc    Get all reminders for user
// @route   GET /api/reminders
// @access  Private
exports.getReminders = async (req, res) => {
  try {
    const { type, enabled } = req.query;
    
    const filter = { userId: req.user._id };
    if (type) filter.type = type;
    if (enabled !== undefined) filter.enabled = enabled === 'true';
    
    const reminders = await Reminder.find(filter).sort({ nextScheduled: 1 });
    
    res.json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách nhắc nhở',
      error: error.message,
    });
  }
};

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
exports.getReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhắc nhở',
      });
    }
    
    res.json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin nhắc nhở',
      error: error.message,
    });
  }
};

// @desc    Create reminder
// @route   POST /api/reminders
// @access  Private
exports.createReminder = async (req, res) => {
  try {
    const reminderData = {
      ...req.body,
      userId: req.user._id,
    };
    
    const reminder = await Reminder.create(reminderData);
    
    // Calculate next scheduled time
    reminder.calculateNextScheduled();
    await reminder.save();
    
    res.status(201).json({
      success: true,
      message: 'Tạo nhắc nhở thành công',
      data: reminder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi tạo nhắc nhở',
      error: error.message,
    });
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
exports.updateReminder = async (req, res) => {
  try {
    let reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhắc nhở',
      });
    }
    
    Object.keys(req.body).forEach(key => {
      reminder[key] = req.body[key];
    });
    
    // Recalculate next scheduled time if time/frequency changed
    if (req.body.time || req.body.frequency || req.body.days) {
      reminder.calculateNextScheduled();
    }
    
    await reminder.save();
    
    res.json({
      success: true,
      message: 'Cập nhật nhắc nhở thành công',
      data: reminder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật nhắc nhở',
      error: error.message,
    });
  }
};

// @desc    Toggle reminder enabled status
// @route   PATCH /api/reminders/:id/toggle
// @access  Private
exports.toggleReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhắc nhở',
      });
    }
    
    reminder.enabled = !reminder.enabled;
    
    if (reminder.enabled) {
      reminder.calculateNextScheduled();
    }
    
    await reminder.save();
    
    res.json({
      success: true,
      message: `${reminder.enabled ? 'Bật' : 'Tắt'} nhắc nhở thành công`,
      data: reminder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái nhắc nhở',
      error: error.message,
    });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhắc nhở',
      });
    }
    
    await reminder.deleteOne();
    
    res.json({
      success: true,
      message: 'Xóa nhắc nhở thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa nhắc nhở',
      error: error.message,
    });
  }
};

// @desc    Get upcoming reminders
// @route   GET /api/reminders/upcoming
// @access  Private
exports.getUpcomingReminders = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    const reminders = await Reminder.find({
      userId: req.user._id,
      enabled: true,
      nextScheduled: {
        $gte: now,
        $lte: future,
      },
    }).sort({ nextScheduled: 1 });
    
    res.json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách nhắc nhở sắp tới',
      error: error.message,
    });
  }
};
