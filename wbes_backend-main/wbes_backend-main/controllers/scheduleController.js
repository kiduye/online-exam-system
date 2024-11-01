const ScheduledExam = require('../models/scheduleModel'); // Import the ScheduledExam model
const Exam = require('../models/examModel'); // Import Exam model for fetching exam info
const Student = require('../models/users/studentModel'); // Import the correct Student model
const mongoose = require('mongoose');

// Create a scheduled exam
exports.createScheduledExam = async (req, res) => {
  try {
    const { examId, password, examDate, examTime } = req.body;
    const adminId = req.user._id; // Assuming the current logged-in user is an admin

    // Fetch the selected exam from the Exam table by examId
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Automatically use the description from the Exam model
    const examDescription = exam.description;

    // Validate that the password is a number
    if (!Number.isInteger(password)) {
      return res.status(400).json({ message: 'Password must be a numerical value.' });
    }

    // Ensure the password is at least 4 digits long
    const passwordString = password.toString();
    if (passwordString.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 digits long.' });
    }

    // Create the scheduled exam with metadata from the Exam model
    const scheduledExam = new ScheduledExam({
      exam: exam._id,              // Reference to the selected exam
      description: examDescription, // Use description from the Exam metadata
      password,                    // The password for the scheduled exam (as a number)
      examDate,                    // The date the exam will be held
      examTime,                    // The time the exam will be held
      createdBy: adminId           // The admin creating the scheduled exam
    });

    // Save the scheduled exam to the database
    await scheduledExam.save();

    res.status(201).json({ message: 'Scheduled exam created successfully', scheduledExam });
  } catch (error) {
    console.error('Error scheduling exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all scheduled exams
exports.getAllScheduledExams = async (req, res) => {
  try {
    const scheduledExams = await ScheduledExam.find().populate('exam');
    res.status(200).json(scheduledExams);
  } catch (error) {
    console.error('Error fetching scheduled exams:', error);
    res.status(500).json({ message: 'Failed to fetch scheduled exams' });
  }
};

// Get a single scheduled exam by ID
exports.getScheduledExamById = async (req, res) => {
  try {
    const scheduledExam = await ScheduledExam.findById(req.params.id).populate('exam');
    if (!scheduledExam) {
      return res.status(404).json({ message: 'Scheduled exam not found' });
    }
    res.status(200).json(scheduledExam);
  } catch (error) {
    console.error('Error fetching scheduled exam:', error);
    res.status(500).json({ message: 'Failed to fetch scheduled exam' });
  }
};

// Get all accessible exams for a student based on schedule and department
// Get all accessible exams for a student based on schedule and department
exports.getAccessibleExamsForStudent = async (req, res) => {
  try {
    const currentDate = new Date();
    const studentId = req.user._id; // Assuming the user is logged in and the ID is available

    // Find the student and populate their department
    const student = await Student.findById(studentId).populate('department'); 

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch all scheduled exams and populate the associated exam and department
    const scheduledExams = await ScheduledExam.find()
      .populate({
        path: 'exam',
        populate: { path: 'department' } // Populate the department from the exam
      });

    // Filter exams the student can access based on department and schedule
    const accessibleExams = scheduledExams.filter((scheduledExam) => {
      const examDate = new Date(scheduledExam.examDate);
      const oneWeekAfterExam = new Date(examDate);
      oneWeekAfterExam.setDate(examDate.getDate() + 7);

      // Check if the exam is accessible within time constraints
      const isExamAccessibleInTime = currentDate <= examDate || currentDate <= oneWeekAfterExam;

      // Check if the exam's department matches the student's department
      const isExamForStudentDepartment = scheduledExam.exam.department._id.toString() === student.department._id.toString();

      // Return true if both conditions are met
      return isExamAccessibleInTime && isExamForStudentDepartment;
    });

    // Return the filtered list of accessible exams
    res.status(200).json(accessibleExams);
  } catch (error) {
    console.error('Error fetching accessible exams for student:', error);
    res.status(500).json({ message: 'Failed to fetch accessible exams' });
  }
};

exports.updateScheduledExam = async (req, res) => {
  try {
    const { password, examDate, examTime } = req.body;

    // Find the scheduled exam by ID
    const scheduledExam = await ScheduledExam.findById(req.params.id);

    if (!scheduledExam) {
      return res.status(404).json({ message: 'Scheduled exam not found' });
    }

    // Update the fields if provided
    if (password) {
      const numericPassword = parseInt(password, 10); // Convert password to an integer
      if (isNaN(numericPassword)) {
        return res.status(400).json({ message: 'Password must be a numerical value.' });
      }
      scheduledExam.password = numericPassword;
    }

    if (examDate) scheduledExam.examDate = examDate;
    if (examTime) scheduledExam.examTime = examTime;

    // Save the updated scheduled exam
    await scheduledExam.save();

    res.status(200).json({ message: 'Scheduled exam updated successfully', scheduledExam });
  } catch (error) {
    console.error('Error updating scheduled exam:', error);
    res.status(500).json({ message: 'Failed to update scheduled exam' });
  }
};

// Delete a scheduled exam
exports.deleteScheduledExam = async (req, res) => {
  try {
    const scheduledExam = await ScheduledExam.findById(req.params.id);
    if (!scheduledExam) {
      return res.status(404).json({ message: 'Scheduled exam not found' });
    }

    // Delete the scheduled exam
    await ScheduledExam.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Scheduled exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting scheduled exam:', error);
    res.status(500).json({ message: 'Failed to delete scheduled exam' });
  }
};

// Verify exam password before allowing the student to start the exam
exports.verifyExamPassword = async (req, res) => {
  try {
    const { examId, enteredPassword } = req.body;
    const studentId = req.user._id; // Assuming the logged-in student ID is available

    // Find the student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the scheduled exam by ID
    const scheduledExam = await ScheduledExam.findById(examId).populate('exam');

    if (!scheduledExam) {
      return res.status(404).json({ message: 'Scheduled exam not found' });
    }

    // Compare the entered password with the stored exam password
    if (scheduledExam.password !== parseInt(enteredPassword, 10)) {
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    // If password matches, allow access to start the exam
    res.status(200).json({ message: 'Password verified successfully. You may start the exam.' });

  } catch (error) {
    console.error('Error verifying exam password:', error);
    res.status(500).json({ message: 'Failed to verify exam password' });
  }
};



exports.getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;
    console.log('Received examId:', examId);

    // Validate the examId format
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ message: 'Invalid examId format' });
    }

    const currentStudentDepartment = req.user.department;
    console.log('Current Student Department:', currentStudentDepartment);

    // Fetch the exam by ID
    const exam = await Exam.findById(examId).populate('questions'); // Ensure questions are populated if they're stored as references
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    console.log('Exam Department:', exam.department);

    // Check if the current student's department matches the exam's department
    if (!currentStudentDepartment._id.equals(exam.department)) {
      return res.status(403).json({ message: 'Access denied: You do not belong to the same department as this exam.' });
    }

    // Ensure the exam has questions
    if (!exam.questions || !Array.isArray(exam.questions)) {
      return res.status(400).json({ message: 'This exam has no questions or questions are not formatted correctly' });
    }

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffleOptions = (question) => {
      // Ensure question has options and they are in array format
      if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
        console.warn(`Question with ID ${question._id} has no options or options are not formatted correctly.`);
        return null; // Return null for invalid questions
      }

      const shuffledOptions = shuffleArray(question.options);
      return { ...question.toObject(), options: shuffledOptions }; // Convert to plain object
    };

    // Filter out any null questions (those without valid options)
    const randomizedQuestions = shuffleArray(
      exam.questions.map(shuffleOptions).filter(q => q !== null)
    );

    // Send back the exam duration and randomized questions
    res.status(200).json({
      duration: exam.duration,
      questions: randomizedQuestions
    });
  } catch (error) {
    console.error('Error fetching exam questions:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch exam questions', error: error.message });
  }
};




