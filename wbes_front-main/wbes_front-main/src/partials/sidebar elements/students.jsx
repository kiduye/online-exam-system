import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import StudentRegistration from '../../components/Auth/StudentRegistrationForm';

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/students'); // Update with your API endpoint
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const handleRegister = () => {
    fetchStudents();
    setIsRegistrationModalOpen(false);
    setEditData(null);
  };

  const handleEditClick = (student) => {
    setEditData(student);
    setIsRegistrationModalOpen(true);
  };

  const handleDeleteClick = async (studentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/students/${studentId}`); // Update with your API endpoint
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Students</h1>
      <button
        onClick={() => setIsRegistrationModalOpen(true)}
        className="mb-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
      >
        <FaPlus className="mr-2" /> Add Student
      </button>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">First Name</th>
              <th className="border p-2 text-left">Last Name</th>
              <th className="border p-2 text-left">Username</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Department</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id}>
                  <td className="border p-2">{student.firstName}</td>
                  <td className="border p-2">{student.lastName}</td>
                  <td className="border p-2">{student.username}</td>
                  <td className="border p-2">{student.email}</td>
                  <td className="border p-2">{student.department}</td>
                  <td className="border p-2 flex space-x-2">
                    <button
                      onClick={() => handleEditClick(student)}
                      className="p-1 text-yellow-500 hover:text-yellow-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(student._id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border p-2 text-center">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <StudentRegistration
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onRegister={handleRegister}
        editData={editData}
      />
    </div>
  );
}

export default ManageStudents;
