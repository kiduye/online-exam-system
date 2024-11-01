// // // src/components/InstructorDashboard.jsx
// // import React from 'react';
// // import QuestionForm from '../common/questionForm';
// // // import { SidebarWithBurgerMenu } from '../common/sideBar';

// // const InstructorDashboard = () => {
// //   return (
// //     <div className="min-h-screen bg-gray-100 p-8">
// //       <h1 className="text-3xl font-bold mb-4">Instructor Dashboard</h1>
// //       <p>Welcome, Instructor! Here you can manage your courses, view student progress, and more.</p>
// //       {/* Add additional instructor-specific content here */}
// //       <QuestionForm/>
// //       {/* <SidebarWithBurgerMenu/> */}
// //     </div>
// //   );
// // };

// // export default InstructorDashboard;


// import React, { useState } from 'react';
// import { Route, Routes } from 'react-router-dom';

// import Sidebar from '../Instructor/instructorSidebar';
// import Header from '../../partials/Header';
// import MainContent from '../../partials/mainContent';
// import ManageStudents from '../../partials/sidebar elements/students';
// import ManageInstructors from '../../partials/sidebar elements/instructors';
// import ManageDepartmentBoard from '../../partials/sidebar elements/departmentboard';
// import Announcements from '../../partials/sidebar elements/announcement';
// import ReleaseExamResults from '../../partials/sidebar elements/examResult';
// import ManageExamSchedule from '../../partials/sidebar elements/examSchedule';
// import DashboardOverview from '../../partials/sidebar elements/overview';
// import QuestionList from '../common/questionList';
// import UploadMaterial from '../common/uploadResource';
// import ResourceList from '../common/resourceList';

// function InstructorDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(true); // Define sidebarOpen state

//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
//       {/* Sidebar */}
//       <div className=" fixed flex-shrink-0 h-screen">
//         <Sidebar
//           sidebarOpen={sidebarOpen} // Pass the sidebarOpen state
//           setSidebarOpen={setSidebarOpen} // Pass the setSidebarOpen function
//         />
//       </div>
      
//       {/* Main Content Area */}
//       <div className="flex-1 flex  flex-col">
//         <Header 
//           sidebarOpen={sidebarOpen} 
//           setSidebarOpen={setSidebarOpen} 
//           className="bg-gray-200 dark:bg-gray-700 border-b border-gray-300 p-4 flex-shrink-0" 
//         />
        
//         <main className="flex-1 p-6 bg-blue-100 dark:bg-gray-800 overflow-y-auto">
//           <Routes>
//             <Route path="/" element={<DashboardOverview />} />
//              <Route path="overview" element={<DashboardOverview />} />
//             <Route path="manage/course" element={<ManageStudents />} />
//             <Route path="manage/question" element={<QuestionList />} />
//             <Route path="manage/material" element={<ResourceList/>} /> 
//             {/* <Route path="announcement" element={<Announcements />} />
//             <Route path="schedules" element={<ManageExamSchedule />} />
//             <Route path="release-exam-result" element={<ReleaseExamResults />} /> */}
//           </Routes>
//         </main>
        
//         {/* <footer className="p-4 bg-gray-200 dark:bg-gray-900 text-center flex-shrink-0"> 
//           Footer Content
//         </footer> */}
//       </div>
//     </div>
//   );
// }

// export default InstructorDashboard ;


import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Sidebar from '../Instructor/instructorSidebar';
import Header from '../../partials/Header';
import MainContent from '../../partials/mainContent';
import CourseCreator from '../CreateCourseModule';
import ManageInstructors from '../../partials/sidebar elements/instructors';
import ManageDepartmentBoard from '../../partials/sidebar elements/departmentboard';
import Announcements from '../../partials/sidebar elements/announcement';
import ReleaseExamResults from '../../partials/sidebar elements/examResult';
import ManageExamSchedule from '../../partials/sidebar elements/examSchedule';
/*import DashboardOverview from '../../partials/sidebar elements/overview';*/
import QuestionList from '../common/questionList';
import UploadMaterial from '../common/uploadResource';
import ResourceList from '../common/resourceList';
import InstructorOverview from './InstructorOverview';

function InstructorDashboard() {
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
             <Route path="/" element={<CourseCreator />} />
              {/* <Route path="overview" element={<InstructorOverview />} /> */}
             <Route path="manage/course" element={<CourseCreator />} />
             <Route path="manage/question" element={<QuestionList />} />
             <Route path="manage/material" element={<ResourceList/>} /> 
             
         </Routes>
        </main>
        
        {/* <footer className="p-4 bg-gray-200 dark:bg-gray-900 text-center flex-shrink-0">
          Footer Content
        </footer> */}
      </div>
    </div>
  );
}

export default InstructorDashboard;
