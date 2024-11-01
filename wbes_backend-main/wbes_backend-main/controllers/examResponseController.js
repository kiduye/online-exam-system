const ExamResponse = require('../models/examResponseModel');

// Create a new exam response
const createExamResponse = async (req, res) => {
    try {
        const examResponse = new ExamResponse({
            studentId: req.body.studentId,
            examId: req.body.examId,
            responses: req.body.responses,
        });

        const savedExamResponse = await examResponse.save();
        res.status(201).json(savedExamResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all exam responses
const getAllExamResponses = async (req, res) => {
    try {
        const examResponses = await ExamResponse.find()
            .populate('studentId')
            .populate('examId')
            .populate('responses.questionId');
        res.status(200).json(examResponses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an exam response by ID
const getExamResponseById = async (req, res) => {
    try {
        const examResponse = await ExamResponse.findById(req.params.id)
            .populate('studentId')
            .populate('examId')
            .populate('responses.questionId');

        if (!examResponse) {
            return res.status(404).json({ message: 'Exam Response not found' });
        }

        res.status(200).json(examResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an exam response by ID
const updateExamResponse = async (req, res) => {
    try {
        const updatedExamResponse = await ExamResponse.findByIdAndUpdate(
            req.params.id,
            {
                studentId: req.body.studentId,
                examId: req.body.examId,
                responses: req.body.responses,
            },
            { new: true }
        );

        if (!updatedExamResponse) {
            return res.status(404).json({ message: 'Exam Response not found' });
        }

        res.status(200).json(updatedExamResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an exam response by ID
const deleteExamResponse = async (req, res) => {
    try {
        const deletedExamResponse = await ExamResponse.findByIdAndDelete(req.params.id);

        if (!deletedExamResponse) {
            return res.status(404).json({ message: 'Exam Response not found' });
        }

        res.status(200).json({ message: 'Exam Response deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExamResponse,
    getAllExamResponses,
    getExamResponseById,
    updateExamResponse,
    deleteExamResponse
};
