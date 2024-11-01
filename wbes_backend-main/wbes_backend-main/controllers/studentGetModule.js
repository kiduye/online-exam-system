// controllers/courseModuleController.js
const CourseModule = require('../models/moduleModel');

// Get all course modules without authentication
exports.getAllCourseModules = async (req, res) => {
  try {
    const courseModules = await CourseModule.find()
      .populate('courseName') // Populate course details if needed
      .populate('instructor') // Populate instructor details
      .exec();
    res.status(200).json(courseModules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course modules', error });
  }
};
