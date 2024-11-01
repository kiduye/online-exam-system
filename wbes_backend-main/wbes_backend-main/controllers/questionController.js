
const Question = require('../models/questionModel');
const mongoose = require('mongoose');
const Instructor = require('../models/users/instructorModel');
const Course = require('../models/addCourseNameModel'); // Assuming you have a Course model
const fs = require('fs');
const csvParser = require('csv-parser');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const sanitizeHtml = require('sanitize-html'); // Use sanitize-html for sanitizing rich text input

// Helper function to parse CSV file
async function parseCSV(filePath) {
  const questions = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Ensure both questionText and answer are present
        if (row.questionText && row.answer) {
          // Clean the question text and answer to add spaces
          const questionText = row.questionText
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase-uppercase transitions
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();

          const answer = row.answer
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase-uppercase transitions
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();

          questions.push({
            questionText,
            options: row.options ? row.options.split(',').map(opt => opt.trim()) : [], // Trim options and handle empty cases
            answer,
          });
        }
      })
      .on('end', () => {
        resolve(questions);
      })
      .on('error', reject);
  });
}




// Helper function to parse PDF file
async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const questions = [];

  return pdf(dataBuffer).then((data) => {
    const lines = data.text.split('\n');
    lines.forEach((line) => {
      // Clean line by adding spaces between lowercase and uppercase letters
      let cleanedLine = line.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between lowercase-uppercase transitions

      // Handle cases where punctuation follows a word without space
      cleanedLine = cleanedLine.replace(/([a-zA-Z])([?!.])/g, '$1 $2');  // Add space before punctuation marks

      // Extract question, options, and answer
      const [questionText, optionsStr, answer] = cleanedLine.split('|').map(s => s?.trim());

      if (questionText && answer) {
        questions.push({
          questionText: questionText.replace(/\s+/g, ' ').trim(), // Remove extra spaces
          options: optionsStr ? optionsStr.split(',').map(opt => opt.trim()) : [],
          answer: answer.trim(),
        });
      }
    });
    return questions;
  });
}




// Helper function to parse DOCX file
async function parseDOCX(filePath) {
  const questions = [];
  const result = await mammoth.extractRawText({ path: filePath });

  const lines = result.value.split('\n');
  lines.forEach((line) => {
    // Clean line by adding spaces between lowercase and uppercase letters
    let cleanedLine = line.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between lowercase-uppercase transitions

    // Handle cases where punctuation follows a word without space
    cleanedLine = cleanedLine.replace(/([a-zA-Z])([?!.])/g, '$1 $2');  // Add space before punctuation marks

    // Extract question, options, and answer
    const [questionText, optionsStr, answer] = cleanedLine.split('|').map(s => s?.trim());

    if (questionText && answer) {
      questions.push({
        questionText: questionText.replace(/\s+/g, ' ').trim(), // Remove extra spaces
        options: optionsStr ? optionsStr.split(',').map(opt => opt.trim()) : [],
        answer: answer.trim(),
      });
    }
  });

  return questions;
}





// Helper function to bulk insert questions into MongoDB
async function bulkInsertQuestions(questions, instructorId, courseId, departmentId) {
  const questionDocs = questions.map((q) => ({
    ...q,
    instructor: instructorId,
    course: courseId,
    department: departmentId,
  }));

  try {
    await Question.insertMany(questionDocs);
  } catch (error) {
    throw new Error('Error inserting questions: ' + error.message);
  }
}

// // Bulk upload questions
// exports.uploadQuestions = async (req, res) => {
//   console.log(req.file);  // Log the file object for debugging
//   const { courseId } = req.body;
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   // Use the instructor and department from the authenticated user
//   const instructorId = req.user._id;
//   const departmentId = req.user.department._id;

//   // Ensure the course belongs to the authenticated instructor
//   const instructorCourses = req.user.courses.map((course) => course._id.toString());
//   if (!instructorCourses.includes(courseId)) {
//     return res.status(403).json({ error: 'Access denied: You can only upload questions for courses assigned to you.' });
//   }

//   let questions = [];
//   try {
//     if (file.mimetype === 'text/csv') {
//       questions = await parseCSV(file.path);
//     } else if (file.mimetype === 'application/pdf') {
//       questions = await parsePDF(file.path);
//     } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//       questions = await parseDOCX(file.path);
//     }

//     // If no valid questions were parsed, return an error
//     if (questions.length === 0) {
//       return res.status(400).json({ error: 'No valid questions found in the file.' });
//     }

