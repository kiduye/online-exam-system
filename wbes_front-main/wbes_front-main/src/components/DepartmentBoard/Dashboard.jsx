// // src/components/DepartmentBoardDashboard.jsx
// import React from 'react';

// const DepartmentBoardDashboard = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <h1 className="text-3xl font-bold mb-4">Department Board Dashboard</h1>
//       <p>Welcome, Department Board Member! Here you can oversee departmental activities and reports.</p>
//       {/* Add additional department board-specific content here */}
//     </div>
//   );
// };

// export default DepartmentBoardDashboard;


import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Sidebar from '../DepartmentBoard/departmentBoardSidebar';
import Header from '../../partials/Header';
import MainContent from '../../partials/mainContent';
import ExamManagementPage from '../../components/common/examPage';
import ManageInstructors from '../../partials/sidebar elements/instructors';
import ManageDepartmentBoard from '../../partials/sidebar elements/departmentboard';
import Announcements from '../../partials/sidebar elements/announcement';
import ReleaseExamResults from '../../partials/sidebar elements/examResult';
import ManageExamSchedule from '../../partials/sidebar elements/examSchedule';
import DashboardOverview from '../../partials/sidebar elements/overview';
// import PerformanceDashboard from '../../components/common/performanceDashboard';

function DepartmentBoardDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Define sidebarOpen state

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <div className="flex-shrink-0  h-screen">
        <Sidebar
          sidebarOpen={sidebarOpen} // Pass the sidebarOpen state
          setSidebarOpen={setSidebarOpen} // Pass the setSidebarOpen function
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          className="bg-gray-200 dark:bg-gray-700 border-b border-gray-300 p-4 flex-shrink-0" 
        />
        
        <main className="flex-1 p-6 bg-blue-100 dark:bg-gray-800 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ExamManagementPage />} /> 
            {/* <Route path="overview" element={<DashboardOverview />} /> */}
            <Route path="manage/exam" element={<ExamManagementPage />} />
            {/* <Route path="track/performance" element={<PerformanceDashboard />} /> */}
            {/* <Route path="manage/department" element={<ManageDepartmentBoard />} /> */}
            {/* <Route path="announcement" element={<Announcements />} />
            <Route path="schedules" element={<ManageExamSchedule />} />
            <Route path="release-exam-result" element={<ReleaseExamResults />} /> */}
          </Routes>
        </main>
        
        {/* <footer className="p-4 bg-gray-200 dark:bg-gray-900 text-center flex-shrink-0">
          Footer Content
        </footer> */} 
      </div>
    </div>
  );
}

export default DepartmentBoardDashboard ;
