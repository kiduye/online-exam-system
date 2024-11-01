const Instructor = require('../../models/users/instructorModel');
const Course = require('../../models/addCourseNameModel'); // Assuming the Course model is in this path
const Admin = require('../../models/users/adminModel');

// Create a new instructor (with optional course assignment)
// Create a new instructor (with optional course assignment)
// Create a new instructor
exports.createInstructor = async (req, res) => {
  const adminId = req.user._id; // Admin ID from authenticated user

  try {
    // Get department from admin
    const admin = await Admin.findById(adminId).populate('department');

    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const { name, email, password, courseIds } = req.body;
    const department = admin.department._id; // Use the department ID from the admin

    // Ensure the admin can only create instructors in their own department
    if (req.user.role === 'admin' && department.toString() !== req.user.department._id.toString()) {
      return res.status(403).json({ msg: 'You can only add instructors to your department.' });
    }

    // If courseIds are provided, fetch and validate the courses
    let assignedCourses = [];
    if (courseIds && courseIds.length > 0) {
      assignedCourses = await Course.find({ 
        _id: { $in: courseIds }, 
        department: department  // Admin can only assign courses from their own department
      });

      // Ensure all provided course IDs are valid and belong to the same department
      if (assignedCourses.length !== courseIds.length) {
        return res.status(400).json({ msg: 'Some courses do not belong to your department.' });
      }
    }

    // Create the new instructor with the optional courses
    const instructor = new Instructor({
      name,
      email,
      password,
      department,
      courses: assignedCourses.map(course => course._id)  // Assign valid courses
    });

    await instructor.save();

    // Success response with message
    res.status(201).json({
      msg: 'Instructor created successfully',
      instructor
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};



// Get all instructors (Admin's department)
exports.getAllInstructors = async (req, res) => {
  try {
    // Fetch all instructors with populated fields
    const instructors = await Instructor.find({ department: req.user.department._id })
      .populate('department')
      .populate('courses');

    if (!instructors) {
      return res.status(404).json({ msg: 'No instructors found' });
    }

    // Log IDs for debugging
    console.log('Admin Department ID:', req.user.department.toString());

    res.json(instructors);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get courses assigned to the instructor
exports.getAssignedCourses = async (req, res) => {
  try {
    // Find the instructor by their ID and populate the 'courses' field
    const instructor = await Instructor.findById(req.user._id)
      .populate({
        path: 'courses',
        select: 'name'  // Fetch only the 'name' field of each course
      });

    if (!instructor) {
      return res.status(404).json({ msg: 'Instructor not found' });
    }

    // Send the list of course names in the response
    res.status(200).json({
      msg: 'Assigned courses fetched successfully',
      courses: instructor.courses  // This will include only the 'name' field of each course
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};


// Update instructor (including course assignment)
exports.updateInstructor = async (req, res) => {
  try {
    // Log user info for debugging
    console.log('User making the request:', req.user);

    const instructor = await Instructor.findById(req.params.id).populate('department');
    
    if (!instructor) {
      return res.status(404).json({ msg: 'Instructor not found' });
    }

    // Check if the current user is an admin and ensure they are updating an instructor from their own department
    if (req.user.role === 'admin') {
      if (!req.user.department) {
        return res.status(403).json({ msg: 'Access denied. Admin does not have a department assigned.' });
      }

      // Compare department of the admin and instructor
      if (req.user.department._id.toString() !== instructor.department._id.toString()) {
        return res.status(403).json({ msg: 'Access denied. You can only update instructors from your department.' });
      }
    }

    // Update instructor fields
    const { name, email, password, courseIds } = req.body;

    if (name) instructor.name = name;
    if (email) instructor.email = email;
    if (password) instructor.password = password;  // This will trigger the pre-save hook for password hashing

    // If courseIds are provided, update the courses
    if (courseIds && courseIds.length > 0) {
      const courses = await Course.find({
        _id: { $in: courseIds },
        department: req.user.department // Admin can only assign courses from their own department
      });

      if (courses.length !== courseIds.length) {
        return res.status(400).json({ msg: 'Some courses do not belong to your department.' });
      }

      instructor.courses = courses.map(course => course._id);
    }

    await instructor.save();
    res.status(200).json(instructor);
  } catch (error) {
    console.error('Error updating instructor:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};



// Delete instructor
exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate('department');

    if (!instructor) {
      return res.status(404).json({ msg: 'Instructor not found' });
    }

    // Restrict deletion based on department
    if (req.user.role === 'admin' && req.user.department._id.toString() !== instructor.department._id.toString()) {
      return res.status(403).json({ msg: 'Access denied. You can only delete instructors from your department.' });
    }

    await instructor.deleteOne();
    res.status(200).json({ msg: 'Instructor removed' });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

