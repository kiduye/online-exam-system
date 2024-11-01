import React, { useState, useEffect } from 'react';
import Api from '../../api/axiosInstance'; // Your Axios instance
import QuestionListPage from '../common/questionListPage'; // Import the Question List Page component

const CreateExamModal = ({ onClose, user }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState(''); // Store hours separately
    const [minutes, setMinutes] = useState(''); // Store minutes separately
    const [durationText, setDurationText] = useState(''); // Store formatted duration text
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [department, setDepartment] = useState('');

    useEffect(() => {
        console.log("User object:", user); // Log user object to inspect department
        if (user && user.department) {
            setDepartment(user.department._id); // Set department ID from user object
        } else {
            console.error("User department information is not available");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const totalMinutes = (parseInt(hours || 0) * 60) + parseInt(minutes || 0); // Calculate total minutes
            const payload = {
                title,
                description,
                duration: totalMinutes, // Send the total duration in minutes
                questions: selectedQuestions, // No department here
            };
            console.log("Payload being sent:", payload); // Log the payload for debugging
            await Api.post('/exams', payload); // Adjust API endpoint as needed
            alert('Exam created successfully!');
            onClose(); // Close the modal after submission
        } catch (error) {
            console.error('Error creating exam:', error);
            alert('Failed to create exam. Please try again.');
        }
    };

    const handleSelectQuestion = (id) => {
        setSelectedQuestions((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((questionId) => questionId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    // Function to combine hours and minutes and format them into a readable string
    useEffect(() => {
        const h = parseInt(hours || 0);
        const m = parseInt(minutes || 0);
        let totalHours = h + (m / 60); // Divide minutes by 60 to convert to hours
        let formattedDuration = `${totalHours} hour${totalHours !== 1 ? 's' : ''}`; // Add "hour" or "hours"

        setDurationText(formattedDuration); // Update the state with the formatted duration
    }, [hours, minutes]); // Update whenever hours or minutes change

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white ml-60 mt-20 p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Create Exam</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border p-2 rounded-md w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border p-2 rounded-md w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Duration</label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                placeholder="Hours"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="border p-2 rounded-md w-full mr-2"
                                required
                            />
                            <span className="text-gray-700 mr-2">hr</span>
                            <input
                                type="number"
                                placeholder="Minutes"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                className="border p-2 rounded-md w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* Display the formatted duration with "hour" and "minute" */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Total Duration</label>
                        <p className="border p-2 rounded-md w-full bg-gray-100">{durationText}</p>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">Select Questions</h3>
                    <QuestionListPage onSelectQuestion={handleSelectQuestion} selectedQuestions={selectedQuestions} />

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Upload Exam
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExamModal;
