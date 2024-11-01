const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Admin authentication middleware
const scheduledExamController = require('../controllers/scheduleController');

// Admin protected routes
router.post('/', authMiddleware('admin'), scheduledExamController.createScheduledExam); // Create a scheduled exam
router.get('/', authMiddleware('admin'), scheduledExamController.getAllScheduledExams); // Get all scheduled exams
router.get('/exam', authMiddleware('student'), scheduledExamController.getAccessibleExamsForStudent);

// verifyExamPassword
router.post('/verifyExamPassword', authMiddleware('student'), scheduledExamController.verifyExamPassword);

// getExamQuestions
router.get('/exams/:examId/questions', authMiddleware('student'), scheduledExamController.getExamQuestions);

router.get('/:id/exam', scheduledExamController.getExamByScheduledExamId);

router.get('/:id', authMiddleware('admin'), scheduledExamController.getScheduledExamById); // Get a single scheduled exam by ID
router.put('/:id', authMiddleware('admin'), scheduledExamController.updateScheduledExam); // Update a scheduled exam
router.delete('/:id', authMiddleware('admin'), scheduledExamController.deleteScheduledExam); // Delete a scheduled exam
router.get('/:scheduledExamId/questions', authMiddleware('student'), scheduledExamController.getScheduledExamQuestions);

module.exports = router;
