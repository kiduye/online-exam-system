import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Admin List Component
const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [message, setMessage] = useState('');
  const [confirmationDialog, setConfirmationDialog] = useState({ open: false, adminId: null });

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Clear the message after 3 seconds
  const clearMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 3000); // Clear after 3 seconds
  };

  // Add Admin
  const handleAddAdmin = async (adminData) => {
    try {
      await axios.post('http://localhost:5000/api/admins', adminData);
      fetchAdmins();
      setMessage('Admin added successfully!');
      clearMessage(); // Clear message after delay
    } catch (error) {
      console.error('Error adding admin:', error);
      setMessage('Error adding admin.');
      clearMessage();
    }
  };

  // Edit Admin
  const handleEditAdmin = async (adminId, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/admins/${adminId}`, updatedData);
      fetchAdmins();
      setMessage('Admin updated successfully!');
      clearMessage(); // Clear message after delay
    } catch (error) {
      console.error('Error updating admin:', error);
      setMessage('Error updating admin.');
      clearMessage();
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/admins/${confirmationDialog.adminId}`);
      fetchAdmins();
      setMessage('Admin deleted successfully!');
      clearMessage(); // Clear message after delay
      setConfirmationDialog({ open: false, adminId: null });
    } catch (error) {
      console.error('Error deleting admin:', error);
      setMessage('Error deleting admin.');
      clearMessage();
    }
  };

  // Handle Confirmation Dialog for Delete
  const openConfirmationDialog = (adminId) => {
    setConfirmationDialog({ open: true, adminId });
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialog({ open: false, adminId: null });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Management</h1>

      {/* Success/Error Message */}
      {message && <p className="mb-4 text-green-500">{message}</p>}

      {/* Add Admin Button */}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4 flex items-center"
        onClick={() => setIsModalOpen(true)}
      >
        <FaPlus className="mr-2" />
        Add Admin
      </button>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search by name"
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Admin Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Name</th>
            <th className="border-b p-2">Email</th>
            <th className="border-b p-2">Department</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins
            .filter((admin) => admin.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((admin) => (
              <tr key={admin._id}>
                <td className="border-b p-2">{admin.name}</td>
                <td className="border-b p-2">{admin.email}</td>
                <td className="border-b p-2">{admin.department?.name || 'N/A'}</td>
                <td className="border-b p-2">
                  <button
                    className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                    onClick={() => {
                      setCurrentAdmin(admin);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() => openConfirmationDialog(admin._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <h2 className="text-2xl mb-6">Add Admin</h2>
            <AdminRegistrationForm
              closeModal={() => setIsModalOpen(false)}
              fetchAdmins={fetchAdmins}
            />
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {isEditModalOpen && currentAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <h2 className="text-2xl mb-6">Edit Admin</h2>
            <AdminEditForm
              admin={currentAdmin}
              closeModal={() => setIsEditModalOpen(false)}
              fetchAdmins={fetchAdmins}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmationDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">Are you sure you want to delete this admin?</h2>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded mr-2"
                onClick={closeConfirmationDialog}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;

// Admin Registration Form Component
const AdminRegistrationForm = ({ closeModal, fetchAdmins }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminData = { name, email, password, department };

    try {
      await axios.post('http://localhost:5000/api/admins', adminData);
      fetchAdmins();
      closeModal();
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Department</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="bg-gray-300 text-black py-2 px-4 rounded mr-2"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Add Admin
        </button>
      </div>
    </form>
  );
};

// Admin Edit Form Component
const AdminEditForm = ({ admin, closeModal, fetchAdmins }) => {
  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [department, setDepartment] = useState(admin.department?._id || '');
  const [departments, setDepartments] = useState([]);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { name, email, department };

    try {
      await axios.put(`http://localhost:5000/api/admins/${admin._id}`, updatedData);
      fetchAdmins();
      closeModal();
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Department</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="bg-gray-300 text-black py-2 px-4 rounded mr-2"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Save Changes
        </button>
      </div>
    </form>
  );
};
