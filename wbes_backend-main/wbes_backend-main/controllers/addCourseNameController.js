const Course = require('../models/addCourseNameModel');

// @desc Create a new course
// @route POST /api/courses
// @access Admin
const createCourse = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Ensure the course department matches the admin's department
    const department = req.user.department;

    const newCourse = new Course({
      name,
      code,
      department
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc Get all courses for the current admin's department
// @route GET /api/courses
// @access Admin
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ department: req.user.department });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc Get a specific course by ID
// @route GET /api/courses/:id
// @access Admin
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course || course.department.toString() !== req.user.department.toString()) {
      return res.status(404).json({ msg: 'Course not found or unauthorized access' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc Update a course
// @route PUT /api/courses/:id
// @access Admin
const updateCourse = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Find the course and populate the department
    let course = await Course.findById(req.params.id).populate('department');

    // Check if the course exists and if it belongs to the admin's department
    if (!course || course.department._id.toString() !== req.user.department._id.toString()) {
      return res.status(404).json({ msg: 'Course not found or unauthorized access' });
    }

    // Update the course fields
    course.name = name || course.name;
    course.code = code || course.code;

    await course.save();
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};


// @desc Delete a course
// @route DELETE /api/courses/:id
// @access Admin
const deleteCourse = async (req, res) => {
  try {
    // Find the course and populate the department
    const course = await Course.findById(req.params.id).populate('department');

    // Check if the course exists and if it belongs to the admin's department
    if (!course || course.department._id.toString() !== req.user.department._id.toString()) {
      return res.status(404).json({ msg: 'Course not found or unauthorized access' });
    }

    // Delete the course using deleteOne()
    await Course.deleteOne({ _id: req.params.id });
    res.status(200).json({ msg: 'Course removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};



module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
