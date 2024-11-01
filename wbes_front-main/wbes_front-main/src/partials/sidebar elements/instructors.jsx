import React, { useState, useEffect } from 'react';
import Api from '../../api/axiosInstance'; // Adjust the path as necessary
import { FaTrashAlt, FaEdit } from 'react-icons/fa'; // Importing icons

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructorData, setInstructorData] = useState({
    name: '',
    email: '',
    password: '',
    courseIds: []
  });
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchInstructors();
    fetchCourses();
  }, []);

  // Fetch all instructors
  const fetchInstructors = async () => {
    try {
      const res = await Api.get('/instructors');
      setInstructors(res.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  // Fetch available courses
  const fetchCourses = async () => {
    try {
      const res = await Api.get('/courses'); // Assuming you have a /courses endpoint
      setCourses(res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Handle input changes for the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructorData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle course selection using checkboxes
  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setInstructorData((prev) => {
      const courseIds = checked
        ? [...prev.courseIds, value]
        : prev.courseIds.filter((id) => id !== value);
      return {
        ...prev,
        courseIds
      };
    });
  };

  // Validate form fields
  const validateForm = () => {
    const validationErrors = {};
    if (!instructorData.name) validationErrors.name = 'Name is required';
    if (!instructorData.email) validationErrors.email = 'Email is required';
    if (!editingInstructor && !instructorData.password) validationErrors.password = 'Password is required';
    return validationErrors;
  };

  // Create or update an instructor
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Prevent form submission
    }

    try {
      if (editingInstructor) {
        // Update existing instructor
        await Api.put(`/instructors/${editingInstructor._id}`, {
          ...instructorData,
          courseIds: instructorData.courseIds
        });
        setPopupMessage('Instructor updated successfully');
      } else {
        // Create new instructor
        await Api.post('/instructors', instructorData);
        setPopupMessage('Instructor created successfully');
      }

      setInstructorData({ name: '', email: '', password: '', courseIds: [] });
      setEditingInstructor(null);
      setIsFormVisible(false); // Hide form after submission
      setErrors({}); // Clear errors
      fetchInstructors(); // Refresh the list
      setShowPopup(true); // Show success message
    } catch (error) {
      console.error('Error submitting form:', error);
      setPopupMessage('An error occurred while submitting the form.');
      setShowPopup(true);
    }
  };

  // Handle delete instructor
  const handleDelete = async (instructorId) => {
    try {
      await Api.delete(`/instructors/${instructorId}`);
      setPopupMessage('Instructor deleted successfully');
      fetchInstructors();
      setShowPopup(true); // Show success message
    } catch (error) {
      console.error('Error deleting instructor:', error);
      setPopupMessage('Error occurred while deleting instructor.');
      setShowPopup(true);
    }
  };

  // Set instructor for editing
  const handleEdit = (instructor) => {
    setInstructorData({
      name: instructor.name,
      email: instructor.email,
      password: '',
      courseIds: instructor.courses.map(course => course._id)
    });
    setEditingInstructor(instructor);
    setIsFormVisible(true); // Show form when editing
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Instructor Management</h1>
      <button 
        onClick={() => setIsFormVisible(!isFormVisible)} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        {isFormVisible ? 'Cancel' : 'Add Instructor'}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={instructorData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={instructorData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={instructorData.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              required={!editingInstructor}
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Assign Courses</label>
            {courses.map((course) => (
              <div key={course._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={course._id}
                  checked={instructorData.courseIds.includes(course._id)}
                  onChange={handleCourseChange}
                  className="mr-2"
                />
                <label>{course.name}</label>
              </div>
            ))}
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingInstructor ? 'Update Instructor' : 'Create Instructor'}
          </button>
        </form>
      )}

      <h2 className="text-xl font-semibold mb-4">Instructor List</h2>
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Courses</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor._id} className="border-b">
              <td className="border p-2">{instructor.name}</td>
              <td className="border p-2">{instructor.email}</td>
              <td className="border p-2">
                {instructor.courses.map(course => course.name).join(', ')}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(instructor)}
                  className="text-yellow-500 mr-2 hover:text-yellow-700"
                  title="Edit Instructor"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(instructor._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Instructor"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="ml-4 text-blue-500 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorManagement;
