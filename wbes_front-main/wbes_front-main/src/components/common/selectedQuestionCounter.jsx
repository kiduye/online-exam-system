// SelectedQuestionsCounter.jsx
import React from 'react';

const SelectedQuestionsCounter = ({ count }) => {
    return (
        <div className="p-2 text-sm">
            Selected Questions: <span className="font-bold">{count}</span>
        </div>
    );
};

export default SelectedQuestionsCounter;
