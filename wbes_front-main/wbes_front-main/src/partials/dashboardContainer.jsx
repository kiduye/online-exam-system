// import React from "react";
// import { Routes, Route, Router } from "react-router-dom";
// import DashboardOverview from "../partials/sidebar elements/overview"; 
// import Analytics from "../partials/sidebar elements/analytics";
// import ManageStudents from "../partials/sidebar elements/students";
// import ManageInstructors from "../partials/sidebar elements/instructors";
// import ManageDepartmentBoard from "../partials/sidebar elements/departmentboard";
// import Sidebar from "../partials/Sidebar";
// import Header from "../partials/Header";
// import Footer from "../components/common/footer";

// function DashboardContainer() {
//   return (
    
//     <div className="flex flex-col h-screen">
//       {/* Header */}
//       <Header />

//       {/* Main Layout Wrapper */}
//       <div className="flex flex-1  overflow">
//         {/* Fixed Sidebar */}
//         <div className="fixed h-screen left-0 w-64 bg-gray-800 text-white">
//           <Sidebar />
//         </div>

//         {/* Main content area */}
//         <div className="flex flex-col flex-1 ml-64">
//           {/* Content Area */}
//           <div className="flex-1 p-6 overflow-y-auto">
//             <Routes>
//               <Route path="/" element={<DashboardOverview />} />
//               <Route path="/analytics" element={<Analytics />} />
//               <Route path="/manage-students" element={<ManageStudents />} />
//               <Route path="/manage-instructors" element={<ManageInstructors />} />
//               <Route path="/manage-department-board" element={<ManageDepartmentBoard />} />
//               {/* <Route path="/manage-students" element={<ManageStudents />} />
//               <Route path="/manage-instructors" element={<ManageInstructors />} />
//               <Route path="/manage-department-board" element={<ManageDepartmentBoard />} /> */}
//               {/* Add more routes as needed */}
//             </Routes>
//           </div>

//           {/* Footer */}
//           <Footer />
//         </div>
//       </div>
//     </div>
   
//   );
// }

// export default DashboardContainer;
