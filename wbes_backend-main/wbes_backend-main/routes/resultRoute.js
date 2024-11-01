// routes/examRoutes.js

const express = require('express');
const router = express.Router();
const ExamResponse = require('../models/examResponseModel');
const calculateScore = require('../services/scoreService');

router.post('/submit-exam', async (req, res) => {
  const { studentId, examId, responses } = req.body;

  // Save exam responses
  const examResponse = new ExamResponse({
    studentId,
    examId,
    responses,
  });

  await examResponse.save();

  // Calculate the score
  try {
    const result = await calculateScore(studentId, examId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
