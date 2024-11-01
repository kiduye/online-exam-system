import React, { useState, useEffect } from 'react';
import Api from '../../api/axiosInstance'; // Import the axios instance

const BulkUpload = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  // Fetch assigned courses when the component loads
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await Api.get('/instructors/assigned-courses'); // Adjust the endpoint as necessary
        setCourses(response.data.courses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setUploadMessage('Error fetching assigned courses.');
      }
    };

    fetchCourses();
  }, []);

  // Handle course selection change
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !selectedCourse) {
      setUploadMessage('Please select a course and a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('courseId', selectedCourse);
    formData.append('file', file);

    try {
      const response = await Api.post('/questions/upload-questions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadMessage(response.data.msg);
    } catch (err) {
      setUploadMessage('Error uploading file.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Bulk Upload Questions</h2>

      {uploadMessage && (
        <div className={`mb-4 p-2 text-white rounded-md ${uploadMessage.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}>
          {uploadMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Select Course</label>
          <select
            className="border p-2 rounded-md w-full"
            value={selectedCourse}
            onChange={handleCourseChange}
          >
            <option value="">-- Select a course --</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Upload File</label>
          <input
            type="file"
            className="border p-2 rounded-md w-full"
            accept=".csv,.pdf,.docx"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkUpload;
