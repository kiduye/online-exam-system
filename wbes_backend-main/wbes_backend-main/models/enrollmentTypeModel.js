const mongoose = require('mongoose');

// Define the EnrollmentType schema
const enrollmentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
}, { timestamps: true });

// Create the EnrollmentType model
const EnrollmentType = mongoose.model('EnrollmentType', enrollmentTypeSchema);

module.exports = EnrollmentType;
