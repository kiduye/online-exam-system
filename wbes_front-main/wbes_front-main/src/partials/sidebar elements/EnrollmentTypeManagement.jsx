import React, { useEffect, useState } from 'react';
import Api from '../../api/axiosInstance'; // Adjust the path based on your file structure
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css';

const EnrollmentTypeManagement = () => {
  const [enrollmentTypes, setEnrollmentTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState({ name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchEnrollmentTypes();
  }, []);

  const fetchEnrollmentTypes = async () => {
    try {
      const response = await Api.get('/enrollment-types'); // Use your Api instance here
      setEnrollmentTypes(response.data);
    } catch (error) {
      console.error('Error fetching enrollment types:', error);
      toast.error('Failed to fetch enrollment types');
    }
  };

  const handleAddOrEditEnrollmentType = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await Api.put(`/enrollment-types/${currentType._id}`, currentType); // Use your Api instance
        toast.success('Enrollment type updated successfully'); // Confirmation message
      } else {
        await Api.post('/enrollment-types', currentType); // Use your Api instance
        toast.success('Enrollment type added successfully'); // Confirmation message
      }
      setIsModalOpen(false);
      fetchEnrollmentTypes();
      setCurrentType({ name: '' });
    } catch (error) {
      console.error('Error adding/editing enrollment type:', error);
      toast.error('Error occurred while saving enrollment type');
    }
  };

  const handleDeleteEnrollmentType = async () => {
    try {
      await Api.delete(`/enrollment-types/${deleteId}`); // Use your Api instance
      toast.success('Enrollment type deleted successfully');
      fetchEnrollmentTypes();
      setDeleteId(null);
      setIsDeleteDialogOpen(false); // Close delete dialog
    } catch (error) {
      console.error('Error deleting enrollment type:', error);
      toast.error('Error occurred while deleting enrollment type');
    }
  };

  const openModal = (type = null) => {
    if (type) {
      setIsEditing(true);
      setCurrentType(type);
    } else {
      setIsEditing(false);
      setCurrentType({ name: '' });
    }
    setIsModalOpen(true);
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const filteredEnrollmentTypes = enrollmentTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Enrollment Type Management</h1>
      <div className="flex mb-4">
        <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Enrollment Type
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-4 border border-gray-300 px-2 py-1 rounded"
        />
      </div>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEnrollmentTypes.map((type) => (
            <tr key={type._id}>
              <td className="border border-gray-300 px-4 py-2">{type.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={() => openModal(type)} className="text-yellow-600 mr-2">
                  Edit
                </button>
                <button onClick={() => openDeleteDialog(type._id)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding/editing enrollment type */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-lg font-bold">
              {isEditing ? 'Edit Enrollment Type' : 'Add Enrollment Type'}
            </h2>
            <form onSubmit={handleAddOrEditEnrollmentType}>
              <input
                type="text"
                value={currentType.name}
                onChange={(e) => setCurrentType({ ...currentType, name: e.target.value })}
                required
                className="border border-gray-300 px-2 py-1 rounded mb-4 w-full"
                placeholder="Enrollment Type Name"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dialog for deleting enrollment type */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this enrollment type?</p>
            <div className="mt-4">
              <button
                onClick={handleDeleteEnrollmentType}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EnrollmentTypeManagement;
