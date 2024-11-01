// src/components/DepartmentBoardCard.jsx

import React from 'react';
import { FaBuilding } from 'react-icons/fa';

const DepartmentBoardCard = ({ value }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-300 text-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="text-5xl mb-4">
        <FaBuilding />
      </div>
      <h3 className="text-xl font-bold mb-2">Department</h3>
      <p className="text-3xl font-semibold">{value}</p>
      <div className="mt-4">
        <span className="bg-white text-blue-500 rounded-full px-3 py-1 text-sm font-semibold">Details</span>
      </div>
    </div>
  );
};

export default DepartmentBoardCard;
