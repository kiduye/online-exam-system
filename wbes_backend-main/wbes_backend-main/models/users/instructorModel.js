const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the Instructor schema
const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course' // Reference to the Course model
  }],
  role: {
    type: String,
    default: 'instructor'
  }
}, { timestamps: true });

// Pre-save hook to hash the password before saving

instructorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create the Instructor model
const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;
