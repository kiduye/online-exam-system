const mongoose = require('mongoose');

// Define the Exam schema
const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // The title of the exam
  },
  description: {
    type: String,   // Optional description of the exam
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',   // Reference the Department model
    required: true,      // Department to which the exam belongs
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',    // Reference the Question model
  }],
  
  duration: {
    type: Number,   // Duration of the exam in minutes
    required: true
  },
}, { timestamps: true });

// Pre-save middleware to automatically fetch questions based on the department
examSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('department')) {
    try {
      // Fetch questions based on the department
      const questions = await mongoose.model('Question').find({ department: this.department });

      if (!questions) {
        return next(new Error('No questions found for the specified department'));
      }

      this.questions = questions.map(question => question._id); // Populate with question IDs
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Exam', examSchema);
