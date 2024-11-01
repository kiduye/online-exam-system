const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },
    examId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Exam', 
        required: true 
    },
    examName: { 
        type: String, 
        required: true 
    },
    score: { 
        type: Number, 
        required: true 
    },
    totalQuestions: { 
        type: Number, 
        required: true 
    },
    correctAnswers: { 
        type: Number, 
        required: true 
    },
    percentage: {
        type: Number, 
        default: function() {
            return (this.correctAnswers / this.totalQuestions) * 100; // Calculate percentage
        }
    },
    examDate: { 
        type: Date, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    passingScore: { 
        type: Number, 
        default: 50 // Default passing score is 50%
    },
    status: {
        type: String,
        enum: ['Pass', 'Fail'], // Can only be 'Pass' or 'Fail'
        default: function() {
            // Determine pass/fail status based on percentage and passing score
            return (this.percentage >= this.passingScore) ? 'Pass' : 'Fail';
        }
    }
});

module.exports = mongoose.model('ExamResult', examResultSchema);
