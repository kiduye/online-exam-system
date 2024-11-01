const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/addCourseNameController');
const authMiddleware = require('../middleware/auth');

// Routes for Admins only
router.post('/', authMiddleware('admin'), createCourse);          // Create course
router.get('/', authMiddleware('admin'), getCourses);             // Get all courses for the admin's department
router.get('/:id', authMiddleware('admin'), getCourseById);       // Get a specific course by ID
router.put('/:id', authMiddleware('admin'), updateCourse);        // Update course
router.delete('/:id', authMiddleware('admin'), deleteCourse);     // Delete course

module.exports = router;
