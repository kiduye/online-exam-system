// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, getNotificationById, updateNotification, deleteNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');


// Routes for fetching notifications (students, instructors, department boards, admin, superadmin)
router.get('/', authMiddleware(['student', 'instructor', 'departmentboard', 'admin', 'superadmin']), getNotifications);
router.get('/:id', authMiddleware(['student', 'instructor', 'departmentboard', 'admin', 'superadmin']), getNotificationById);

// Routes for CRUD operations (admin and superadmin only)
router.post('/', authMiddleware( 'superadmin'), createNotification); // Admin and SuperAdmin can create notifications
router.put('/:id', authMiddleware( 'superadmin'), updateNotification); // Admin and SuperAdmin can update notifications
router.delete('/:id', authMiddleware( 'superadmin'), deleteNotification); // Admin and SuperAdmin can delete notifications

module.exports = router;
