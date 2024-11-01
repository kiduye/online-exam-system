const Exam = require('../models/examModel'); // Adjust the path as needed
const Question = require('../models/questionModel'); // Adjust the path as needed
const ScheduledExam = require('../models/scheduleModel'); // Assuming you have a ScheduledExam model

exports.createExam = async (req, res) => {
  try {
    // Get the department from the authenticated user
    const department = req.user.department.id; // Use department ID

    // Destructure title, description, and duration (in hours) from the request body
    const { title, description, duration } = req.body;

    // Validate title, department, and duration presence
    if (!title || !department || !duration) {
      return res.status(400).json({ message: 'Title, department, and duration are required' });
    }

    // Convert duration from hours to minutes
    const durationInMinutes = parseFloat(duration) * 60;

    // Fetch questions from the same department as the current user
    const questions = await Question.find({ department });

    // Check if any questions were found
    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for the specified department' });
    }

    // Create a new Exam instance
    const newExam = new Exam({
      title,
      description,
      department,
      questions: questions.map(question => question._id), // Populate with question IDs
      duration: durationInMinutes // Store duration in minutes
    });

    // Save the new exam to the database
    await newExam.save();

    // Respond with the created exam
    res.status(201).json(newExam);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: error.message });
  }
};



// Controller to get exams for the authenticated user's department
// Controller to get exams for the authenticated user's department
exports.getExams = async (req, res) => {
  try {
    const department = req.user.department.id; // Use department ID

    // Fetch exams that belong to the department and populate questions
    const exams = await Exam.find({ department }).populate('questions');

    // Check if any exams were found
    if (exams.length === 0) {
      return res.status(404).json({ message: 'No exams found for this department' });
    }

    // Convert duration from minutes to hours before sending response
    const examsWithDurationInHours = exams.map(exam => ({
      ...exam._doc,  // Spread exam document properties
      duration: exam.duration / 60  // Convert duration to hours
    }));

    // Respond with exams with the duration in hours
    res.status(200).json(examsWithDurationInHours);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to get a single exam by ID
exports.getExamById = async (req, res) => {
  try {
    const departmentId = req.user.department._id || req.user.department.id; // Ensure department ID is extracted correctly

    // Find the exam by ID and department and populate questions
    const exam = await Exam.findOne({ _id: req.params.id, department: departmentId }).populate('questions');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found or you do not have access to this exam.' });
    }

    // Convert duration from minutes to hours before sending response
    const examWithDurationInHours = {
      ...exam._doc,  // Spread exam document properties
      duration: exam.duration / 60  // Convert duration to hours
    };

    // Respond with the exam and its questions, with duration in hours
    res.status(200).json(examWithDurationInHours);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ message: error.message });
  }
};




// Get all exams for the user's department
exports.getAllExams = async (req, res) => {
  try {
    const department = req.user.department._id; // Get the department from the authenticated user
    
    const exams = await Exam.find({ department }).populate('questions');
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controller to fetch exams for the current admin's department
exports.getAdminExams = async (req, res) => {
  try {
    const department = req.user.department.id; // Use department ID from the authenticated admin
    const isAdmin = req.user.role === 'admin'; // Check if the user is an admin

    // Ensure the user is an admin before fetching exams
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Fetch all exams that belong to the admin's department
    const exams = await Exam.find({ department }).populate('questions');

    // Check if any exams were found for the department
    if (exams.length === 0) {
      return res.status(404).json({ message: 'No exams found for your department.' });
    }

    // Convert duration from minutes to hours before sending response
    const examsWithDurationInHours = exams.map(exam => ({
      ...exam._doc, // Spread the exam document properties
      duration: exam.duration / 60 // Convert duration to hours
    }));

    // Send the exams back in the response
    res.status(200).json(examsWithDurationInHours);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: error.message });
  }
};


exports.fetchExamQuestions = async (examId) => {
  try {
    const response = await Api.get(`/exams/${examId}/questions`); // Adjust API endpoint as needed
    setQuestions(response.data); // Assuming you have a state to store questions
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    setError('Failed to fetch exam questions'); // Set error state to display
  }
};


