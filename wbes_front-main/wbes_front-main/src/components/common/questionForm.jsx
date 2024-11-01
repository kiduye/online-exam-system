import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Toolbar from './toolbar';
import Question from './question';
import Api from '../../api/axiosInstance';
const QuestionForm = () => {
  const [questions, setQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load saved questions from localStorage when the component mounts
  useEffect(() => {
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  // Auto-save questions to localStorage every 5 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      localStorage.setItem('questions', JSON.stringify(questions));
    }, 5000);

    return () => clearInterval(autoSaveInterval); // Clear interval on component unmount
  }, [questions]);

  const handleAddQuestion = (questionText) => {
    // Validate that the last question has at least 4 choices
    if (questions.length > 0 && questions[questions.length - 1].choices.length < 4) {
      setErrorMessage('Please add at least 4 options to the current question before adding a new one.');
      return;
    }

    setErrorMessage(''); // Clear any previous error message

    if (editIndex !== null) {
      // Editing an existing question
      const updatedQuestions = questions.map((q, i) =>
        i === editIndex ? { ...q, text: questionText } : q
      );
      setQuestions(updatedQuestions);
      setEditIndex(null); // Reset edit index after updating
    } else {
      // Adding a new question
      setQuestions([
        ...questions,
        { text: questionText, choices: [], correctAnswer: null, answer: '' }
      ]);
    }
  };

  const handleAddChoice = (choiceText) => {
    const updatedQuestions = [...questions];
    const lastQuestionIndex = updatedQuestions.length - 1;
    if (lastQuestionIndex >= 0) {
      updatedQuestions[lastQuestionIndex].choices.push(choiceText);
      setQuestions(updatedQuestions);
    }
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? updatedQuestion : q
    );
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setEditIndex(index);
    // Assuming `handleAddQuestion` would update the text and set `editIndex` appropriately
    handleAddQuestion(questionToEdit.text);
  };

  const handleClearQuestions = () => {
    setQuestions([]);
    localStorage.removeItem('questions'); // Clear saved questions
  };

  const handleSubmitQuestions = async () => {
    try {
      // Post each question to the backend
      for (const question of questions) {
        await Api.post('/questions', question);
      }
      console.log('Questions submitted:', questions);
      setQuestions([]);
      localStorage.removeItem('questions'); // Clear saved questions after submission
    } catch (error) {
      console.error('Error submitting questions:', error);
    }
  };

  return (
    <div>
      {/* Fixed Toolbar */}
      <div className="absolute overlay top-40 right-30 left-80 bg-blue-100 shadow-md z-30">
        <Toolbar onAddQuestion={handleAddQuestion} onAddChoice={handleAddChoice} />
      </div>

      {/* Content Below Toolbar */}
      <div className="mt-60">
        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}

        {questions.map((question, index) => (
          <div key={index} className="relative mb-4 p-4 border rounded-lg">
            <Question
              index={index}
              question={question}
              questionNumber={index + 1}
              onChange={handleQuestionChange}
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <button
                onClick={() => handleEditQuestion(index)}
                className="p-2 bg-blue-500 text-white rounded-md"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleRemoveQuestion(index)}
                className="p-2 bg-red-500 text-white rounded-md"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        <button
          className="mt-4 p-2 bg-green-500 text-white rounded-md"
          onClick={handleSubmitQuestions}
        >
          Submit All Questions
        </button>
        <button
          className="mt-4 ml-4 p-2 bg-red-500 text-white rounded-md"
          onClick={handleClearQuestions}
        >
          Clear Questions
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;
