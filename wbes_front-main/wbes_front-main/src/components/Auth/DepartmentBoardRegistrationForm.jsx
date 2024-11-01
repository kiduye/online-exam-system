import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DepartmentBoardRegistration({ isOpen, onClose, onRegister, editData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Software Engineering',
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setIsEdit(true);
    } else {
      setFormData({
        name: '',
        email: '',
        department: 'Software Engineering',
      });
      setIsEdit(false);
    }
  }, [editData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/admin/department-boards/${formData._id}`, formData); // Update with your API endpoint
      } else {
        await axios.post('http://localhost:5000/api/admin/department-boards', formData); // Update with your API endpoint
      }
      onRegister();
      onClose();
    } catch (error) {
      console.error('Error saving department board:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {isEdit ? 'Edit Department Board' : 'Register Department Board'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            >
              <option value="Software Engineering">Software Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              {/* Add more departments as needed */}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DepartmentBoardRegistration;
