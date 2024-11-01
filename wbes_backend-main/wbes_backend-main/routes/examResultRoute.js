const express = require('express');
const router = express.Router();
const examResultController = require('../controllers/examResult');
const authMiddleware = require('../middleware/auth');
// Create a new exam result using an exam response ID
router.post('/exam-results/:examResponseId', examResultController.createExamResult);

// Get all exam results
router.get('/exam-results', examResultController.getExamResults);

// get exam result for the current user

router.get('/exam-results/:id',authMiddleware('student'), examResultController.getUserExamResults);

// Update an existing exam result
router.put('/exam-results/:id', examResultController.updateExamResult);

// Delete an existing exam result
router.delete('/exam-results/:id', examResultController.deleteExamResult);

module.exports = router;
