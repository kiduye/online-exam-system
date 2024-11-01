import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import Api from '../../api/axiosInstance'; // Import the Axios instance

const EditExamModal = ({ currentExam, exams, onClose, fetchScheduledExams }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00'); // Default time
  const [examId, setExamId] = useState('');
  const [examPassword, setExamPassword] = useState('');

  useEffect(() => {
    // Update the state when currentExam changes
    if (currentExam) {
      setSelectedDate(new Date(currentExam.examDate));
      setSelectedTime(currentExam.examTime || '09:00');
      setExamId(currentExam.exam || '');
      setExamPassword(currentExam.password || '');
    }
  }, [currentExam]);

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleExamChange = (e) => {
    const selectedExam = exams.find(exam => exam._id === e.target.value);
    if (selectedExam) {
      setExamId(selectedExam._id);
      setExamPassword(selectedExam.password);
    }
  };

  const handleEditSubmit = async (e) => {
  e.preventDefault();

  // Ensure password is a numerical value (convert to number first)
  if (!Number.isInteger(Number(examPassword))) {
    toast.error('Password must be a numerical value');
    return;
  }

  // Combine the selected date and time into a single Date object
  const scheduledDateTime = new Date(selectedDate);
  const [hours, minutes] = selectedTime.split(':');
  scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0); // Set exact time

  const updatedData = {
    password: examPassword, // Pass as a number
    examDate: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
    examTime: selectedTime, // HH:mm format
  };

  try {
    console.log('Updating exam with data:', updatedData); // Debugging log

    const response = await Api.put(`/scheduledExams/${currentExam._id}`, updatedData); // Adjust endpoint as necessary
    if (response.status === 200) {
      toast.success('Scheduled Exam updated successfully!');
      onClose(); // Close the edit modal
      fetchScheduledExams(); // Refresh the scheduled exams
    } else {
      toast.error('Failed to update exam.'); // Handle non-200 responses
    }
  } catch (error) {
    console.error('Error updating exam:', error.response?.data?.message || error.message);
    toast.error('Error updating exam.');
  }
};


  // Render nothing if currentExam is not defined
  if (!currentExam) {
    return null; // Or you could return a loading state
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded mr-8 mt-40 w-2/4 max-h-[80vh] overflow-y-auto shadow-md">
        <h2 className="text-xl font-semibold mb-4">Edit Exam Schedule</h2>
        <form className="space-y-4" onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label htmlFor="editExamSelect" className="block text-sm font-medium text-gray-700">Select Exam</label>
            <select
              id="editExamSelect"
              value={examId}
              onChange={handleExamChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>Select an exam</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="editExamPassword" className="block text-sm font-medium text-gray-700">Exam Password (Numerical)</label>
            <input
              type="text"
              id="editExamPassword"
              value={examPassword}
              onChange={(e) => setExamPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Choose Exam Date</label>
            <Calendar onChange={onDateChange} value={selectedDate} />
          </div>

          <div className="form-group">
            <label htmlFor="editExamTime" className="block text-sm font-medium text-gray-700">Choose Exam Time</label>
            <input
              type="time"
              id="editExamTime"
              value={selectedTime}
              onChange={handleTimeChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">Update Exam</button>
            <button 
              type="button" 
              onClick={onClose} 
              className="mt-2 w-full p-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditExamModal;
