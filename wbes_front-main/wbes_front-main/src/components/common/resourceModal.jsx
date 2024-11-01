import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Api from '../../api/axiosInstance';
import { FaTimes } from 'react-icons/fa';

Modal.setAppElement('#root');

const ResourceModal = ({ isOpen, onClose, onRefresh, resource }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setDescription(resource.description);
      setFileType(resource.fileType);
      setPreview(resource.fileUrl);
    } else {
      resetForm();
    }
  }, [resource]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setPreview(null);
    setFileType('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setFileType(selectedFile.type);

      if (
        selectedFile.type === 'application/pdf' ||
        selectedFile.type.startsWith('image/')
      ) {
        const fileUrl = URL.createObjectURL(selectedFile);
        setPreview(fileUrl);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }

      if (resource) {
        // Update existing resource
        await Api.put(`/materials/${resource.id}`, formData);
      } else {
        // Create new resource
        await Api.post('/', formData);
      }

      onRefresh();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error submitting resource:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Resource Modal"
      className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-20 p-6 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
      >
        <FaTimes size={20} />
      </button>
      <h2 className="text-2xl font-semibold mb-4">
        {resource ? 'Edit Resource' : 'Add Resource'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-gray-700 font-medium mb-2"
          >
            {resource ? 'Update File (Optional)' : 'Upload File'}
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="w-full"
            {...(!resource && { required: true })}
          />
        </div>

        {preview && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Preview
            </label>
            {fileType === 'application/pdf' ? (
              <iframe
                src={preview}
                title="PDF Preview"
                className="w-full h-64 border border-gray-300 rounded"
              ></iframe>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-contain border border-gray-300 rounded"
              />
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? resource
                ? 'Updating...'
                : 'Adding...'
              : resource
              ? 'Update Resource'
              : 'Add Resource'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ResourceModal;
