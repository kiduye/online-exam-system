// // models/users/studentModel.js

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// // Define the Student schema
// const studentSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
  
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 8
//   },
//   department: {
//     type: String,
//     enum: [
//       "Software Engineering",
//       "Information Technology",
//       "Information Systems",
//       "Computer Science",
//       "Chemical Engineering",
//       "Civil Engineering",
//       "Mechanical Engineering",
//       "Textile Engineering",
//       "Garment Engineering",
//       "Leather Engineering",
//       "Fashion Design",
//       "Architecture",
//       "Computer Engineering",
//       "Electrical Engineering"
      
//     ],
//     required: true
//   },
//   role: {
//     type: String,
//     default: 'student'
//   }
// }, { timestamps: true });

// // Pre-save hook to hash the password before saving
// studentSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Create the Student model
// const Student = mongoose.model('Student', studentSchema);

// module.exports = Student;



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the Student schema
const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',  // Reference to the Department model
    required: [true, 'Department is required'],
  },
  role: {
    type: String,
    default: 'student'
  },
  // Reference to the EnrollmentType model
  enrollmentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EnrollmentType',
    required: true
  },
  // Add a reference to the exam results
  exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamResult' }],
  // Store performance summary
  performanceSummary: {
    averageScore: { type: Number, default: 0 },
    lastImprovement: { type: Number, default: 0 },
    improvementTrends: [
      {
        examId: { type: String },
        score: { type: Number },
        date: { type: Date }
      }
    ]
  }
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
  // Check if the password is modified
  if (!this.isModified('password')) {
    console.log("Password not modified, skipping hash.");
    return next();
  }
  
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    console.log("Password hashed successfully.");
    next();
  } catch (error) {
    console.error("Error while hashing password:", error);
    next(error); // Pass the error to the next middleware
  }
});


// Create the Student model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
