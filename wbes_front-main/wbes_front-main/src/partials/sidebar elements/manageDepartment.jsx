import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify
import DepartmentForm from '../../components/common/departmentForm';
import DepartmentList from '../../components/common/departmentList';

const ManageDepartment = () => {
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddDepartmentClick = () => {
    setEditingDepartment(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const notifySuccess = (message) => {
    toast.success(message); // Show success toast
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Departments</h1>
      <button
        onClick={handleAddDepartmentClick}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Department
      </button>
      {showForm && (
        <DepartmentForm 
          onClose={handleCloseForm} 
          editingDepartment={editingDepartment}
          notifySuccess={notifySuccess} // Pass the notify function
        />
      )}
      <DepartmentList setEditingDepartment={setEditingDepartment} notifySuccess={notifySuccess} />
      <ToastContainer /> {/* Add the ToastContainer here */}
    </div>
  );
};

export default ManageDepartment;
