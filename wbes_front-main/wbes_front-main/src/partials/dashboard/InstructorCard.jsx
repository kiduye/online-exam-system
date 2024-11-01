import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditMenu from '../../components/DropdownEditMenu';

function InstructorCard() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRemoveAll = () => {
    // Logic for removing all instructors goes here
    setShowConfirmation(false);
  };

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm shadow-lg rounded-xl">
      {/* Menu button */}
      <div className="absolute top-2 right-2">
        <EditMenu align="right" className="relative inline-flex">
          <li>
            <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
              Add Instructor 
            </Link>
          </li>
          <li>
            <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
              View List
            </Link>
          </li>
          <li>
            <button
              onClick={() => setShowConfirmation(true)}
              className="font-medium text-sm text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-400 flex py-1 px-3"
            >
              Remove All
            </button>
          </li>
        </EditMenu>
      </div>

      <div className="flex flex-col items-center justify-center h-full py-10">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Total Instructors</h2>
        </header>
        <div className="flex items-center justify-center">
          <div className="text-6xl font-bold text-gray-800 dark:text-gray-100">22</div>
        </div>
      </div>

      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-gray-800 dark:text-gray-100 mb-4">
              Are you sure you want to remove all instructors?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-blue-600 dark:bg-blue-900 text-gray-100 dark:text-gray-100 py-2 px-4 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveAll}
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Remove All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorCard;