// Controller to get questions from a scheduled exam
exports.getScheduledExamQuestions = async (req, res) => {
  const { scheduledExamId } = req.params;

  try {
    // Find the scheduled exam by ID
    const scheduledExam = await ScheduledExam.findById(scheduledExamId).populate('exam');
    if (!scheduledExam) {
      return res.status(404).json({ message: 'Scheduled exam not found' });
    }

    // Get the exam object and its question IDs
    const exam = scheduledExam.exam;
    if (!exam || !exam.questions || exam.questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for the exam' });
    }

    // Fetch the questions based on the exam's question IDs
    const questions = await Question.find({ _id: { $in: exam.questions } });

    res.status(200).json({ exam: scheduledExam, questions });
  } catch (error) {
    console.error('Error fetching scheduled exam questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// // Get an exam by its scheduled exam ID
// exports.getExamByScheduledExamId = async (req, res) => {
//   try {
//     const scheduledExamId = req.params.id; // Get the scheduled exam ID from the request parameters

//     // Find the scheduled exam by ID and populate the associated exam details
//     const scheduledExam = await ScheduledExam.findById(scheduledExamId).populate('exam');

//     if (!scheduledExam) {
//       return res.status(404).json({ message: 'Scheduled exam not found' });
//     }

//     // Extract and return the exam details along with scheduled exam information
//     res.status(200).json({
//       scheduledExamId: scheduledExam._id,
//       exam: scheduledExam.exam, // Include the populated exam details
//       examDate: scheduledExam.examDate,
//       examTime: scheduledExam.examTime,
//       password: scheduledExam.password
//     });
//   } catch (error) {
//     console.error('Error fetching exam by scheduled exam ID:', error);
//     res.status(500).json({ message: 'Failed to fetch exam by scheduled exam ID' });
//   }
// };

// Get an exam by its scheduled exam ID
exports.getExamByScheduledExamId = async (req, res) => {
  try {
    const scheduledExamId = req.params.id; // Get the scheduled exam ID from the request parameters

    // Find the scheduled exam by ID and populate the associated exam details
    const scheduledExam = await ScheduledExam.findById(scheduledExamId).populate('exam');

    if (!scheduledExam) {
      return res.status(404).json({ message: 'Scheduled exam not found' });
    }

    // Extract and return the exam details along with scheduled exam information
    res.status(200).json({
      scheduledExamId: scheduledExam._id,
      exam: {
        ...scheduledExam.exam._doc, // Spread the exam document
        duration: scheduledExam.exam.duration // Include the exam duration
      },
      examDate: scheduledExam.examDate,
      examTime: scheduledExam.examTime,
      password: scheduledExam.password
    });
  } catch (error) {
    console.error('Error fetching exam by scheduled exam ID:', error);
    res.status(500).json({ message: 'Failed to fetch exam by scheduled exam ID' });
  }
};



// // Get questions for a specific exam by ID and randomize the order
// exports.getExamQuestions = async (req, res) => {
//   try {
//     const { examId } = req.params;

//     // Fetch the exam by ID
//     const exam = await Exam.findById(examId);
//     if (!exam) {
//       return res.status(404).json({ message: 'Exam not found' });
//     }

//     // Helper function to shuffle an array
//     const shuffleArray = (array) => {
//       for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]]; // Swap elements
//       }
//       return array;
//     };

//     // Helper function to shuffle options within each question
//     const shuffleOptions = (question) => {
//       const shuffledOptions = shuffleArray(question.options);
//       return { ...question, options: shuffledOptions };
//     };

//     // Randomize the questions and shuffle options within each question
//     const randomizedQuestions = shuffleArray(exam.questions.map(shuffleOptions));

//     // Send back the exam duration and randomized questions
//     res.status(200).json({
//       duration: exam.duration,
//       questions: randomizedQuestions
//     });
//   } catch (error) {
//     console.error('Error fetching exam questions:', error);
//     res.status(500).json({ message: 'Failed to fetch exam questions' });
//   }
// };

