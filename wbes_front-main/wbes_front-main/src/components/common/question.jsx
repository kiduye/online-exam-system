import React from 'react';

const Question = ({ question, index, onChange, questionNumber }) => {

  const handleCorrectAnswerChange = (choiceIndex) => {
    onChange(index, {
      ...question,
      correctAnswer: choiceIndex,
      answer: question.choices[choiceIndex]
    });
  };

  return (
    <div className="mb-4 p-4 border rounded-lg">
      <div className="mb-2 font-bold">Question {questionNumber}</div>
      <div className="mt-4">
        <div className="p-2 border rounded-md mb-2">{question.text}</div>
        {question.choices.map((choice, idx) => (
          <div key={idx} className="mb-2 flex items-center">
            <input
              type="radio"
              name={`correctAnswer-${index}`}
              value={idx}
              checked={question.correctAnswer === idx}
              onChange={() => handleCorrectAnswerChange(idx)}
              className="mr-2"
            />
            <div className="p-2 border rounded-md flex-grow">{choice}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
