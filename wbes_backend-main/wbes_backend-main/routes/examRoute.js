const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController'); // Adjust the path as needed
const authMiddleware = require('../middleware/auth'); // Adjust the path as needed

// Create a new exam (only accessible by department boards)
router.post('/', authMiddleware('departmentboard'), examController.createExam);

//get exams

router.get('/department', authMiddleware('departmentboard'), examController.getExams);

// Get all exams for the user's department
router.get('/', authMiddleware('departmentboard'), examController.getAllExams);

// Route to fetch exams for the current admin's department
router.get('/admin/exams', authMiddleware('admin'), examController.getAdminExams);

// getExamQuestions

router.get('/:examId/questions', authMiddleware('student'), examController.getExamQuestions);

// Get a single exam by ID
router.get('/exams/:id', authMiddleware('departmentboard'), examController.getExamById);

// Update an exam by ID
router.put('/update/:id', authMiddleware('departmentboard'), examController.updateExam);

//drop question from the exam

router.put('/exams/:examId/remove-question/:questionId',examController.removeQuestionFromExam);

// Delete an exam by ID
router.delete('/:id', authMiddleware('departmentboard'), examController.deleteExam);

module.exports = router;


