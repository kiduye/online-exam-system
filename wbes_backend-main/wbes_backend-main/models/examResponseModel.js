// models/examResponseModel.js

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const examResponseSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  examId: {
    type: Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  responses: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedOption: {
      type: String, // or Number, based on your options
      required: true,
    }
  }],
  submittedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

const ExamResponse = model('ExamResponse', examResponseSchema);

module.exports = ExamResponse;
