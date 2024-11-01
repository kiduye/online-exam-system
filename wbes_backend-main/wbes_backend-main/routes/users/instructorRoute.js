const express = require('express');
const { 
  createInstructor, 
  getAllInstructors, 
  updateInstructor, 
  deleteInstructor ,
  getAssignedCourses
} = require('../../controllers/users/instructorController');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

// Create Instructor
router.post('/', authMiddleware('admin'), createInstructor);

// Get Instructors (within the Admin's department)
router.get('/', authMiddleware('admin'), getAllInstructors);

// get assigned courses to instructor
getAssignedCourses
// Route to get assigned courses for the instructor
router.get('/assigned-courses', authMiddleware('instructor'), getAssignedCourses);
// Update Instructor
router.put('/:id', authMiddleware('admin'), updateInstructor);

// Delete Instructor
router.delete('/:id', authMiddleware('admin'), deleteInstructor);



module.exports = router;
