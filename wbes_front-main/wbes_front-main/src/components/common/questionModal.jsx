import { useState, useEffect } from 'react';

const QuestionModal = ({ isOpen, onClose, onSubmit, questionData = {} }) => {
  // Destructure properties with default values
  const {
    questionText = '',
    options = [],
    answer = ''
  } = questionData;

  const [currentQuestionText, setQuestionText] = useState(questionText);
  const [currentOptions, setOptions] = useState(options);
  const [currentAnswer, setAnswer] = useState(answer);

  useEffect(() => {
    // Update state when questionData changes
    setQuestionText(questionText);
    setOptions(options);
    setAnswer(answer);
  }, [questionData]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ questionText: currentQuestionText, options: currentOptions, answer: currentAnswer });
    onClose(); // Close the modal after submitting
  };

  if (!isOpen) return null; // Don't render modal if it's not open

  const isEditing = Boolean(questionData._id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg  max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{isEditing ? 'Edit Question' : 'Add Question'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Question</label>
            <textarea
              value={currentQuestionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Options</label>
            {currentOptions.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder={`Option ${index + 1}`}
                required
              />
            ))}
            <button
              type="button"
              onClick={() => setOptions([...currentOptions, ''])}
              className="bg-blue-500 text-white py-1 px-4 rounded mt-2"
            >
              Add Option
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Answer</label>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              {isEditing ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
