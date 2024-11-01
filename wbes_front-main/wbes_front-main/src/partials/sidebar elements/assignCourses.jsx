import React, { useState, useEffect } from 'react';
import CourseService from '../sidebar elements/courseService';

function AssignCourses() {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    // Fetch instructors and courses when component mounts
    CourseService.getInstructors().then((data) => setInstructors(data));
    CourseService.getCourses().then((data) => setCourses(data));
  }, []);

  const handleInstructorChange = (event) => {
    setSelectedInstructor(event.target.value);
  };

  const handleCourseChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedCourses(selectedOptions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send selected instructor and courses to backend
    CourseService.assignCoursesToInstructor(selectedInstructor, selectedCourses)
      .then(() => alert('Courses assigned successfully!'))
      .catch((error) => console.error('Error assigning courses:', error));
  };

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100">Assign Courses to Instructor</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="instructor" className="block text-gray-600 dark:text-gray-300">Select Instructor</label>
          <select
            id="instructor"
            value={selectedInstructor}
            onChange={handleInstructorChange}
            className="w-full px-2 py-1 border rounded-md dark:bg-gray-800 dark:text-gray-400"
          >
            <option value="">Select an instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.f_name} {instructor.l_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="courses" className="block text-gray-600 dark:text-gray-300">Select Courses</label>
          <select
            id="courses"
            multiple
            value={selectedCourses}
            onChange={handleCourseChange}
            className="w-full px-2 py-1 border rounded-md dark:bg-gray-800 dark:text-gray-400"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-900 text-white py-2 px-4 rounded-md"
        >
          Assign Courses
        </button>
      </form>
    </div>
  );
}

export default AssignCourses;
