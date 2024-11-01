import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ManageExamSchedule = () => {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState(null); // Use Date object
  const [examTime, setExamTime] = useState('');
  const [department, setDepartment] = useState('');
  const [examList, setExamList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newExam = {
      examName,
      examDate: examDate ? examDate.toLocaleDateString() : '',
      examTime,
      department,
    };

    if (isEditing) {
      const updatedExamList = examList.map((exam, index) =>
        index === editIndex ? newExam : exam
      );
      setExamList(updatedExamList);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setExamList([...examList, newExam]);
    }

    // Reset form fields
    setExamName('');
    setExamDate(null);
    setExamTime('');
    setDepartment('');
  };

  const handleEdit = (index) => {
    const examToEdit = examList[index];
    setExamName(examToEdit.examName);
    setExamDate(new Date(examToEdit.examDate)); // Convert to Date object
    setExamTime(examToEdit.examTime);
    setDepartment(examToEdit.department);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedExamList = examList.filter((_, i) => i !== index);
    setExamList(updatedExamList);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isEditing ? 'Edit Exam Date' : 'Manage Exam Date'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="exam-name" className="sr-only">
                Exam Name
              </label>
              <input
                id="exam-name"
                name="exam-name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Exam Name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="exam-date" className="sr-only">
                Exam Date
              </label>
              <DatePicker
                selected={examDate}
                onChange={(date) => setExamDate(date)}
                dateFormat="MM/dd/yyyy"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholderText="Select Exam Date"
              />
            </div>
            <div>
              <label htmlFor="exam-time" className="sr-only">
                Exam Time
              </label>
              <input
                id="exam-time"
                name="exam-time"
                type="time"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={examTime}
                onChange={(e) => setExamTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="department" className="sr-only">
                Department/Course
              </label>
              <input
                id="department"
                name="department"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Department/Course"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Update Exam Date' : 'Save Exam Date'}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Scheduled Exams</h3>
          <ul className="mt-4 space-y-4">
            {examList.map((exam, index) => (
              <li
                key={index}
                className="bg-white shadow overflow-hidden sm:rounded-md px-4 py-4 sm:px-6 sm:py-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600">{exam.examName}</div>
                  <div className="ml-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {exam.examDate} at {exam.examTime}
                </div>
                <div className="mt-2 text-sm text-gray-500">{exam.department}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageExamSchedule;
