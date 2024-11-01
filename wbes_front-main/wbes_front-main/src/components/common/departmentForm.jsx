import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentForm = ({ editingDepartment, onClose, notifySuccess }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (editingDepartment) {
      setName(editingDepartment.name);
    }
  }, [editingDepartment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        // Update existing department
        await axios.put(`http://localhost:5000/api/departments/${editingDepartment._id}`, { name });
        notifySuccess('Department updated successfully'); // Notify success
      } else {
        // Create new department
        await axios.post('http://localhost:5000/api/departments', { name });
        notifySuccess('Department created successfully'); // Notify success
      }
      setName('');
      onClose();
    } catch (error) {
      notifySuccess('Error saving department'); // You may want to use error notification too
    }
  };

  const handleCancel = () => {
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{editingDepartment ? 'Edit Department' : 'Add Department'}</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Department Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full p-2 mb-4"
            placeholder="Enter department name"
          />
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {editingDepartment ? 'Update Department' : 'Add Department'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
