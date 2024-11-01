import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update if necessary

// Fetch all instructors
export const getInstructors = async () => {
  try {
    const response = await axios.get(`${API_URL}/instructors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching instructors:', error);
  }
};

// Fetch all courses
export const getCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};

// Assign courses to instructor
export const assignCoursesToInstructor = async (instructorId, courseIds) => {
  try {
    const response = await axios.put(`${API_URL}/instructors/assignCourses/${instructorId}`, {
      courseIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning courses:', error);
  }
};
