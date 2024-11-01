import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Api from '../../api/axiosInstance'; // Adjust the path according to your project structure

const QuestionDetailModal = ({ isOpen, onClose, questions, onSelectQuestion }) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

   useEffect(() => {
    const fetchExams = async () => {
        try {
            const response = await Api.get('/exams/department'); // Adjust API endpoint as needed
            const processedExams = response.data.map(exam => ({
                ...exam,
                duration: (exam.duration / 60).toFixed(2),
            }));
            
            console.log('Fetched Exams:', processedExams); // Log the exams
            
            // Iterate over exams and log each exam's questions
            processedExams.forEach((exam, index) => {
                console.log(`Exam ${index + 1}:`, exam);
                console.log(`Questions for Exam ${index + 1}:`, exam.questions);
            });

            setExams(processedExams);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching exams:', error);
            setError('Failed to load exams.');
            setLoading(false);
        }
    };

    fetchExams();
}, []); // Only run on mount

const getQuestionStatus = (questionId) => {
    console.log('Checking status for question ID:', questionId); // Log the question ID

    // Update the logic to check each question's `id` in the exam
    const status = exams.some(exam => 
        exam.questions.some(question => question._id === questionId)
    );
    
    console.log(`Status for question ID ${questionId}:`, status); // Log the status
    return status;
};


    console.log('Questions prop:', questions); // Log questions prop

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-2/3 h-3/4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Questions for Selected Course</h2>
                    <button onClick={onClose} className="text-red-500">Close</button>
                </div>
                
                <div className="mb-4">
                    {loading ? (
                        <p>Loading exams...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : questions.length > 0 ? (
                        questions.map((question, index) => (
                            <div key={index} className="mb-4 border-b pb-2">
                                <p className="text-md font-bold">{question.questionText}</p>
                                <div className="mt-2">
                                    {question.options.map((option, idx) => (
                                        <div key={idx} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={question.answer === option}
                                                readOnly
                                            />
                                            <label>{option}</label>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={question.isSelected}
                                        onChange={() => onSelectQuestion(question._id)}
                                    />
                                    <label>Select this question</label>
                                </div>
                                <div className={`text-sm mt-2 ${getQuestionStatus(question._id) ? 'text-green-500' : 'text-red-500'}`}>
                                    {getQuestionStatus(question._id) ? 'Selected in previous exam' : 'Not selected in previous exam'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No questions available for this course.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

QuestionDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    questions: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            questionText: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(PropTypes.string),
            answer: PropTypes.string.isRequired,
            isSelected: PropTypes.bool.isRequired,
        })
    ).isRequired,
    onSelectQuestion: PropTypes.func.isRequired,
};

export default QuestionDetailModal;
