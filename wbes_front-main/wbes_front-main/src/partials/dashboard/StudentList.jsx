import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight, FaSearch, FaPlus } from 'react-icons/fa';

function StudentList() {
  const students = [
    { id: '0', f_name: 'Alex', l_name: 'Shatov', email: 'alexshatov@gmail.com', score: 89 },
    { id: '1', f_name: 'Philip', l_name: 'Harbach', email: 'philip.h@gmail.com', score: 76 },
    { id: '2', f_name: 'Mirko', l_name: 'Fisuk', email: 'mirkofisuk@gmail.com', score: 99 },
    { id: '3', f_name: 'Olga', l_name: 'Semklo', email: 'olga.s@cool.design', score: 122 },
    { id: '4', f_name: 'Burak', l_name: 'Long', email: 'longburak@gmail.com', score: 89 },
    { id: '5', f_name: 'John', l_name: 'Doe', email: 'johndoe@gmail.com', score: 95 },
    { id: '6', f_name: 'Jane', l_name: 'Smith', email: 'janesmith@gmail.com', score: 82 },
    { id: '7', f_name: 'Michael', l_name: 'Brown', email: 'michaelbrown@gmail.com', score: 88 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState([]);

  const totalPages = Math.ceil(students.length / rowsPerPage); 

  const handleEdit = (id) => {
    console.log(`Editing student with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Deleting student with id: ${id}`);
  };

  const handleBulkDelete = () => {
    console.log(`Deleting selected students: ${selectedStudents.join(', ')}`);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleScoreFilterChange = (event) => {
    setSelectedScoreFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleStudentSelect = (id) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((studentId) => studentId !== id)
        : [...prevSelected, id]
    );
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const filteredStudents = students
    .filter((student) => {
      return (
        student.f_name.toLowerCase().includes(searchQuery) ||
        student.l_name.toLowerCase().includes(searchQuery) ||
        student.email.toLowerCase().includes(searchQuery)
      );
    })
    .filter((student) => {
      if (selectedScoreFilter === 'all') return true;
      if (selectedScoreFilter === 'above90') return student.score > 90;
      if (selectedScoreFilter === '80to90') return student.score >= 80 && student.score <= 90;
      if (selectedScoreFilter === 'below80') return student.score < 80;
      return true;
    });
  const currentStudents = filteredStudents.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="relative pt-4 mr-2 pb-16 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between ">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 ml-2">Students</h2>
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search"
              className="px-2 py-1 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <FaSearch className="absolute right-2 top-2 text-gray-600 dark:text-gray-400" />
          </div>
          {/* Filter */}
          <select
            value={selectedScoreFilter}
            onChange={handleScoreFilterChange}
            className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <option value="all">All scores</option>
            <option value="above90">Above 90</option>
            <option value="80to90">80 to 90</option>
            <option value="below80">Below 80</option>
          </select>
        </div>
        <div className="absolute top-16 mb-6 right-2 flex space-x-2">
          {/* Add Student Button */}
          <button
            className="bg-blue-600 dark:bg-blue-900 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
          >
            <FaPlus className="mr-2" /> <span className="hidden sm:inline">Add Student</span>
          </button>
          {/* Delete Selected Button - Only show when there are selected students */}
          {selectedStudents.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              <FaTrashAlt className="mr-2" /> <span className="hidden sm:inline">Delete Selected</span>
            </button>
          )}
        </div>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(filteredStudents.map((student) => student.id));
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    />
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">F_name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">L_name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Score</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Action</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <input
                        type="checkbox"
                        onChange={() => handleStudentSelect(student.id)}
                        checked={selectedStudents.includes(student.id)}
                      />
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-gray-800 dark:text-gray-100">{student.f_name}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-gray-800 dark:text-gray-100">{student.l_name}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{student.email}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{student.score}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center flex items-center justify-center space-x-4">
                      <button onClick={() => handleEdit(student.id)}>
                        <FaEdit className="text-blue-500 hover:text-blue-700" />
                      </button>
                      <button onClick={() => handleDelete(student.id)}>
                        <FaTrashAlt className="text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Rows per page:
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="ml-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}
          >
            <FaChevronRight />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default StudentList;
