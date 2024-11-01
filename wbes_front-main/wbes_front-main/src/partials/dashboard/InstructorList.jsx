// import React, { useState } from 'react';
// import { FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight, FaSearch, FaPlus, FaTrash } from 'react-icons/fa';

// function InstructorList() {
//   const instructors = [
//     { id: '0', f_name: 'Alex', l_name: 'Shatov', email: 'alexshatov@gmail.com', score: 89 },
//     { id: '1', f_name: 'Philip', l_name: 'Harbach', email: 'philip.h@gmail.com', score: 76 },
//     { id: '2', f_name: 'Mirko', l_name: 'Fisuk', email: 'mirkofisuk@gmail.com', score: 99 },
//     { id: '3', f_name: 'Olga', l_name: 'Semklo', email: 'olga.s@cool.design', score: 122 },
//     { id: '4', f_name: 'Burak', l_name: 'Long', email: 'longburak@gmail.com', score: 89 },
//     { id: '5', f_name: 'John', l_name: 'Doe', email: 'johndoe@gmail.com', score: 95 },
//     { id: '6', f_name: 'Jane', l_name: 'Smith', email: 'janesmith@gmail.com', score: 82 },
//     { id: '7', f_name: 'Michael', l_name: 'Brown', email: 'michaelbrown@gmail.com', score: 88 },
//   ];

//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedInstructors, setSelectedInstructors] = useState([]);

//   const totalPages = Math.ceil(instructors.length / rowsPerPage);

//   const handleEdit = (id) => {
//     console.log(`Editing instructor with id: ${id}`);
//   };

//   const handleDelete = (id) => {
//     console.log(`Deleting instructor with id: ${id}`);
//     // Perform deletion logic here
//   };

