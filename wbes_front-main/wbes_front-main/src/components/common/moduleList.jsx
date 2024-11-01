import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseModuleList = ({ instructorId }) => {
  const [courseModules, setCourseModules] = useState([]);

  // Fetch course modules for the logged-in instructor
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`/api/courseModules?instructor=${instructorId}`);
        setCourseModules(response.data);
      } catch (error) {
        console.error('Failed to fetch course modules', error);
      }
    };
    fetchModules();
  }, [instructorId]);

  return (
    <div className="course-modules-list-container">
      <h2>Your Course Modules</h2>
      {courseModules.length === 0 ? (
        <p>No course modules found.</p>
      ) : (
        <ul className="course-module-list">
          {courseModules.map((module) => (
            <li key={module._id} className="course-module-item">
              <h3>{module.courseName.name}</h3>
              {module.image && (
                <img
                  src={`/${module.image}`}
                  alt={module.courseName.name}
                  className="course-module-image"
                />
              )}
              <p>{module.description}</p>
              <p>{module.overview}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseModuleList;