// Get questions for a specific exam by ID and randomize the order
exports.getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;
    console.log('Received scheduled examId:', examId); // Debugging line

    // Check if examId is provided
    if (!examId) {
      return res.status(400).json({ message: 'Missing examId' });
    }

    // Ensure the current user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied: Only students can access exam questions.' });
    }

    // Get the student's department from req.user (set in the authMiddleware)
    const currentStudentDepartment = req.user.department;

    // Fetch the scheduled exam by ID
    const scheduledExam = await ScheduledExam.findById(examId);
    if (!scheduledExam) {
      return res.status(404).json({ message: 'Scheduled exam not found' });
    }

    // Fetch the exam using the exam ID from the scheduled exam
const exam = await Exam.findById(scheduledExam.exam);
if (!exam) {
  return res.status(404).json({ message: 'Exam not found' });
}

// Log departments for debugging
console.log('Current student department:', currentStudentDepartment);
console.log('Exam department:', exam.department);

// Check if the current student's department matches the exam's department
if (exam.department.toString() !== currentStudentDepartment.toString()) {
  return res.status(403).json({ message: 'Access denied: You do not belong to the same department as this exam.' });
}


    // Helper function to shuffle an array
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    };

    // Helper function to shuffle options within each question
    const shuffleOptions = (question) => {
      const shuffledOptions = shuffleArray(question.options);
      return { ...question, options: shuffledOptions };
    };

    // Randomize the questions and shuffle options within each question
    const randomizedQuestions = shuffleArray(exam.questions.map(shuffleOptions));

    // Send back the exam duration and randomized questions
    res.status(200).json({
      duration: exam.duration,
      questions: randomizedQuestions
    });
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    res.status(500).json({ message: 'Failed to fetch exam questions' });
  }
};


///



// exports.getExamQuestions = async (req, res) => {
//   try {
//     const { examId } = req.params; // Ensure this matches your route
//     console.log(`Exam ID received: ${examId}`); // Log the exam ID

//     // Fetch the exam by ID and populate the associated questions
//     const exam = await Exam.findById(examId).populate('questions');
    
//     console.log(`Exam found: ${JSON.stringify(exam)}`); // Log the fetched exam

//     if (!exam) {
//       return res.status(404).json({ message: 'Exam not found' });
//     }

//     // Return the exam's questions and duration (if necessary)
//     res.status(200).json({ questions: exam.questions, duration: exam.duration });
//   } catch (error) {
//     console.error('Error fetching exam questions:', error); // Log the error details
//     res.status(500).json({ message: 'Failed to retrieve exam questions', error });
//   }
// };


// Controller to update an existing exam
exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params; // Exam ID from URL params
    const department = req.user.department.id; // Use department ID from the authenticated user
    const { title, description, questions, duration } = req.body; // New exam details

    // Find the exam by ID and ensure it belongs to the department
    const exam = await Exam.findOne({ _id: id, department });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found or not authorized to update this exam' });
    }

    // Update exam fields
    if (title) exam.title = title;
    if (description) exam.description = description;
    if (duration) exam.duration = duration; // Update the duration if provided
    if (questions) {
      // Validate if all the questions belong to the department
      const validQuestions = await Question.find({ _id: { $in: questions }, department });
      if (validQuestions.length !== questions.length) {
        return res.status(400).json({ message: 'Some questions do not belong to your department' });
      }
      exam.questions = questions;
    }

    // Save the updated exam
    await exam.save();

    // Respond with the updated exam
    res.status(200).json(exam);
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ message: error.message });
  }
};


// Controller to remove a question from an exam
exports.removeQuestionFromExam = async (req, res) => {
    const { examId, questionId } = req.params;

    try {
        // Find the exam by examId
        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Check if the question exists in the exam
        const questionIndex = exam.questions.findIndex((q) => q.toString() === questionId);

        if (questionIndex === -1) {
            return res.status(404).json({ message: 'Question not found in the exam' });
        }

        // Remove the question from the exam's questions array
        exam.questions.splice(questionIndex, 1);

        // Save the updated exam
        await exam.save();

        res.status(200).json({ message: 'Question removed from the exam successfully', exam });
    } catch (error) {
        console.error('Error removing question from exam:', error);
        res.status(500).json({ message: 'Server error, could not remove question from exam' });
    }
};


// Controller to delete an exam
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params; // Exam ID from URL params
    const department = req.user.department.id; // Use department ID from the authenticated user

    // Find the exam by ID and ensure it belongs to the department
    const exam = await Exam.findOne({ _id: id, department });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found or not authorized to delete this exam' });
    }

    // Delete the exam using deleteOne
    await Exam.deleteOne({ _id: id });

    // Respond with a success message
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ message: error.message });
  }
};