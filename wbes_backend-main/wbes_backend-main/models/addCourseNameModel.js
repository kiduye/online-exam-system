// const mongoose = require('mongoose');

// // Define the Course schema
// const courseSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   code: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
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
//   }
// }, { timestamps: true });

// // Create the Course model
// const Course = mongoose.model('Course', courseSchema);

// module.exports = Course;


const mongoose = require('mongoose');

// Define the Course schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  }
  
}, { timestamps: true });

// Create the Course model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
