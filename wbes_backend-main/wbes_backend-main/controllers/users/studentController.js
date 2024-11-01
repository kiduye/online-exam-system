
const bcrypt = require('bcrypt');
const Student = require('../../models/users/studentModel');
const Admin = require('../../models/users/adminModel');
const EnrollmentType = require('../../models/enrollmentTypeModel'); // Ensure to import the EnrollmentType model





exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const student = await Student.findById(req.user._id);
    if (!student) {
      console.log('Student not found for ID:', req.user._id);
      return res.status(404).json({ message: 'Student not found' });
    }

    // Log old and hashed passwords
    console.log('Changing password for student ID:', student._id);
    console.log('Old Password in Request:', oldPassword);
    console.log('Stored Hashed Password:', student.password);

    const isMatch = await bcrypt.compare(oldPassword, student.password);
    console.log('Old Password Match:', isMatch); // Debugging log

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    console.log('New hashed password:', student.password); // Log new hashed password

    student.passwordChanged = true;
    await student.save();

    console.log('Updated Student:', student); // Debugging log
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.log('Error during password change:', error); // Log any errors
    res.status(500).json({ error: error.message });
  }
};




// Create a new student
exports.createStudent = async (req, res) => {
  const adminId = req.user._id; // Admin ID from authenticated user

  try {
    // Get the department from the admin
    const admin = await Admin.findById(adminId).populate('department');

    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const { firstName, lastName, username, email, password, enrollmentTypeId } = req.body;

    // Fetch the enrollment type from the EnrollmentType model
    const enrollmentType = await EnrollmentType.findById(enrollmentTypeId);

    if (!enrollmentType) {
      return res.status(404).json({ msg: 'Enrollment type not found' });
    }

    const department = admin.department._id; // Use the department ID from the admin

    // Initialize performance summary
    const performanceSummary = {
      averageScore: 0,
      lastImprovement: 0,
      improvementTrends: []
    };

    // Create the new student with the department from the admin and initialized performance summary
    const newStudent = new Student({
      firstName,
      lastName,
      username,
      email,
      password,
      department, // Ensure department matches the admin's department
      enrollmentType: enrollmentType._id, // Use the enrollment type ID
      performanceSummary // Initialize the performance summary
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student created successfully', data: newStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get All Students in Admin's department
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ department: req.user.department._id }).populate('enrollmentType');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Current Student Information
// Get Current Student Information with Performance Summary and Exams
exports.getStudentProfile = async (req, res) => {
  try {
    // Fetch the student by the authenticated user ID
    const student = await Student.findById(req.user._id)
      .populate('department') // Populate the department
      .populate('enrollmentType') // Populate the enrollment type
      .populate({
        path: 'exams', // Populate exam results
        populate: { path: 'examId', select: 'title description' } // Populate exam details (title, description)
      });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Return student information along with performance summary and exam history
    const studentData = {
      fullName: `${student.firstName} ${student.lastName}`,
      username: student.username,
      email: student.email,
      department: student.department.name, // Assuming department has a 'name' field
      enrollmentType: student.enrollmentType.name, // Assuming enrollmentType has a 'typeName' field
      performanceSummary: student.performanceSummary, // Include performance summary
      exams: student.exams.map((exam) => ({
        examTitle: exam.examId.title, // Title of the exam
        score: exam.score, // Score of the exam
        date: exam.createdAt // Date when the exam was taken
      }))
    };

    res.status(200).json(studentData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { enrollmentTypeId, password, ...updates } = req.body; // Destructure password from updates

    // If the enrollmentTypeId is provided, fetch it
    if (enrollmentTypeId) {
      const enrollmentType = await EnrollmentType.findById(enrollmentTypeId);
      if (!enrollmentType) {
        return res.status(404).json({ message: 'Enrollment type not found' });
      }
      updates.enrollmentType = enrollmentType._id; // Assign enrollmentType field for update
    }

    // If password is provided, hash it before updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt); // Hash the new password
    }

    // Find and update the student
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: id, department: req.user.department._id },
      updates,
      { new: true }
    ).populate('enrollmentType'); // Populate the enrollmentType field after update

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found or not in your department' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findOneAndDelete({
      _id: id,
      department: req.user.department._id
    });

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found or not in your department' });
    }

    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update performance summary after an exam
exports.updatePerformanceSummary = async (studentId, examResult) => {
  try {
    // Fetch the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      throw new Error('Student not found');
    }

    // Update the improvement trends with the latest exam result
    student.performanceSummary.improvementTrends.push({
      examId: examResult.examId,
      score: examResult.score,
      date: examResult.createdAt
    });

    // Update the average score
    const totalExams = student.exams.length + 1; // Include the new exam
    const totalScore = student.performanceSummary.averageScore * student.exams.length + examResult.score;
    student.performanceSummary.averageScore = totalScore / totalExams;

    // Optionally update lastImprovement (if you track improvement specifically)
    student.performanceSummary.lastImprovement = examResult.score - student.performanceSummary.averageScore;

    await student.save();
  } catch (error) {
    console.error('Error updating performance summary:', error.message);
  }
};

