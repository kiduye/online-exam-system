import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Api from '../../api/axiosInstance'; // Import the Axios instance

const ExamScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState('');
  const [examPassword, setExamPassword] = useState(''); // State for the exam password

  // Fetch all exams from the backend
  const fetchExams = async () => {
    try {
      const response = await Api.get('/exams/admin/exams'); // Adjust endpoint as necessary
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleExamChange = (e) => {
    const selectedExam = exams.find(exam => exam._id === e.target.value);
    setExamId(selectedExam._id);
    setExamTitle(selectedExam.title);
    setExamDescription(selectedExam.description);
    setExamPassword(Math.floor(Math.random() * 10000)); // Generate a random password
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine the selected date and time into a single Date object
    const scheduledDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    scheduledDateTime.setHours(hours, minutes);

    // Exam data to be sent to the backend
    const examData = {
      examId, // The selected exam ID
      password: examPassword, // Use the generated password
      examDate: selectedDate.toISOString().split('T')[0],
      examTime: scheduledDateTime.toTimeString().split(' ')[0],
    };

    try {
      const response = await Api.post('/scheduledExams', examData); // Adjust endpoint as necessary
      if (response.status === 201) {
        console.log('Scheduled Exam:', response.data);
        // Clear fields after successful submission
        setExamId('');
        setSelectedDate(new Date());
        setSelectedTime('');
        setExamTitle('');
        setExamDescription('');
        setExamPassword(''); // Reset password
      }
    } catch (error) {
      console.error('Error scheduling exam:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Schedule an Exam</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="examSelect" className="block text-sm font-medium text-gray-700">Select Exam</label>
          <select
            id="examSelect"
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
          <label htmlFor="examDescription" className="block text-sm font-medium text-gray-700">Exam Description</label>
          <textarea
            id="examDescription"
            value={examDescription}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="examPassword" className="block text-sm font-medium text-gray-700">Exam Password</label>
          <input
            type="text"
            id="examPassword"
            value={examPassword}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Choose Exam Date</label>
          <Calendar onChange={onDateChange} value={selectedDate} />
        </div>

        <div className="form-group">
          <label htmlFor="examTime" className="block text-sm font-medium text-gray-700">Choose Exam Time</label>
          <input
            type="time"
            id="examTime"
            value={selectedTime}
            onChange={handleTimeChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">Schedule Exam</button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Preview Scheduled Exam</h3>
        <p><strong>Title:</strong> {examTitle}</p>
        <p><strong>Description:</strong> {examDescription}</p>
        <p><strong>Date:</strong> {selectedDate.toDateString()}</p>
        <p><strong>Time:</strong> {selectedTime}</p>
        <p><strong>Password:</strong> {examPassword}</p> {/* Display the generated password */}
      </div>
    </div>
  );
};

export default ExamScheduler;
