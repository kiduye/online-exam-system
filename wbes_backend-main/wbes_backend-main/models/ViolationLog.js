// models/ViolationLog.js

const mongoose = require('mongoose');

const violationLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student',  // Reference to the Student model
    required: true 
  },
  violationType: { 
    type: String, 
    required: true 
  },
  count: { 
    type: Number, 
    default: 1  // Start with 1 violation when it's first logged
  },
  timestamp: { 
    type: Date, 
    default: Date.now  // Automatically track when the violation was logged
  }
});

module.exports = mongoose.model('ViolationLog', violationLogSchema);
