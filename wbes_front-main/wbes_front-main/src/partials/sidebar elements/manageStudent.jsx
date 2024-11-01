import React, { useState, useEffect } from 'react';
import Api from '../../api/axiosInstance'; // Import the axios instance
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollmentTypes, setEnrollmentTypes] = useState([]);
  const [studentForm, setStudentForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', enrollmentTypeId: '' });
  const [editMode, setEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch students and enrollment types on component mount
  useEffect(() => {
    fetchStudents();
    fetchEnrollmentTypes();
  }, []);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await Api.get('/students');
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students.');
    }
  };

  // Fetch enrollment types
  const fetchEnrollmentTypes = async () => {
    try {
      const response = await Api.get('/enrollment-types'); // Adjust the route to your backend
      setEnrollmentTypes(response.data);
    } catch (error) {
      toast.error('Failed to fetch enrollment types.');
    }
  };

  // Handle form change
  const handleFormChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  // Handle form submit for add or edit
  const handleSubmit = async () => {
    if (editMode) {
      await handleUpdateStudent();
    } else {
      await handleAddStudent();
    }
  };

  // Handle add student
  const handleAddStudent = async () => {
    try {
      const response = await Api.post('/students', studentForm);
      toast.success('Student added successfully');
      setStudents([...students, response.data.data]);
      setShowFormModal(false);
      // Reload the page after the student is added
    window.location.reload(); 
    } catch (error) {
      toast.error('Failed to add student.');
    }
  };

   // Handle update student
const handleUpdateStudent = async () => {
  try {
    const response = await Api.put(`/students/${selectedStudent._id}`, {
      ...studentForm,
      enrollmentTypeId: studentForm.enrollmentTypeId // Make sure this is being sent correctly
    });
    console.log(response.data); // Check the response data to verify if the update was successful
    toast.success('Student updated successfully');

    // Update the local student list with the updated student data
    setStudents(
      students.map((student) =>
        student._id === selectedStudent._id ? response.data : student
      )
    );
    setShowFormModal(false);
  } catch (error) {
    toast.error('Failed to update student.');
  }
};




  // Handle delete student
  const handleDeleteStudent = async () => {
    try {
      await Api.delete(`/students/${selectedStudent._id}`);
      toast.success('Student deleted successfully');
      setStudents(students.filter((student) => student._id !== selectedStudent._id));
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to delete student.');
    }
  };

  // Open the form modal
  const openFormModal = (student = null) => {
  if (student) {
    setEditMode(true);
    setSelectedStudent(student);
    setStudentForm({
      firstName: student.firstName,
      lastName: student.lastName,
      username: student.username,
      email: student.email,
      password: '', // You may want to handle this differently
      enrollmentTypeId: student.enrollmentType ? student.enrollmentType._id : ''
    });
  } else {
    setEditMode(false);
    setStudentForm({ firstName: '', lastName: '', username: '', email: '', password: '', enrollmentTypeId: '' });
  }
  setShowFormModal(true);
};


  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => openFormModal()}
        >
          <FaPlus className="mr-2" /> Add Student
        </button>
        <input
          type="text"
          placeholder="Search students..."
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Student Table */}
      <table className="min-w-full table-auto bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Enrollment Type</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
  {filteredStudents.map((student) => (
    <tr key={student._id}>
      <td className="border px-4 py-2">{student.firstName}</td>
      <td className="border px-4 py-2">{student.lastName}</td>
      <td className="border px-4 py-2">{student.username}</td>
      <td className="border px-4 py-2">{student.email}</td>
      <td className="border px-4 py-2">
        {student.enrollmentType ? student.enrollmentType.name : 'N/A'} {/* Check for undefined */}
      </td>
      <td className="border px-4 py-2">
        <button
          className="text-yellow-500 hover:text-yellow-700 mr-2"
          onClick={() => openFormModal(student)}
        >
          <FaEdit />
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => {
            setSelectedStudent(student);
            setShowDeleteConfirm(true);
          }}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* Add/Edit Student Modal */}
      {showFormModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg mt-20 w-2/4 h-3/4 overflow-y-auto">
            <h2 className="text-2xl mb-4">{editMode ? 'Edit Student' : 'Add Student'}</h2>
            <div className="mb-4">
              <label className="block mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full p-2 border rounded"
                value={studentForm.firstName}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full p-2 border rounded"
                value={studentForm.lastName}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Username</label>
              <input
                type="text"
                name="username"
                className="w-full p-2 border rounded"
                value={studentForm.username}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border rounded"
                value={studentForm.email}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-2 border rounded"
                value={studentForm.password}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Enrollment Type</label>
              <select
                name="enrollmentTypeId"
                className="w-full p-2 border rounded"
                value={studentForm.enrollmentTypeId}
                onChange={handleFormChange}
              >
                <option value="">Select Enrollment Type</option>
                {enrollmentTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowFormModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                {editMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this student?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDeleteStudent}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageStudent;
