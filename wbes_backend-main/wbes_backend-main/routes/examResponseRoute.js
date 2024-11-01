const express = require('express');
const router = express.Router();
const {
    createExamResponse,
    getAllExamResponses,
    getExamResponseById,
    updateExamResponse,
    deleteExamResponse
} = require('../controllers/examResponseController');

// POST /api/examResponses - Create a new exam response
router.post('/', createExamResponse);

// GET /api/examResponses - Get all exam responses
router.get('/', getAllExamResponses);

// GET /api/examResponses/:id - Get a specific exam response by ID
router.get('/:id', getExamResponseById);

// PUT /api/examResponses/:id - Update a specific exam response by ID
router.put('/:id', updateExamResponse);

// DELETE /api/examResponses/:id - Delete a specific exam response by ID
router.delete('/:id', deleteExamResponse);

module.exports = router;
