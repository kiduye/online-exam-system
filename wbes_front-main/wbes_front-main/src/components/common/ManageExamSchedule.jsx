// ManageExamSchedule.js
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api from '../../api/axiosInstance'; // Import the Axios instance
import AddExamModal from './AddExamModal'; // Modal for adding exams
import EditExamModal from './EditExamModal'; // Modal for editing exams
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManageExamSchedule = () => {
  const [scheduledExams, setScheduledExams] = useState([]);
  const [exams, setExams] = useState([]); // Add state for exams
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch scheduled exams
  const fetchScheduledExams = async () => {
    try {
      const response = await Api.get('/scheduledExams'); // Adjust endpoint as necessary
      setScheduledExams(response.data);
    } catch (error) {
      console.error('Error fetching scheduled exams:', error);
    }
  };

  // Fetch all exams to pass to AddExamModal
  const fetchExams = async () => {
    try {
      const response = await Api.get('/exams/admin/exams'); // Adjust endpoint as necessary
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  useEffect(() => {
    fetchScheduledExams();
    fetchExams(); // Fetch exams when the component mounts
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheduled exam?')) {
      try {
        await Api.delete(`/scheduledExams/${id}`); // Adjust endpoint as necessary
        toast.success('Scheduled exam deleted successfully');
        fetchScheduledExams();
      } catch (error) {
        console.error('Error deleting scheduled exam:', error);
        toast.error('Failed to delete scheduled exam');
      }
    }
  };

  const handleEditClick = (exam) => {
    setSelectedExam(exam);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedExam(null);
    fetchScheduledExams(); // Refresh exam list after adding or editing
  };

  const filteredExams = scheduledExams.filter((exam) =>
    exam.exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Exam Schedule</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add Exam Schedule
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by exam title..."
        value={searchTerm}
        onChange={handleSearch}
        className="mt-2 mb-4 w-full p-2 border border-gray-300 rounded-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.map((exam) => (
          <div key={exam._id} className="border rounded-md p-4 shadow">
            <h3 className="text-lg font-semibold">{exam.exam.title}</h3>
            <p>{exam.description}</p>
            <p className="mt-2">
              <strong>Date:</strong> {exam.examDate}
            </p>
            <p>
              <strong>Time:</strong> {exam.examTime}
            </p>
            <p>
              <strong>Password:</strong> {exam.password}
            </p>
            <div className="flex justify-end mt-4">
              <FaEdit
                className="text-blue-600 cursor-pointer mr-2"
                onClick={() => handleEditClick(exam)}
              />
              <FaTrash
                className="text-red-600 cursor-pointer"
                onClick={() => handleDelete(exam._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Exam Modal */}
      {showAddModal && <AddExamModal exams={exams} onClose={closeModals} />} {/* Pass exams here */}
      
      {/* Edit Exam Modal */}
      {showEditModal && <EditExamModal currentExam={selectedExam} exams={exams} onClose={closeModals} fetchScheduledExams={fetchScheduledExams} />}
 
    </div>
  );
};

export default ManageExamSchedule;
