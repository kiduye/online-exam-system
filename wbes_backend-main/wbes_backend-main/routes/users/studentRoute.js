const express = require('express');
const { 
  createStudent, 
  getStudents, 
  getStudentProfile,
  updateStudent, 
  deleteStudent,
  changePassword 
} = require('../../controllers/users/studentController');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

// Create Student
router.post('/', authMiddleware('admin'), createStudent);

// Get Students (within the Admin's department)
router.get('/', authMiddleware('admin'), getStudents);

//change password
router.post('/change-password', authMiddleware('student'), changePassword)
// getStudentProfile
router.get('/profile', authMiddleware('student'), getStudentProfile);

// Update Student
router.put('/:id', authMiddleware('admin'), updateStudent);


// Delete Student
router.delete('/:id', authMiddleware('admin'), deleteStudent);

module.exports = router;
