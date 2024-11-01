const express = require('express');
const {
  createCourseModule,
  getCourseModules,
  getCourseModuleById,
  updateCourseModule,
  deleteCourseModule,
  getAllCourseModules,
  getCourseModuleStudentById,
  addMainTopic,
  addSubTopic,
  addTitle,
  updateMainTopic,
  updateSubTopic,
  updateTitle,
  updateContent,
  deleteMainTopic,
  deleteSubTopic,
  deleteTitle,
  deleteContent,
  upload
} = require('../controllers/moduleController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Course Module Routes
router.post('/', authMiddleware('instructor'), upload, createCourseModule); // Create a new course module
router.get('/', authMiddleware('instructor'), getCourseModules); // Get all course modules
router.get('/:id',authMiddleware('instructor'), getCourseModuleById);
router.put('/:id', authMiddleware('instructor'), updateCourseModule); // Update a course module
router.delete('/:id', authMiddleware('instructor'), deleteCourseModule); // Delete a course module

// Allow access without authentication
router.get('/modules', getAllCourseModules);
router.get('/:id', getCourseModuleStudentById); // Get a course module by ID

// Curriculum Management Routes
router.post('/:id/main-topics', addMainTopic); // Add a main topic
router.post('/:id/main-topics/:mainTopicId/sub-topics', addSubTopic); // Add a subtopic
router.post('/:id/main-topics/:mainTopicId/sub-topics/:subTopicId/titles', addTitle); // Add a title

router.put('/:id/main-topics/:mainTopicId', updateMainTopic); // Update a main topic
router.put('/:id/main-topics/:mainTopicId/sub-topics/:subTopicId', updateSubTopic); // Update a subtopic
router.put('/:id/main-topics/:mainTopicId/sub-topics/:subTopicId/titles/:titleId', updateTitle); // Update a title
router.put('/course-modules/:id/main-topics/:mainTopicId/sub-topics/:subTopicId/titles/:titleId/content', updateContent);// Route to update content in a title

router.delete('/:id/main-topics/:mainTopicId', deleteMainTopic); // Delete a main topic
router.delete('/:id/main-topics/:mainTopicId/sub-topics/:subTopicId', deleteSubTopic); // Delete a subtopic
router.delete('/:id/main-topics/:mainTopicId/sub-topics/:subTopicId/titles/:titleId', deleteTitle); // Delete a title
router.delete('/course-modules/:id/main-topics/:mainTopicId/sub-topics/:subTopicId/titles/:titleId/content', deleteContent); //delete content


module.exports = router;
