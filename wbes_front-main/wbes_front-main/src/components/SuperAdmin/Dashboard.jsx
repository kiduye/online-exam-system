
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Sidebar from '../SuperAdmin/sadminSidebar';
import Header from '../../partials/Header';
import MainContent from './overview';
import AdminManagement from '../../partials/sidebar elements/adminManagement';
import ManageInstructors from '../../partials/sidebar elements/instructors';
import ManageDepartment from '../../partials/sidebar elements/manageDepartment';
import EnrollmentTypeManagement from '../../partials/sidebar elements/EnrollmentTypeManagement';
import ReleaseExamResults from '../../partials/sidebar elements/examResult';
import ManageExamSchedule from '../../partials/sidebar elements/examSchedule';
import DashboardOverview from '../../partials/sidebar elements/overview';

function SuperAdminDashboard() {
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
            <Route path="/" element={<MainContent />} />
            <Route path="overview" element={<MainContent />} />
            <Route path="manage/admin" element={<AdminManagement />} />
            <Route path="manage/announcement" element={<ManageInstructors />} />
            <Route path="manage/department" element={<ManageDepartment />} />
             <Route path="enroll" element={<EnrollmentTypeManagement />} /> 
            
          </Routes>
        </main>
        
        {/* <footer className="p-4 bg-gray-200 dark:bg-gray-900 text-center flex-shrink-0">
          Footer Content
        </footer> */}
      </div>
    </div>
  );
}

export default SuperAdminDashboard ;
