// QuestionCard.jsx
import React from 'react';

const QuestionCard = ({ courseName, instructorName, totalQuestions, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="border p-4 bg-white dark:bg-text-black bg-opacity-60 hover:p-2 hover:bg-opacity-80 rounded-lg shadow hover:shadow-lg cursor-pointer"
        >
            <div className="text-l text-gray-500 font-bold dark:text-gray-800">{courseName}</div>
            <div className="text-4xl dark:text-gray-800 font-bold text-center my-2">{totalQuestions}</div>
            <div className="text-l text-gray-500 font-bold dark:text-gray-800 text-right">{instructorName}</div>
        </div>
    );
};

export default QuestionCard;
