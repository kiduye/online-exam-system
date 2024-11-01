import React, { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons for edit and delete
import Api from '../../api/axiosInstance'; // Your Axios instance
import CreateExamModal from './CreateExamModal'; // Import the Create Exam Modal

const ExamManagementPage = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for the create modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for the view modal
    const [selectedExam, setSelectedExam] = useState(null); // Store selected exam

    // Fetch created exams
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await Api.get('/exams/department'); // Adjust API endpoint as needed
                // Process exams to convert duration from minutes to hours
                const processedExams = response.data.map(exam => ({
                    ...exam,
                    duration: (exam.duration / 60).toFixed(2), // Convert minutes to hours and format to 2 decimal places
                }));
                setExams(processedExams);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching exams:', error);
                setError('Failed to load exams.');
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    // Handle delete exam
    const handleDeleteExam = async (examId) => {
        try {
            await Api.delete(`/exams/${examId}`); // Adjust API endpoint as needed
            setExams(exams.filter((exam) => exam._id !== examId));
        } catch (error) {
            console.error('Error deleting exam:', error);
            alert('Failed to delete exam. Please try again.');
        }
    };

    // Handle delete question from exam
    const handleDeleteQuestion = async (questionId) => {
        try {
            const updatedExam = { ...selectedExam };
            updatedExam.questions = updatedExam.questions.filter((q) => q._id !== questionId);
            await Api.put(`/exams/${selectedExam._id}`, updatedExam); // Adjust the API endpoint
            setSelectedExam(updatedExam); // Update selected exam after deletion
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Failed to delete question. Please try again.');
        }
    };

    // Open the view exam modal and load selected exam's details
    const handleViewExam = async (examId) => {
        try {
            const response = await Api.get(`/exams/exams/${examId}`); // Fetch specific exam details (adjusted endpoint)
            setSelectedExam(response.data);
            setIsViewModalOpen(true);
        } catch (error) {
            console.error('Error fetching exam:', error);
            alert('Failed to load exam details.');
        }
    };

    // Filter exams based on search term
    const filteredExams = useMemo(() => {
        return exams.filter((exam) =>
            exam.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [exams, searchTerm]);


   // Function to drop a question from the exam
    const handleDropQuestion = async (questionId) => {
        try {
            const response = await Api.put(`/exams/exams/${selectedExam._id}/remove-question/${questionId}`); // Endpoint to drop a question

            if (response.status === 200) {
                // Update the exam's question list in the frontend after successful removal
                setSelectedExam((prevExam) => ({
                    ...prevExam,
                    questions: prevExam.questions.filter((q) => q._id !== questionId),
                }));
            }
        } catch (error) {
            console.error('Failed to drop the question', error);
            alert('Failed to drop the question.');
        }
    };


    return (
        <div className="container mx-auto p-4">
            {/* Sticky header */}
            <div className="sticky top-0 bg-white z-10 shadow-md p-4 mb-4">
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => setIsCreateModalOpen(true)} // Open create exam modal
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Create Exam
                    </button>
                    <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded-md w-1/4"
                    />
                </div>

                {/* Display error message below the header */}
                {error && <p className="text-red-500">{error}</p>}
            </div>

            {/* Display exams below the header */}
            {loading ? (
                <p>Loading exams...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredExams.map((exam) => (
                        <div
                            key={exam._id}
                            className="bg-white shadow-lg rounded-lg p-4 relative cursor-pointer"
                            onClick={() => handleViewExam(exam._id)} // Open view modal when exam card is clicked
                        >
                            <h3 className="text-lg font-semibold">{exam.title}</h3>
                            <p className="text-gray-600">{exam.description}</p>
                            {/* Display the duration with the "hour" suffix */}
                            <p className="text-gray-600">{exam.duration} hour{exam.duration !== '1.00' && 's'}</p>
                            <div className="absolute bottom-4 right-4 flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteExam(exam._id);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete Exam"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Exam Modal */}
            {isCreateModalOpen && (
                <CreateExamModal onClose={() => setIsCreateModalOpen(false)} />
            )}

        {/* View Exam Modal */}
{isViewModalOpen && selectedExam && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{selectedExam.title}</h2>
            <p>{selectedExam.description}</p>

            <ul className="mt-4">
                {selectedExam.questions && selectedExam.questions.length > 0 ? (
                    selectedExam.questions.map((question) => {
                        console.log(question); // Log the question object
                        return (
                            <li key={question._id} className="flex justify-between items-center mb-2">
                                {/* Check for question.text */}
                                <span>{question.questionText ? question.questionText : "No question text available"}</span> {/* Display question text */}
                                <button
                                            onClick={() => handleDropQuestion(question._id)} // Drop the question
                                            className="text-yellow-500 hover:text-yellow-700"
                                            title="Drop Question"
                                        >
                                            Drop
                                        </button>
                            </li>
                        );
                    })
                ) : (
                    <p>No questions available for this exam.</p>
                )}
            </ul>

            <div className="flex justify-end mt-4">
                <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default ExamManagementPage;
