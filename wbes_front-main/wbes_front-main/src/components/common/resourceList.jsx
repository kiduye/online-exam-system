import React, { useEffect, useState } from 'react';
import Api from '../../api/axiosInstance';
import { FaPlus, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import UploadMaterial from './uploadResource';
import ConfirmDialog from './confirmDialog';

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await Api.get('materials/instructor/:instructorId');
      console.log('API response:', response.data);
      setResources(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedResource(null);
    setIsModalOpen(true);
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleDelete = (resource) => {
    setResourceToDelete(resource);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await Api.delete(`materials/${resourceToDelete.id}`);
      setResources(resources.filter((r) => r.id !== resourceToDelete.id));
      setIsConfirmOpen(false);
      setResourceToDelete(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const downloadResource = async (resource) => {
    try {
      const response = await Api.get(`materials/materials/download/${resource._id}`, {
        responseType: 'blob', // Important for file download
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resource.title); // Name of the file to be downloaded
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Manage Resources</h1>
        <button
          onClick={handleAdd}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <FaPlus className="mr-2" />
          Add Resource
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading resources...</div>
      ) : Array.isArray(resources) && resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col"
            >
              <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
              <p className="text-gray-700 mb-2">{resource.description}</p>
              <p className="text-sm text-gray-500 mb-4">{resource.fileType}</p>
              <div className="flex space-x-4 mt-auto">
                <button
                  onClick={() => handleEdit(resource)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(resource)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => downloadResource(resource)}
                  className="text-green-500 hover:text-green-600"
                >
                  <FaDownload />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No resources available</div>
      )}

      {/* Modal for Uploading Material */}
      {isModalOpen && (
        <div
          className=" inset-0 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <UploadMaterial
              onClose={closeModal}
              onRefresh={fetchResources}
              selectedResource={selectedResource}
            />
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {isConfirmOpen && (
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Resource"
          message={`Are you sure you want to delete "${resourceToDelete?.title}"?`}
        />
      )}
    </div>
  );
};

export default ResourceList;
