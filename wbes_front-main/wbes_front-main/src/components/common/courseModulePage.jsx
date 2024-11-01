import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../api/axiosInstance';

const CourseModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch course modules on component mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await Api.get('/api/module'); // Adjust your API route
        // Ensure the response contains an array of modules
        const modulesData = Array.isArray(response.data) ? response.data : response.data.modules || [];
        setModules(modulesData);
        console.log(modulesData)
      } catch (error) {
        console.error('Error fetching course modules:', error);
        setModules([]); // Default to empty array in case of an error
      }
    };
    fetchModules();
  }, []);

  // Navigate to add module form
  const handleAddModule = () => {
    navigate('/add-module');
  };

  // Filtered modules based on search
  const filteredModules = modules.filter(module =>
    module.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddModule}
        >
          Add Course Module
        </button>

        <input
          type="text"
          placeholder="Search modules..."
          className="border p-2 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display modules as cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((module) => (
          <div key={module._id} className="bg-white rounded-lg shadow p-4">
            <img src={module.image} alt={module.courseName} className="w-full h-32 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{module.courseName}</h3>
            <p className="text-gray-600">{module.description}</p>
            <p className="text-gray-700 mt-1">Instructor: {module.instructor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseModulesPage;
