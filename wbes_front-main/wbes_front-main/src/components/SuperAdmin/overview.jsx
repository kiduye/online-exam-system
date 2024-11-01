import React from 'react';
import CourseModuleCard from '../common/kpicards/CourseModuleCard';
import DepartmentBoardCard from '../common/kpicards/DepartmentBoardCard';
import InstructorCard from '../common/kpicards/InstructorCard';
import StudentCard from '../common/kpicards/StudentCard';

const MainContent = () => {
  // Sample data, replace these with actual data from your API or state
  const instructorCount = 10; // Replace with dynamic value
  const studentCount = 200; // Replace with dynamic value
  const courseCount = 15; // Replace with dynamic value

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* KPI Cards */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105">
          <InstructorCard count={instructorCount} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105">
          <StudentCard count={studentCount} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105">
          <CourseModuleCard count={courseCount} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105">
          <DepartmentBoardCard />
        </div>
      </div>

      {/* Trends and Alerts */}
      <div className="mb-8">
        {/* Charts and Graphs can be added here */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="col-span-2 pb-4 mt-8">
            {/* Placeholder for charts or graphs */}
            <div className="bg-gray-200 h-32 rounded-lg shadow-md flex items-center justify-center">
              <p className="text-gray-500">Charts/Graphs Placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Panels */}
      <div className="grid grid-cols-1 dark:bg-gray-700 md:grid-cols-1 gap-6">
        {/* Additional Management Panels can go here */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Management Panel</h2>
          <p className="text-gray-600">Additional features or details can be added here.</p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
