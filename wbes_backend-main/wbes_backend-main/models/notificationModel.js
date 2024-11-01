// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'], 
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: [true, 'Creator is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
