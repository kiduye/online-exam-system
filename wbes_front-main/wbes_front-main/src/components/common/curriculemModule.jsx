import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseModuleForm = ({ instructorId }) => {
  const [courses, setCourses] = useState([]); // To store the instructor's courses
  const [selectedCourse, setSelectedCourse] = useState('');
  const [description, setDescription] = useState('');
  const [overview, setOverview] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [image, setImage] = useState(null); // For image file upload
  const [message, setMessage] = useState('');

  // Fetch the courses for the logged-in instructor
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/instructors/${instructorId}/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };
    fetchCourses();
  }, [instructorId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append('courseId', selectedCourse);
    formData.append('description', description);
    formData.append('overview', overview);
    formData.append('curriculum', curriculum);
    if (image) {
      formData.append('image', image); // Attach image to form data
    }

    try {
      const response = await axios.post('/api/courseModules', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Ensure the correct content type is set
      });
      setMessage('Course module created successfully');
    } catch (error) {
      console.error('Failed to create course module', error);
      setMessage('Error creating course module');
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="course-module-form-container">
      <h2>Create Course Module</h2>
      <form onSubmit={handleSubmit} className="course-module-form">
        <div className="form-group">
          <label htmlFor="course">Course</label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="overview">Overview</label>
          <textarea
            id="overview"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="curriculum">Curriculum</label>
          <textarea
            id="curriculum"
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn-submit">Create Module</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CourseModuleForm;
