const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduledExamSchema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,  // Reference to the Exam model
    ref: 'Exam',
    required: true
  },
  description: {
    type: String,                 // Description from the Exam model
    required: true
  },
  password: {
    type: Number,                 // Password is now a number
    required: true,
    min: [1000, 'Password must be at least 4 digits'],  // Example: Ensure password is at least 4 digits long
  },
  examDate: {
    type: Date,                   // The date of the scheduled exam
    required: true
  },
  examTime: {
    type: String,                 // The time of the scheduled exam (HH:mm format)
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,  // The admin or user who created the schedule
    ref: 'Admin',                 // Adjust reference model as needed
    required: true
  },
  createdAt: {
    type: Date,                   // Timestamp when the schedule was created
    default: Date.now
  }
});

// Export the model
const ScheduledExam = mongoose.model('ScheduledExam', scheduledExamSchema);
module.exports = ScheduledExam;
