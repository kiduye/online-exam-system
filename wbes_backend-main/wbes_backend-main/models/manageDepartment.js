const mongoose = require('mongoose');

// Define the Department schema
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

// Create the Department model
const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
