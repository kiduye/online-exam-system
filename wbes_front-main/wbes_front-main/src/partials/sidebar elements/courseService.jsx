const CourseService = {
  getInstructors: async () => {
    const response = await fetch('/api/instructors'); // Update the API endpoint
    return await response.json();
  },

  getCourses: async () => {
    const response = await fetch('/api/courses'); // Update the API endpoint
    return await response.json();
  },

  assignCoursesToInstructor: async (instructorId, courseIds) => {
    const response = await fetch(`/api/instructors/${instructorId}/assign-courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseIds }),
    });
    return await response.json();
  },
};

export default CourseService;
 