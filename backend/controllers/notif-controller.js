const Notification = require('../models/Notifications');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { notifications } });
  } catch (err) { 
    next(err); 
  }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { readStatus: true });
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) { 
    next(err); 
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { readStatus: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (err) { 
    next(err); 
  }
};