//   const handleBulkDelete = () => {
//     console.log(`Deleting instructors with ids: ${selectedInstructors.join(', ')}`);
//     // Perform bulk deletion logic here
//     setSelectedInstructors([]);
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(1); // Reset to first page when rows per page changes
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleSelectInstructor = (id) => {
//     setSelectedInstructors((prevSelected) =>
//       prevSelected.includes(id)
//         ? prevSelected.filter((instructorId) => instructorId !== id)
//         : [...prevSelected, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedInstructors.length === filteredInstructors.length) {
//       setSelectedInstructors([]);
//     } else {
//       setSelectedInstructors(filteredInstructors.map((instructor) => instructor.id));
//     }
//   };

//   const filteredInstructors = instructors.filter(
//     (instructor) =>
//       instructor.f_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       instructor.l_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       instructor.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const currentInstructors = filteredInstructors.slice(startIndex, startIndex + rowsPerPage);

//   return (
//     <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
//       <header className="relative pt-4 mr-2 pb-16 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100 ml-2">Instructors</h2>
//         <div className="flex items-center space-x-2">
//           {/* Search */}
//           <div className="relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               placeholder="Search"
//               className="px-2 py-1 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
//             />
//             <FaSearch className="absolute right-2 top-2 text-gray-600 dark:text-gray-400" />
//           </div>
//         </div>
//         <div className="absolute top-16 mb-6 right-4 flex space-x-2">
//           {/* Add Instructor Button */}
//           <button
//             className="bg-blue-600  hover:bg-blue-900 text-white py-2 px-4 rounded-md flex items-center"
//           >
//             <FaPlus className="mr-2" /> <span className="hidden sm:inline">Add Instructor</span>
//           </button>
//           {/* Bulk Delete Button */}
//           {selectedInstructors.length > 0 && (
//             <button
//               onClick={handleBulkDelete}
//               className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center"
//             >
//               <FaTrash className="mr-2" /> <span className="hidden sm:inline">Delete Selected</span>
//             </button>
//           )}
//         </div>
//       </header>
      // <div className="p-3">
      //   {/* Table */}
      //   <div className="overflow-x-auto">
      //     <table className="table-auto w-full">
      //       {/* Table header */}
      //       <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
      //         <tr>
      //           <th className="p-2 whitespace-nowrap">
      //             <input
      //               type="checkbox"
      //               checked={selectedInstructors.length === filteredInstructors.length}
      //               onChange={handleSelectAll}
      //             />
      //           </th>
      //           <th className="p-2 whitespace-nowrap">
      //             <div className="font-semibold text-left">First Name</div>
      //           </th>
      //           <th className="p-2 whitespace-nowrap">
      //             <div className="font-semibold text-left">Last Name</div>
      //           </th>
      //           <th className="p-2 whitespace-nowrap">
      //             <div className="font-semibold text-left">Email</div>
      //           </th>
      //           <th className="p-2 whitespace-nowrap">
      //             <div className="font-semibold text-left">Score</div>
      //           </th>
      //           <th className="p-2 whitespace-nowrap">
      //             <div className="font-semibold text-center">Action</div>
      //           </th>
      //         </tr>
      //       </thead>
      //       {/* Table body */}
      //       <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
      //         {currentInstructors.map((instructor) => (
      //           <tr key={instructor.id}>
      //             <td className="p-2 whitespace-nowrap">
      //               <input
      //                 type="checkbox"
      //                 checked={selectedInstructors.includes(instructor.id)}
      //                 onChange={() => handleSelectInstructor(instructor.id)}
      //               />
      //             </td>
      //             <td className="p-2 whitespace-nowrap">
      //               <div className="text-left font-medium text-gray-800 dark:text-gray-100">{instructor.f_name}</div>
      //             </td>
      //             <td className="p-2 whitespace-nowrap">
      //               <div className="text-left font-medium text-gray-800 dark:text-gray-100">{instructor.l_name}</div>
      //             </td>
      //             <td className="p-2 whitespace-nowrap">
      //               <div className="text-left">{instructor.email}</div>
      //             </td>
      //             <td className="p-2 whitespace-nowrap">
      //               <div className="text-left font-medium text-green-500">{instructor.score}</div>
      //             </td>
      //             <td className="p-2 whitespace-nowrap">
      //               <div className="flex justify-center space-x-4">
      //                 <button
      //                   onClick={() => handleEdit(instructor.id)}
      //                   className="text-blue-500 hover:text-blue-700"
      //                   aria-label="Edit"
      //                 >
      //                   <FaEdit />
      //                 </button>
      //                 <button
      //                   onClick={() => handleDelete(instructor.id)}
      //                   className="text-red-500 hover:text-red-700"
      //                   aria-label="Delete"
      //                 >
      //                   <FaTrashAlt />
      //                 </button>
      //               </div>
      //             </td>
      //           </tr>
      //         ))}
      //       </tbody>
      //     </table>
      //   </div>
      //  </div>

//       {/* Footer */}
//       <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
//         {/* Rows per page selector */}
//         <div>
//           <select
//             value={rowsPerPage}
//             onChange={handleRowsPerPageChange}
//             className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={15}>15</option>
//           </select>
//         </div>
//         {/* Pagination controls */}
//         <div className="flex items-center space-x-2 ">
//           <button
//             onClick={handlePreviousPage}
//             disabled={currentPage === 1}
//             className={`px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}
//           >
//             <FaChevronLeft />
//           </button>
//           <span className="text-sm text-gray-600 dark:text-gray-400">
//             {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}
//           >
//             <FaChevronRight />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default InstructorList; 


import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight, FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import AssignCourses from './AssignCourses'; // Import the new component

function InstructorList() {
  // Your existing state and methods

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Add AssignCourses component here */}
      <AssignCourses />

      {/* Existing Instructor Table */}
      <header className="relative pt-4 mr-2 pb-16 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 ml-2">Instructors</h2>
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
        </div>
        <div className="absolute top-16 mb-6 right-4 flex space-x-2">
          <button className="bg-blue-600  hover:bg-blue-900 text-white py-2 px-4 rounded-md flex items-center">
            <FaPlus className="mr-2" /> <span className="hidden sm:inline">Add Instructor</span>
          </button>
          {selectedInstructors.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              <FaTrash className="mr-2" /> <span className="hidden sm:inline">Delete Selected</span>
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
                  <input
                    type="checkbox"
                    checked={selectedInstructors.length === filteredInstructors.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">First Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Last Name</div>
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
              {currentInstructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td className="p-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedInstructors.includes(instructor.id)}
                      onChange={() => handleSelectInstructor(instructor.id)}
                    />
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-gray-800 dark:text-gray-100">{instructor.f_name}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-gray-800 dark:text-gray-100">{instructor.l_name}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{instructor.email}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-green-500">{instructor.score}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleEdit(instructor.id)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(instructor.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       </div>
    </div>
  );
}

export default InstructorList;
