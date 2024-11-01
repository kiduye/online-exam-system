const express = require('express');
const { getProfile, updateProfile ,updateStudentProfile} = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Route to get the profile of the authenticated user
router.get('/profile', authMiddleware(), getProfile);

// Route to update the profile (name and password) of the authenticated user
router.put('/profile', authMiddleware(), updateProfile);
router.put('/profile-update', authMiddleware('student'), updateStudentProfile);

module.exports = router;
