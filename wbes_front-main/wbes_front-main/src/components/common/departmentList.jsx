import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi'; // Import search icon from react-icons
import axios from 'axios';

const DepartmentList = ({ notifySuccess }) => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/departments');
        setDepartments(response.data);
        setFilteredDepartments(response.data);
      } catch (err) {
        setError('Error fetching departments');
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    setFilteredDepartments(
      departments.filter(department =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, departments]);

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/departments/${departmentToDelete._id}`);
      setDepartments(departments.filter((dept) => dept._id !== departmentToDelete._id));
      setDeleteDialogOpen(false);
      notifySuccess('Department deleted successfully.'); // Notify success
    } catch (err) {
      setError('Error deleting department');
    }
  };

  const handleEditClick = (department) => {
    setDepartmentToEdit(department);
    setEditName(department.name); // Set the current department name in the edit input
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/departments/${departmentToEdit._id}`, {
        name: editName
      });
      setDepartments(departments.map(dept =>
        dept._id === departmentToEdit._id ? { ...dept, name: editName } : dept
      ));
      setEditDialogOpen(false);
      notifySuccess('Department updated successfully.'); // Notify success
    } catch (err) {
      setError('Error updating department');
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      {/* Search input aligned to the right with search icon */}
      <div className="mb-4 flex justify-end">
        <div className="relative w-1/4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded w-full p-2 pl-10"
            placeholder="Search departments..."
          />
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
        </div>
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Department Name</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((department) => (
            <tr key={department._id}>
              <td className="border px-4 py-2 w-3/4">{department.name}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                  onClick={() => handleEditClick(department)} // Trigger edit
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded ml-2"
                  onClick={() => handleDeleteClick(department)} // Trigger delete
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete confirmation dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the department {departmentToDelete.name}?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit department modal */}
      {editDialogOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Department</h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border rounded w-full p-2"
              placeholder="Department name"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditDialogOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
