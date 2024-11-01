import React, { useEffect, useState } from 'react';
import Api from '../../api/axiosInstance'; // Adjust the path as necessary

const DepartmentBoardManagement = () => {
  const [boardMembers, setBoardMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMember, setEditMember] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch department board members
  const fetchBoardMembers = async () => {
    try {
      const response = await Api.get('/departmentboards');
      if (Array.isArray(response.data)) {
        setBoardMembers(response.data);
      } else {
        setBoardMembers([]);
      }
    } catch (error) {
      console.error('Error fetching department board members', error);
      setBoardMembers([]);
    }
  };

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  // Filter board members based on search query
  const filteredBoardMembers = boardMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditMember((prev) => ({ ...prev, [name]: value }));
  };

  // Handle dialog open/close
  const handleEditClick = (member) => {
    setEditMember(member);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setEditMember(null);
    setOpenEditDialog(false);
  };

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
    setNewMember({ name: '', email: '', password: '' });
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setMemberToDelete(null);
    setOpenDeleteDialog(false);
  };

  // Handle form submissions
  const handleEditSubmit = async () => {
    try {
      await Api.put(`/departmentboards/${editMember._id}`, editMember);
      fetchBoardMembers();
      setSnackbarMessage('Department Board Member updated successfully!');
      handleEditClose();
    } catch (error) {
      console.error('Error updating department board member', error);
      setSnackbarMessage('Error updating department board member');
    }
  };

  const handleAddSubmit = async () => {
    try {
      await Api.post('/departmentboards', newMember);
      fetchBoardMembers();
      setSnackbarMessage('New Department Board Member added successfully!');
      handleAddClose();
    } catch (error) {
      console.error('Error adding new department board member', error);
      setSnackbarMessage('Error adding new department board member');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await Api.delete(`/departmentboards/${memberToDelete._id}`);
      fetchBoardMembers();
      setSnackbarMessage('Department Board Member deleted successfully!');
      handleDeleteClose();
    } catch (error) {
      console.error('Error deleting department board member', error);
      setSnackbarMessage('Error deleting department board member');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Add and Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleAddClick}
        >
          Add Department Board Member
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-lg py-2 px-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Department</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBoardMembers.map((member) => (
              <tr key={member._id} className="border-b">
                <td className="py-2 px-4">{member.name}</td>
                <td className="py-2 px-4">{member.email}</td>
                <td className="py-2 px-4">{member.department.name}</td> {/* Display department name */}
                <td className="py-2 px-4 text-center">
                  <button
                    className="text-green-500 hover:text-green-600 mr-2"
                    onClick={() => handleEditClick(member)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteClick(member)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Dialog */}
      {openAddDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Department Board Member</h2>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                name="name"
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                value={newMember.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                value={newMember.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                value={newMember.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                onClick={handleAddSubmit}
              >
                Add
              </button>
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                onClick={handleAddClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {openEditDialog && editMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Department Board Member</h2>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input
                type="text"
                name="name"
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                value={editMember.name}
                onChange={handleEditChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                value={editMember.email}
                onChange={handleEditChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                value={editMember.password}
                onChange={handleEditChange}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                onClick={handleEditSubmit}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                onClick={handleEditClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {openDeleteDialog && memberToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete {memberToDelete.name}?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                onClick={handleDeleteClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar for Messages */}
      {snackbarMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default DepartmentBoardManagement;