//     // Bulk insert into MongoDB
//     await bulkInsertQuestions(questions, instructorId, courseId, departmentId);

//     res.status(200).json({ message: 'Questions uploaded successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error processing file: ' + error.message });
//   }
// };


// Bulk upload questions
exports.uploadQuestions = async (req, res) => {
  const instructorId = req.user._id; // Get the instructor ID from the authenticated user

  try {
    // Find the instructor by ID and populate the 'courses' field
    const instructor = await Instructor.findById(instructorId).populate('courses');

    if (!instructor || instructor.courses.length === 0) {
      return res.status(404).json({ msg: 'Instructor or courses not found' });
    }

    // Get the courseId from the request body
    const { courseId } = req.body;

    // Check if the instructor is assigned to the provided course
    const assignedCourse = instructor.courses.find(course => course._id.toString() === courseId);

    if (!assignedCourse) {
      return res.status(403).json({ msg: 'Access denied: You can only upload questions for courses assigned to you.' });
    }

    // Ensure that a file is uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // File parsing logic based on file type (CSV, PDF, DOCX)
    let questions = [];
    if (req.file.mimetype === 'text/csv') {
      questions = await parseCSV(req.file.path); // Parse CSV file
    } else if (req.file.mimetype === 'application/pdf') {
      questions = await parsePDF(req.file.path); // Parse PDF file
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      questions = await parseDOCX(req.file.path); // Parse DOCX file
    }

    // Validate that questions were parsed correctly
    if (questions.length === 0) {
      return res.status(400).json({ msg: 'No valid questions found in the file.' });
    }

    // Bulk insert questions into the database
    await bulkInsertQuestions(questions, instructorId, assignedCourse._id, instructor.department._id);

    // Respond with success message
    res.status(200).json({ msg: 'Questions uploaded successfully' });

  } catch (err) {
    console.error('Error uploading questions:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// // Create a new question
// exports.createQuestion = async (req, res) => {
//   const instructorId = req.user._id; // Instructor ID from authenticated user

//   try {
//     // Find the instructor by ID and populate department and courses
//     const instructor = await Instructor.findById(instructorId).populate('department').populate('courses');

//     // Ensure the instructor exists and has a department and courses
//     if (!instructor || !instructor.department || instructor.courses.length === 0) {
//       return res.status(404).json({ msg: 'Instructor, department, or courses not found' });
//     }

//     const { questionText, options, answer, courseId } = req.body;

//     // Ensure necessary fields are provided
//     if (!questionText || !options || !answer) {
//       return res.status(400).json({ msg: 'Please provide question text, options, and the correct answer' });
//     }

//     // Validate that the options array contains at least two choices
//     if (options.length < 2) {
//       return res.status(400).json({ msg: 'At least two options must be provided' });
//     }

//     // Determine the course to assign the question to (use courseId if provided, otherwise use the first course)
//     const assignedCourse = courseId ? instructor.courses.find(course => course._id.toString() === courseId) : instructor.courses[0];

//     if (!assignedCourse) {
//       return res.status(400).json({ msg: 'Invalid course selection' });
//     }

//     // Create a new question with the instructor's department and selected course
//     const newQuestion = new Question({
//       questionText,
//       options,
//       answer,
//       instructor: instructor._id, // Store the instructor's ID
//       course: assignedCourse._id,  // Use the selected course
//       department: instructor.department._id // Store the instructor's department
//     });

//     // Save the new question to the database
//     await newQuestion.save();

//     // Respond with the created question
//     res.status(201).json({
//       msg: 'Question created successfully',
//       question: newQuestion
//     });

//   } catch (err) {
//     console.error('Error creating question:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


// exports.createQuestion = async (req, res) => {
//   const instructorId = req.user._id; // Instructor ID from authenticated user

//   try {
//     // Find the instructor by ID and populate department and courses
//     const instructor = await Instructor.findById(instructorId)
//       .populate('department')
//       .populate('courses');

//     // Ensure the instructor exists and has a department and courses
//     if (!instructor || !instructor.department || instructor.courses.length === 0) {
//       return res.status(404).json({ msg: 'Instructor, department, or courses not found' });
//     }

//     const { questionText, options, answer, courseId } = req.body;

//     // Ensure necessary fields are provided
//     if (!questionText || !options || !answer) {
//       return res.status(400).json({ msg: 'Please provide question text, options, and the correct answer' });
//     }

//     // Validate that the options array contains at least two choices
//     if (options.length < 2) {
//       return res.status(400).json({ msg: 'At least two options must be provided' });
//     }

//     // Check if instructor has more than one course
//     if (instructor.courses.length === 1) {
//       // If only one course is assigned, automatically select that course
//       const assignedCourse = instructor.courses[0];
//       await createNewQuestion(instructor, assignedCourse, { questionText, options, answer }, res);
//     } else {
//       // If more than one course is assigned, courseId must be provided in the request
//       if (!courseId) {
//         return res.status(400).json({ msg: 'Please select a course' });
//       }

//       // Validate that the courseId belongs to one of the instructor's courses
//       const assignedCourse = instructor.courses.find(course => course._id.toString() === courseId);

//       if (!assignedCourse) {
//         return res.status(400).json({ msg: 'Invalid course selection' });
//       }

//       // Proceed to create the question for the selected course
//       await createNewQuestion(instructor, assignedCourse, { questionText, options, answer }, res);
//     }

//   } catch (err) {
//     console.error('Error creating question:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // Helper function to create a new question and save it to the database
// async function createNewQuestion(instructor, course, questionData, res) {
//   try {
//     const { questionText, options, answer } = questionData;

//     const newQuestion = new Question({
//       questionText,
//       options,
//       answer,
//       instructor: instructor._id,
//       course: course._id,
//       department: instructor.department._id
//     });

//     // Save the new question to the database
//     await newQuestion.save();

//     // Respond with the created question
//     res.status(201).json({
//       msg: 'Question created successfully',
//       question: newQuestion
//     });

//   } catch (err) {
//     console.error('Error saving question:', err);
//     res.status(500).json({ msg: 'Error saving question to the database' });
//   }
// }



exports.createQuestion = async (req, res) => {
  const instructorId = req.user._id; // Instructor ID from authenticated user

  try {
    // Find the instructor by ID and populate department and courses
    const instructor = await Instructor.findById(instructorId)
      .populate('department')
      .populate('courses');

    // Ensure the instructor exists and has a department and courses
    if (!instructor || !instructor.department || instructor.courses.length === 0) {
      return res.status(404).json({ msg: 'Instructor, department, or courses not found' });
    }

    const { questionText, options, answer, courseId } = req.body;

    // Ensure necessary fields are provided
    if (!questionText || !options || !answer) {
      return res.status(400).json({ msg: 'Please provide question text, options, and the correct answer' });
    }

    // Validate that the options array contains at least two choices
    if (options.length < 2) {
      return res.status(400).json({ msg: 'At least two options must be provided' });
    }

    // Sanitize the rich text inputs to prevent XSS attacks
    const sanitizedQuestionText = sanitizeHtml(questionText, { allowedTags: [], allowedAttributes: {} });
    const sanitizedOptions = options.map(opt => sanitizeHtml(opt, { allowedTags: [], allowedAttributes: {} }), ); // Sanitize each option
    const sanitizedAnswer = sanitizeHtml(answer, );

    // Check if instructor has more than one course
    if (instructor.courses.length === 1) {
      const assignedCourse = instructor.courses[0];
      await createNewQuestion(instructor, assignedCourse, { sanitizedQuestionText, sanitizedOptions, sanitizedAnswer }, res);
    } else {
      if (!courseId) {
        return res.status(400).json({ msg: 'Please select a course' });
      }

      const assignedCourse = instructor.courses.find(course => course._id.toString() === courseId);

      if (!assignedCourse) {
        return res.status(400).json({ msg: 'Invalid course selection' });
      }

      await createNewQuestion(instructor, assignedCourse, { sanitizedQuestionText, sanitizedOptions, sanitizedAnswer }, res);
    }

  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper function to create and save the question
async function createNewQuestion(instructor, course, questionData, res) {
  try {
    const { sanitizedQuestionText, sanitizedOptions, sanitizedAnswer } = questionData;

    const newQuestion = new Question({
      questionText: sanitizedQuestionText ,
      options: sanitizedOptions,
      answer: sanitizedAnswer,
      instructor: instructor._id,
      course: course._id,
      department: instructor.department._id
    });

    // Save the new question to the database
    await newQuestion.save();

    // Respond with the created question
    res.status(201).json({
      msg: 'Question created successfully',
      question: newQuestion
    });

  } catch (err) {
    console.error('Error saving question:', err);
    res.status(500).json({ msg: 'Error saving question to the database' });
  }
}


// Get questions by course ID
// Get questions by course ID
exports.getQuestionsByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const questions = await Question.getQuestionsByCourseId(courseId);
    
    // Sanitize questions
    const sanitizedQuestions = questions.map(question => ({
      _id: question._id,
      questionText: sanitizeHtml(question.questionText, { allowedTags: [], allowedAttributes: {} }), // Sanitize question text
      options: question.options.map(option => sanitizeHtml(option, { allowedTags: [], allowedAttributes: {} })), // Sanitize each option
      answer: sanitizeHtml(question.answer, { allowedTags: [], allowedAttributes: {} }), // Sanitize answer
      instructor: question.instructor, // Instructor info (name)
      course: question.course, // Course info (name)
      department: question.department // Department info (name)
    }));

    res.status(200).json(sanitizedQuestions);
  } catch (error) {
    console.error('Error fetching questions by course ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the questions' });
  }
};

// Get questions by course name
exports.getQuestionsByCourseName = async (req, res) => {
  const { courseName } = req.params;

  try {
    const course = await Course.findOne({ name: { $regex: new RegExp(`^${courseName.trim()}$`, 'i') } });
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    const questions = await Question.find({ course: course._id }).populate('instructor department');

    const sanitizedQuestions = questions.map(question => ({
      ...question._doc,
      text: sanitizeHtml(question.text, { allowedTags: [], allowedAttributes: {} }),
      options: question.options.map(option => sanitizeHtml(option), { allowedTags: [], allowedAttributes: {} }),
      answer: sanitizeHtml(question.answer, { allowedTags: [], allowedAttributes: {} })
    }));

    res.status(200).json(sanitizedQuestions);
  } catch (error) {
    console.error('Error fetching questions by course name:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get questions by instructor name
exports.getQuestionsByInstructorName = async (req, res) => {
  const { instructorName } = req.params;

  try {
    // Find instructor by name
    const instructor = await Instructor.findOne({ 
      name: { $regex: new RegExp(`^${instructorName.trim()}$`, 'i') } 
    });

    if (!instructor) {
      return res.status(404).json({ msg: 'Instructor not found' });
    }

    // Fetch questions by instructor and populate fields
    const questions = await Question.find({ instructor: instructor._id })
                                    .populate('instructor department');

    // Sanitize questions before sending response
    const sanitizedQuestions = questions.map(question => ({
      ...question._doc,
      text: sanitizeHtml(question.text, { allowedTags: [], allowedAttributes: {} }),  // Sanitize question text
      options: question.options.map(option => sanitizeHtml(option), { allowedTags: [], allowedAttributes: {} }),  // Sanitize each option
      answer: sanitizeHtml(question.answer, { allowedTags: [], allowedAttributes: {} })  // Sanitize the answer
    }));

    res.status(200).json(sanitizedQuestions);
  } catch (error) {
    console.error('Error fetching questions by instructor name:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// // Get all questions for a specific instructor
// exports.getAllQuestionsForInstructor = async (req, res) => {
//   const instructorId = req.user._id;
//   console.log('Instructor ID:', instructorId); // Log to check

//   try {
//     const questions = await Question.find({ instructor: instructorId })
//       .populate('instructor', 'name')
//       .populate('course', 'name')
//       .populate('department', 'name');

//     if (!questions.length) {
//       return res.status(404).json({ message: 'No questions found for this instructor' });
//     }

//     res.status(200).json(questions);
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while fetching the questions' });
//   }
// };

// Get all questions for a specific instructor
exports.getAllQuestionsForInstructor = async (req, res) => {
  const instructorId = req.user._id;
  console.log('Instructor ID:', instructorId); // Log to check

  try {
    // Fetch questions for the instructor
    const questions = await Question.find({ instructor: instructorId })
      .populate('instructor', 'name')
      .populate('course', 'name')
      .populate('department', 'name');

    // Check if questions exist
    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this instructor' });
    }

    // Strip HTML tags from questionText, options, and answer
    const sanitizedQuestions = questions.map(question => ({
      _id: question._id,
      questionText: sanitizeHtml(question.questionText, { allowedTags: [], allowedAttributes: {} }), // Strips HTML from questionText
      options: question.options.map(option => sanitizeHtml(option, { allowedTags: [], allowedAttributes: {} })), // Strips HTML from each option
      answer: sanitizeHtml(question.answer, { allowedTags: [], allowedAttributes: {} }), // Strips HTML from answer
      instructor: question.instructor, // Instructor info (name)
      course: question.course, // Course info (name)
      department: question.department // Department info (name)
    }));

    // Send the sanitized questions in the response
    res.status(200).json(sanitizedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'An error occurred while fetching the questions' });
  }
};

// Get all questions for a specific department (for department boards)
// Get all questions for a specific department (for department boards)

exports.getAllQuestionsForDepartment = async (req, res) => {
  try {
    // Log the user object to debug
    console.log('Request User:', req.user);

    // Extract the department ID and convert it to string
    const departmentId = req.user.department.id.toString();

    // Ensure the departmentId exists
    if (!departmentId) {
      return res.status(400).json({ error: 'Department ID is missing from the request' });
    }

    console.log('Department ID:', departmentId);

    // Validate the department ID as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ error: 'Invalid department ID format' });
    }

    // Convert departmentId to ObjectId
    const validDepartmentId = new mongoose.Types.ObjectId(departmentId);

    console.log('Querying questions for department with ID:', validDepartmentId);

    // Fetch all questions for the department
    const questions = await Question.find({ department: validDepartmentId })
      .populate('instructor', 'name')   // Populate instructor's name
      .populate('course', 'name')       // Populate course's name
      .populate('department', 'name');  // Populate department's name

    // Log the number of questions retrieved
    console.log(`Number of questions found for department ${validDepartmentId}:`, questions.length);

    // If no questions found, return a 404
    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this department' });
    }

    // Respond with the questions
    res.status(200).json(questions);

  } catch (error) {
    console.error('Error fetching questions for department:', error.message);
    res.status(500).json({ 
      error: 'An error occurred while fetching the questions', 
      details: error.message 
    });
  }
};




// Update a question by ID for the logged-in instructor
exports.updateQuestion = async (req, res) => {
  const instructorId = req.user._id; // or req.user.instructorId
  const { id } = req.params;
  const { questionText, options, answer } = req.body;

  console.log('Instructor ID:', instructorId);
  console.log('Question ID:', id);

  try {
    const question = await Question.findOne({ _id: id, instructor: instructorId });

    console.log('Question found:', question);

    if (!question) {
      return res.status(404).json({ error: 'Question not found or not owned by the instructor' });
    }

    question.questionText = questionText || question.questionText;
    question.options = options || question.options;
    question.answer = answer || question.answer;

    await question.save();
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the question' });
  }
};



// Delete a question by ID for the logged-in instructor
exports.deleteQuestion = async (req, res) => {
  const instructorId = req.user._id; // or req.user.instructorId
  const { id } = req.params;

  console.log('Instructor ID:', instructorId);
  console.log('Question ID:', id);

  try {
    const question = await Question.findOneAndDelete({ _id: id, instructor: instructorId });

    console.log('Question deleted:', question);

    if (!question) {
      return res.status(404).json({ error: 'Question not found or not owned by the instructor' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the question' });
  }
};


// Get questions filtered by instructor or course
exports.getFilteredQuestions = async (req, res) => {
  try {
    const department = req.user.department._id; // Get the department from the authenticated user
    const { instructorName, courseName } = req.query; // Get filter criteria from query parameters

    // Build the query object
    const query = { department };

    if (instructorName) {
      query['instructor.name'] = instructorName;
    }

    if (courseName) {
      query['course.name'] = courseName;
    }

    // Fetch questions based on the constructed query
    const questions = await Question.find(query);

    res.status(200).json(questions);
    console.log(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// // Controller to get a question by its ID


// // Helper function to shuffle an array
// const shuffleArray = (array) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };

// // Controller to get a question by its ID
// exports.getQuestionById = async (req, res) => {
//   const { questionId } = req.params;
// // Validate if questionId is a valid ObjectId

//   try {
//     const question = await Question.findById(questionId);
    
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }

//     // Shuffle the options if they exist and are in array format
//     if (question.options && Array.isArray(question.options)) {
//       question.options = shuffleArray(question.options);
//     } else {
//       console.warn(`Question with ID ${questionId} has no options or options are not formatted correctly.`);
//     }
    
//     res.status(200).json(question);
//   } catch (error) {
//     console.error('Error fetching the question:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Controller to get a question by its ID
exports.getQuestionById = async (req, res) => {
  const { questionId } = req.params;

    console.log('Received questionId:', questionId); // Log the ID
  // Validate if questionId is a valid ObjectId
 

  // Validate if questionId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ message: 'Invalid question ID format' });
  }

  try {
    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Shuffle the options if they exist and are in array format
    if (question.options && Array.isArray(question.options)) {
      question.options = shuffleArray(question.options);
    } else {
      console.warn(`Question with ID ${questionId} has no options or options are not formatted correctly.`);
    }
    
    res.status(200).json(question);
  } catch (error) {
    console.error('Error fetching the question:', error);
    res.status(500).json({ message: 'Server error' });
  }
};