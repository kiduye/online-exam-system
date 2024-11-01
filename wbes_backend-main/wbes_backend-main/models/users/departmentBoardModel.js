// models/users/departmentBoardModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the DepartmentBoard schema
const departmentBoardSchema = new mongoose.Schema({
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
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: 'departmentboard'
  }
}, { timestamps: true });

// Pre-save hook to hash the password before saving
departmentBoardSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create the DepartmentBoard model
const DepartmentBoard = mongoose.model('DepartmentBoard', departmentBoardSchema);

module.exports = DepartmentBoard;
