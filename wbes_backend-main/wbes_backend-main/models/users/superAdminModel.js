// models/user/superAdminModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the SuperAdmin schema
const superAdminSchema = new mongoose.Schema({
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
  role: {
    type: String,
    default: 'superadmin'
  }
}, { timestamps: true });

// Pre-save hook to hash the password before saving
superAdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create the SuperAdmin model
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;
