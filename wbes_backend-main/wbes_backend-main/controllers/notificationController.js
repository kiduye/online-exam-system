// controllers/notificationController.js
const Notification = require('../models/notificationModel');

// Create a new notification
exports.createNotification = async (req, res) => {
  const { title, message, icon, link } = req.body;

  try {
    const newNotification = new Notification({
      title,
      message,
      icon,
      link,
      createdBy: req.user._id // Ensure user is authenticated
    });

    await newNotification.save();
    res.status(201).json({ success: true, data: newNotification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a specific notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a notification by ID
exports.updateNotification = async (req, res) => {
  const { title, message, icon, link } = req.body;

  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { title, message, icon, link },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
