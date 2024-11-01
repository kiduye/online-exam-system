// const mongoose = require('mongoose');

// // Define the Question schema
// const questionSchema = new mongoose.Schema({
//   questionText: {
//     type: String,
//     required: true,  // The question text
//   },
//   options: [{
//     type: String,
//     required: true,   // Options for the question (multiple choices)
//   }],
//   answer: {
//     type: String,
//     required: true,   // The correct answer
//   },
//   instructor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Instructor',
//     required: true,   // The instructor who created the question
//   },
//   course: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course',   // Reference the Course model
//     required: true,
//   },
//   department: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',   // Reference the Department model
//     required: true,
//   },
// }, { timestamps: true });

// // Pre-save middleware to auto-populate course and department based on the instructor
// questionSchema.pre('save', async function (next) {
//   if (this.isNew || this.isModified('instructor')) {
//     try {
//       const instructor = await mongoose.model('Instructor').findById(this.instructor).populate('department courses');
      
//       if (!instructor) {
//         return next(new Error('Instructor not found'));
//       }
      
//       if (!instructor.department) {
//         return next(new Error('Instructor does not have a department assigned'));
//       }
      
//       if (!instructor.courses || instructor.courses.length === 0) {
//         return next(new Error('Instructor does not have any courses assigned'));
//       }

//       this.course = instructor.courses[0]._id; // Automatically populate the first course
//       this.department = instructor.department._id; // Populate department
//     } catch (error) {
//       return next(error);
//     }
//   }
//   next();
// });

// // Static method to get questions by courseId
// questionSchema.statics.getQuestionsByCourseId = async function(courseId) {
//   if (!mongoose.Types.ObjectId.isValid(courseId)) {
//     throw new Error('Invalid courseId format');
//   }
  
//   return this.find({ course: courseId }).populate('instructor department'); // Populate related fields if needed
// };

// module.exports = mongoose.model('Question', questionSchema);

const mongoose = require('mongoose');

// Define the Question schema
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,  // The question text
  },
  options: {
    type: [String],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length >= 2;  // Minimum 2 options required
      },
      message: 'A question must have at least two options.'
    },
    required: true,   // Options for the question (multiple choices)
  },
  answer: {
    type: String,
    required: true,   // The correct answer
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true,   // The instructor who created the question
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',   // Reference the Course model
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',   // Reference the Department model
    required: true,
  },
}, { timestamps: true });

// Pre-save middleware to auto-populate course and department based on the instructor
questionSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('instructor')) {
    try {
      const instructor = await mongoose.model('Instructor').findById(this.instructor).populate('department courses');

      if (!instructor) {
        return next(new Error('Instructor not found'));
      }

      if (!instructor.department) {
        return next(new Error('Instructor does not have a department assigned'));
      }

      if (!instructor.courses || instructor.courses.length === 0) {
        return next(new Error('Instructor does not have any courses assigned'));
      }

      this.course = instructor.courses[0]._id; // Automatically populate the first course
      this.department = instructor.department._id; // Populate department
    } catch (error) {
      return next(error);
    }
  }
  
  // Validate options before saving
  if (!this.options || !Array.isArray(this.options) || this.options.length < 2) {
    return next(new Error('A question must have at least two options.'));
  }
  
  next();
});

// Static method to get questions by courseId
questionSchema.statics.getQuestionsByCourseId = async function(courseId) {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new Error('Invalid courseId format');
  }

  return this.find({ course: courseId }).populate('instructor department'); // Populate related fields if needed
};

module.exports = mongoose.model('Question', questionSchema);
