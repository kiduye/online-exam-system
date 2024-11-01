// src/components/InstructorCard.jsx

import React from 'react';
import { FaChalkboardTeacher } from 'react-icons/fa';

const InstructorCard = ({ value }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-300 text-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="text-5xl mb-4">
        <FaChalkboardTeacher />
      </div>
      <h3 className="text-xl font-bold mb-2">Instructors</h3>
      <p className="text-3xl font-semibold">{value}</p>
      <div className="mt-4">
        <span className="bg-white text-orange-500 rounded-full px-3 py-1 text-sm font-semibold">Details</span>
      </div>
    </div>
  );
};

export default InstructorCard;
