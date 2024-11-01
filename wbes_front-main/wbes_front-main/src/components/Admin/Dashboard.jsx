import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import MainContent from '../../partials/mainContent';
import ManageStudent from '../../partials/sidebar elements/manageStudent';
import InstructorManagement from '../../partials/sidebar elements/instructors';
import DepartmenBoardtManagement from '../../partials/sidebar elements/departmentboard';
// import Announcements from '../../partials/sidebar elements/announcement';
import CourseName from '../../partials/sidebar elements/addCourseName';
import ManageExamSchedule from '../common/ManageExamSchedule';
import Overview from '../../partials/sidebar elements/overview';
import PerformanceDashboard from '../../components/common/performanceDashboard';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Define sidebarOpen state

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      {/* Sidebar */}
      <div className="flex-shrink-0 h-screen">
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
        
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="manage/student" element={<ManageStudent />} /> 
            <Route path="manage/student" element={<PerformanceDashboard />} />
            
            <Route path="manage/instructor" element={<InstructorManagement />} />
            <Route path="manage/department" element={<DepartmenBoardtManagement />} />
            {/* <Route path="announcement" element={<Announcements />} /> */}
            <Route path="schedules" element={<ManageExamSchedule />} />
            <Route path="add-courses" element={<CourseName />} />
            
          </Routes>
        </main>
        
        {/* <footer className="p-4 bg-gray-200 dark:bg-gray-900 text-center flex-shrink-0">
          Footer Content
        </footer> */}
      </div>
    </div>
  );
}

export default AdminDashboard;
