import React from 'react';
import Modal from 'react-modal';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

Modal.setAppElement('#root');

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmation Dialog"
      className="bg-white rounded-lg shadow-lg max-w-md mx-auto my-20 p-6 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
      >
        <FaTimes size={20} />
      </button>
      <div className="flex items-center mb-4">
        <FaExclamationTriangle className="text-red-500 mr-3" size={24} />
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <p className="mb-6 text-gray-700">{message}</p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
