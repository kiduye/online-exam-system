const ExamResult = require('../models/examResultModel'); // Import ExamResult model
const ExamResponse = require('../models/examResponseModel'); // Import ExamResponse model
const Question = require('../models/questionModel'); // Import Question model
const Exam = require('../models/examModel'); // Import Exam model

// Create Exam Result
// Create Exam Result
const createExamResult = async (req, res) => {
    try {
        const { examResponseId } = req.params;

        // Find the exam response by ID and populate the examId
        const examResponse = await ExamResponse.findById(examResponseId).populate({
            path: 'examId',
            populate: {
                path: 'questions', // Populate the questions with their correct options
            },
        });

        if (!examResponse) {
            return res.status(404).json({ message: 'Exam response not found' });
        }

        console.log("Exam Response Retrieved: ", examResponse);

        // Get questions from the populated examId
        const questions = examResponse.examId.questions; // Array of question objects
        const totalQuestions = questions.length;

        console.log("Total Questions: ", totalQuestions);
        console.log("Questions: ", questions);

        // Calculate correct answers
        let correctAnswers = 0;

        // Loop through each response and compare it with the correct answer
        for (const response of examResponse.responses) {
            console.log("Response: ", response);

            // Find the corresponding question based on questionId
            const question = questions.find(q => q._id.equals(response.questionId));

            console.log("Matching Question: ", question);

            // Check if the question exists and if the selected option matches the correct answer
            if (question) {
                console.log(`Selected Option: ${response.selectedOption}, Correct Option: ${question.answer}`);
                if (question.answer === response.selectedOption) { 
                    correctAnswers++;
                }
            } else {
                console.warn(`Question not found for ID: ${response.questionId}`);
            }
        }

        // Calculate the score and percentage
        const score = correctAnswers; // Score is the number of correct answers
        const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

        console.log("Correct Answers: ", correctAnswers);
        console.log("Score: ", score);
        console.log("Percentage: ", percentage);

        // Define passing score (default 50%, but can be customized per exam if necessary)
        const passingScore = examResponse.examId.passingScore || 50;

        // Determine pass/fail status based on percentage and passing score
        const status = percentage >= passingScore ? 'Pass' : 'Fail';

        // Create a new exam result document
        const examResult = new ExamResult({
            studentId: examResponse.studentId,
            examId: examResponse.examId,
            examName: examResponse.examId.title, // Assuming examId has a title field
            score: score,
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswers,
            percentage: percentage,
            passingScore: passingScore, // Include the passing score
            status: status, // Include pass/fail status
            examDate: new Date(), // or use the date from the exam response if applicable
        });

        // Save the exam result
        await examResult.save();

        return res.status(201).json({ message: 'Exam result created successfully', examResult });
    } catch (error) {
        console.error('Error creating exam result:', error);
        return res.status(500).json({ message: 'Error creating exam result', error });
    }
};


// Read Exam Results
const getExamResults = async (req, res) => {
    try {
        const results = await ExamResult.find().populate('studentId examId'); // Populate student and exam details
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching exam results:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const getUserExamResults = async (req, res) => {
    try {
        const studentId = req.user.id; // Assuming req.user contains the logged-in student's ID

        // Debugging: Log the student ID and check if it's being passed correctly
        console.log('Fetching exam results for student ID:', studentId);

        // Fetch exam results for the current user
        const results = await ExamResult.find({ studentId }).populate('studentId examId');

        // Debugging: Log what the query returns
        console.log('Query results:', results);

        if (!results.length) {
            console.log('No exam results found for this user'); // Log if no results found
            return res.status(404).json({ message: 'No exam results found for this user' });
        }

        // Return results if found
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching exam results for the current user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




// Update Exam Result
const updateExamResult = async (req, res) => {
    const { id } = req.params; // Get the result ID from the request parameters
    const updates = req.body;

    try {
        const updatedResult = await ExamResult.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedResult) {
            return res.status(404).json({ message: 'Exam result not found' });
        }
        return res.status(200).json({ message: 'Exam result updated successfully', updatedResult });
    } catch (error) {
        console.error('Error updating exam result:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete Exam Result
const deleteExamResult = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedResult = await ExamResult.findByIdAndDelete(id);
        if (!deletedResult) {
            return res.status(404).json({ message: 'Exam result not found' });
        }
        return res.status(200).json({ message: 'Exam result deleted successfully' });
    } catch (error) {
        console.error('Error deleting exam result:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Export the controller functions
module.exports = {
    createExamResult,
    getExamResults,
    updateExamResult,
    deleteExamResult,
    getUserExamResults
};
