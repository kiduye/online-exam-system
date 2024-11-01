import React, { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Api from "../../api/axiosInstance";
import TextEditor from "../../components/common/textEditor"; // Import the TextEditor component
import BulkUpload from "../../components/common/bulkUpload";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: ["", ""],
    answer: "",
    courseId: "", // Add courseId to track selected course
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await Api.get("/instructors/assigned-courses");
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await Api.get("/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions", error);
      }
    };
    fetchQuestions();
  }, []);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewQuestion({
      questionText: "",
      options: ["", ""],
      answer: "",
      courseId: "", // Reset course selection
    });
  };

  const openEditModal = (question) => {
    setCurrentQuestion(question);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentQuestion(null);
  };

  const handleAddOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const handleOptionChange = (index, value) => {
    setNewQuestion((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (newQuestion.options.length < 2) {
      alert("A question must have at least 2 options.");
      return;
    }
    if (!newQuestion.options.includes(newQuestion.answer)) {
      alert("The answer must be one of the options.");
      return;
    }
    if (!newQuestion.courseId) {
      alert("Please select a course.");
      return;
    }
    try {
      await Api.post("/questions", newQuestion);
      setConfirmationMessage("Question added successfully!");
      setTimeout(() => setConfirmationMessage(null), 4000);
      closeAddModal();
      const response = await Api.get("/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Error adding question", error);
    }
  };

  const handleEditQuestion = async (e) => {
    e.preventDefault();
    if (currentQuestion.options.length < 2) {
      alert("A question must have at least 2 options.");
      return;
    }
    if (!currentQuestion.options.includes(currentQuestion.answer)) {
      alert("The answer must be one of the options.");
      return;
    }
    if (!currentQuestion.courseId) {
      alert("Please select a course.");
      return;
    }
    try {
      await Api.put(`/questions/${currentQuestion._id}`, currentQuestion);
      setConfirmationMessage("Question updated successfully!");
      setTimeout(() => setConfirmationMessage(null), 4000);
      closeEditModal();
      const response = await Api.get("/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Error editing question", error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        await Api.delete(`/questions/${id}`);
        setConfirmationMessage("Question deleted successfully!");
        setTimeout(() => setConfirmationMessage(null), 4000);
        setQuestions(questions.filter((q) => q._id !== id));
      } catch (error) {
        console.error("Error deleting question", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 ">
        <BulkUpload />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Questions</h1>
        <div className="flex items-center">
          <select
            className="mr-4 border rounded-md"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Question
          </button>
        </div>
      </div>

      {confirmationMessage && (
        <div className="mb-4 p-4 bg-green-500 text-white rounded">
          {confirmationMessage}
        </div>
      )}

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4">Question</th>
            <th className="py-2 px-4">Options</th>
            <th className="py-2 px-4">Answer</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question._id} className="bg-gray-100 border-b">
              <td className="py-2 px-4">{question.questionText}</td>
              <td className="py-2 px-4">{question.options.join(", ")}</td>
              <td className="py-2 px-4">{question.answer}</td>
              <td className="py-2 px-4 flex space-x-2">
                <button
                  onClick={() => openEditModal(question)}
                  className="text-blue-500"
                >
                  <AiFillEdit size={24} />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question._id)}
                  className="text-red-500"
                >
                  <AiFillDelete size={24} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2 max-h-[60vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Question</h2>
            <form onSubmit={handleAddQuestion}>
              <div className="mb-4">
                <label className="block text-gray-700">Select Course</label>
                <select
                  className="w-full border rounded-md"
                  value={newQuestion.courseId}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, courseId: e.target.value })
                  }
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Question</label>
                <TextEditor
                  value={newQuestion.questionText}
                  onChange={(value) =>
                    setNewQuestion({ ...newQuestion, questionText: value })
                  }
                />
              </div>
              {newQuestion.options.map((option, index) => (
                <div className="mb-4" key={index}>
                  <label className="block text-gray-700">
                    Option {index + 1}
                  </label>
                  <TextEditor
                    value={option}
                    onChange={(value) => handleOptionChange(index, value)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mb-4"
                onClick={handleAddOption}
              >
                Add Option
              </button>
              <div className="mb-4">
                <label className="block text-gray-700">Answer</label>
                <TextEditor
                  value={newQuestion.answer}
                  onChange={(value) =>
                    setNewQuestion({ ...newQuestion, answer: value })
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={closeAddModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentQuestion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2 max-h-[60vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Question</h2>
            <form onSubmit={handleEditQuestion}>
              <div className="mb-4">
                <label className="block text-gray-700">Select Course</label>
                <select
                  className="w-full border rounded-md"
                  value={currentQuestion.courseId}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      courseId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Question</label>
                <TextEditor
                  value={currentQuestion.questionText}
                  onChange={(value) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      questionText: value,
                    })
                  }
                />
              </div>
              {currentQuestion.options.map((option, index) => (
                <div className="mb-4" key={index}>
                  <label className="block text-gray-700">
                    Option {index + 1}
                  </label>
                  <TextEditor
                    value={option}
                    onChange={(value) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        options: currentQuestion.options.map((opt, i) =>
                          i === index ? value : opt
                        ),
                      })
                    }
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-gray-700">Answer</label>
                <TextEditor
                  value={currentQuestion.answer}
                  onChange={(value) =>
                    setCurrentQuestion({ ...currentQuestion, answer: value })
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
