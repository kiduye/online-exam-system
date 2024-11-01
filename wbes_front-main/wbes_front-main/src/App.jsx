// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Home from './components/common/home';
// import LoginPage from './components/Auth/LoginForm';
// import PasswordChangeRequest from './components/Student/changepasswordrequest'; // Import the Change Password component
// import ProfileManagementInterface from './components/Student/firstpage';
// import AdminDashboard from './components/Admin/Dashboard';
// import SuperAdminDashboard from './components/SuperAdmin/Dashboard';
// import InstructorDashboard from './components/Instructor/Dashboard';
// import DepartmentBoardDashboard from './components/DepartmentBoard/Dashboard';
// import ForgotPasswordPage from './components/Auth/ForgotPasswordPage';

// const App = () => {
//   const role = useSelector((state) => state.user.role) || localStorage.getItem('role');

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/change-password" element={role ? <PasswordChangeRequest /> : <Navigate to="/login" />} /> {/* Route for Change Password */}
//         <Route path="/student/dashboard/*" element={role === 'student' ? <ProfileManagementInterface /> : <Navigate to="/login" />} />
//         <Route path="/admin/dashboard/*" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
//         <Route path="/superadmin/dashboard/*" element={role === 'superadmin' ? <SuperAdminDashboard /> : <Navigate to="/login" />} />
//         <Route path="/instructor/dashboard/*" element={role === 'instructor' ? <InstructorDashboard /> : <Navigate to="/login" />} />
//         <Route path="/departmentboard/dashboard/*" element={role === 'departmentboard' ? <DepartmentBoardDashboard /> : <Navigate to="/login" />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         {/* Add other routes as needed */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './components/common/home';
import LoginPage from './components/Auth/LoginForm';
import PasswordChangeRequest from './components/Student/changepasswordrequest';
import ProfileManagementInterface from './components/Student/firstpage';
import AdminDashboard from './components/Admin/Dashboard';
import SuperAdminDashboard from './components/SuperAdmin/Dashboard';
import InstructorDashboard from './components/Instructor/Dashboard';
import DepartmentBoardDashboard from './components/DepartmentBoard/Dashboard';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage';
import ExamPage from './components/Student/exam'; // Import your ExamPage component

const App = () => {
  const role = useSelector((state) => state.user.role) || localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={role ? <PasswordChangeRequest /> : <Navigate to="/login" />} />
        <Route path="/student/dashboard/*" element={role === 'student' ? <ProfileManagementInterface /> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard/*" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/superadmin/dashboard/*" element={role === 'superadmin' ? <SuperAdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/instructor/dashboard/*" element={role === 'instructor' ? <InstructorDashboard /> : <Navigate to="/login" />} />
        <Route path="/departmentboard/dashboard/*" element={role === 'departmentboard' ? <DepartmentBoardDashboard /> : <Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* New route for handling the exam page */}
        <Route path="/scheduledExams/:id/exam" element={<ExamPage />} />
      </Routes>
    </Router>
  );
};

export default App;
