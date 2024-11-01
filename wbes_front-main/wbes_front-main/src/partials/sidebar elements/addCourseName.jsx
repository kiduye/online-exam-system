import React, { useState, useEffect } from 'react';
import Api from '../../api/axiosInstance'; // Import the configured axios instance

const CourseName = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', code: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchAdminInfo(); // Fetch admin user info on component mount
  }, []);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await Api.get('/courses');
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses', error);
    }
  };

  // Fetch current admin user's department
  const fetchAdminInfo = async () => {
    try {
      const response = await Api.get('/admin/info'); // Adjust the endpoint if necessary
      setDepartment(response.data.department);
    } catch (error) {
      console.error('Error fetching admin info', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  // Add a new course
  const addCourse = async () => {
    try {
      const response = await Api.post('/courses', { ...newCourse, department });
      setCourses([...courses, response.data]);
      setFilteredCourses([...courses, response.data]);
      setNewCourse({ name: '', code: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error adding course', error);
    }
  };

  // Edit course
  const editCourse = (course) => {
    setEditingCourse(course);
    setShowEditModal(true);
  };

  // Update a course
  const updateCourse = async () => {
    try {
      const response = await Api.put(`/courses/${editingCourse._id}`, editingCourse);
      setCourses(courses.map((course) => (course._id === editingCourse._id ? response.data : course)));
      setFilteredCourses(courses.map((course) => (course._id === editingCourse._id ? response.data : course)));
      setEditingCourse(null);
      setShowEditModal(false);
      showConfirmation('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course', error);
    }
  };

  // Delete course
  const deleteCourse = (id) => {
    setCourseToDelete(id);
    setShowDeleteDialog(true);
  };

  // Confirm delete course
  const confirmDeleteCourse = async () => {
    try {
      await Api.delete(`/courses/${courseToDelete}`);
      setCourses(courses.filter((course) => course._id !== courseToDelete));
      setFilteredCourses(courses.filter((course) => course._id !== courseToDelete));
      setShowDeleteDialog(false);
      showConfirmation('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course', error);
    }
  };

  // Show confirmation message
  const showConfirmation = (message) => {
    setConfirmationMessage(message);
    setTimeout(() => {
      setConfirmationMessage('');
    }, 4000);
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = courses.filter((course) =>
      course.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Course Management</h1>

      {/* Search and Add Course Button */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Course
        </button>
        <input
          type="text"
          placeholder="Search by Course Name"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-1/4 mr-4"
        />
      </div>

      {/* Modal for Adding Course */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <input
              type="text"
              name="name"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={handleInputChange}
              className="block w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="code"
              placeholder="Course Code"
              value={newCourse.code}
              onChange={handleInputChange}
              className="block w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addCourse}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Course</h2>
            <input
              type="text"
              name="name"
              placeholder="Course Name"
              value={editingCourse?.name || ''}
              onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
              className="block w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="code"
              placeholder="Course Code"
              value={editingCourse?.code || ''}
              onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
              className="block w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowEditModal(false)} className="mr-2 bg-gray-300 text-black px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={updateCourse} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Update Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this course?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCourse}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Message */}
      {confirmationMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{confirmationMessage}</span>
        </div>
      )}

      {/* Courses Table */}
   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {filteredCourses.map((course) => (
    <div key={course._id} className="bg-white p-4 shadow rounded-lg">
      <div className="text-sm font-medium text-gray-900">{course.name}</div>
      <div className="text-sm text-gray-500">{course.code}</div>
      <div className="mt-2 text-right">
        <button
          onClick={() => editCourse(course)}
          className="text-blue-600 hover:text-blue-900 mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => deleteCourse(course._id)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>


    </div>
  );
};

export default CourseName;
