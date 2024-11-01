
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const {
//   createQuestion,
//   getQuestions,
//   getQuestionById,
//   updateQuestion,
//   deleteQuestion,
//   bulkCreateQuestions,
//   getQuestionsByDepartment
// } = require('../controllers/questionController');
// const authMiddleware = require('../middleware/auth');

// const upload = multer({ dest: 'uploads/' });

// // CRUD operations for questions
// router.post('/', authMiddleware('instructor'), createQuestion);
// router.get('/', authMiddleware('instructor'), getQuestions);
// router.get('/:id', authMiddleware('instructor'), getQuestionById);
// router.put('/:id', authMiddleware('instructor'), updateQuestion);
// router.delete('/:id', authMiddleware('instructor'), deleteQuestion);

// // Bulk create questions
// router.post('/bulk-create', authMiddleware('instructor'), upload.single('file'), bulkCreateQuestions);

// // Routes for department boards (Retrieve questions by department)
// router.get('/department/:department', authMiddleware('departmentboard'), getQuestionsByDepartment);


// module.exports = router;



const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/bulkquestion_multer');
const sanitizeHtml = require('sanitize-html'); // Use sanitize-html for sanitizing rich text input

// Create a new question
router.post('/', authMiddleware('instructor'), questionController.createQuestion);

// Get all questions
router.get('/', authMiddleware('instructor'), questionController.getAllQuestionsForInstructor);

router.get('/:questionId',  questionController.getQuestionById);
// Get a single question by ID
// router.get('/:id', questionController.getQuestionById);

// Update a question by ID
router.put('/:id',authMiddleware('instructor'), questionController.updateQuestion);

// Delete a question by ID
router.delete('/:id',authMiddleware('instructor'), questionController.deleteQuestion);

router.get('/department/:departmentId', authMiddleware('departmentboard'), questionController.getAllQuestionsForDepartment);

router.get('/course', authMiddleware('departmentboard'), questionController.getQuestionsByCourseId);

// Bulk upload route for instructors
router.post('/upload-questions', authMiddleware('instructor'), upload.single('file'), questionController.uploadQuestions);

// Get filtered questions (only accessible by department boards)
router.get('/filter', authMiddleware('departmentboard'), questionController.getFilteredQuestions);

// Route to get questions by course name (Department Board only)
router.get('/course/:courseId', authMiddleware('departmentboard'), questionController.getQuestionsByCourseId);

// Route to get questions by instructor name (Department Board only)
router.get('/instructor/:instructorName', authMiddleware('departmentboard'), questionController.getQuestionsByInstructorName);



module.exports = router;

 