import React, { useState, useEffect } from 'react';
import Api from '../../src/api/axiosInstance'; // Adjust the path as necessary

const CourseCreator = () => {
  const [courseId, setCourseId] = useState(''); // To hold the selected course ID
  const [courseDescription, setCourseDescription] = useState('');
  const [instructorName, setInstructorName] = useState('John Doe'); // Replace with actual instructor name from state or props
  const [courseImage, setCourseImage] = useState(null);
  const [modules, setModules] = useState([{ description: '', overview: '', image: null, curriculum: [] }]);
  const [assignedCourses, setAssignedCourses] = useState([]); // To hold assigned courses

  useEffect(() => {
    const fetchAssignedCourses = async () => {
      try {
        const response = await Api.get('/instructors/assigned-courses'); // Use the Axios instance
        setAssignedCourses(response.data.courses); // Set the fetched courses
      } catch (error) {
        console.error(error);
      }
    };

    fetchAssignedCourses();
  }, []);

  const handleAddModule = () => {
    setModules([...modules, { description: '', overview: '', image: null, curriculum: [] }]);
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const handleCurriculumChange = (moduleIndex, curriculum) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].curriculum = curriculum;
    setModules(updatedModules);
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    const updatedModules = [...modules];
    updatedModules[index].image = file; // Store the file object
    setModules(updatedModules);
  };

  const handleCourseImageUpload = (e) => {
    const file = e.target.files[0];
    setCourseImage(file); // Store the course image file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the data including images
    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('courseDescription', courseDescription);
    formData.append('instructorName', instructorName);
    formData.append('courseImage', courseImage);

    // Append each module and its image to the FormData
    modules.forEach((module, index) => {
      formData.append(`modules[${index}][description]`, module.description);
      formData.append(`modules[${index}][overview]`, module.overview);
      formData.append(`modules[${index}][curriculum]`, JSON.stringify(module.curriculum));
      if (module.image) {
        formData.append(`modules[${index}][image]`, module.image);
      }
    });

    try {
      await Api.post('/modules', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Use the Axios instance
      alert('Course module created successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center">Create Course Module</h1>
      
      {/* Course Selection Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Select Course</label>
        <select 
          value={courseId} 
          onChange={(e) => setCourseId(e.target.value)} 
          required 
          className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a course</option>
          {assignedCourses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name} {/* Display course name */}
            </option>
          ))}
        </select>
      </div>

      {/* Course Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Course Description</label>
        <textarea 
          value={courseDescription} 
          onChange={(e) => setCourseDescription(e.target.value)} 
          required 
          className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 h-24"
        />
      </div>

      {/* Course Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">Upload Course Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleCourseImageUpload} 
          required 
          className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Modules Section */}
      <div>
        <h3 className="text-2xl font-semibold mb-2">Modules</h3>
        {modules.map((module, index) => (
          <div key={index} className="border border-gray-300 p-4 mb-4 rounded-lg space-y-4">
            <h4 className="font-semibold text-xl">Module {index + 1}</h4>
            <div>
              <label className="block text-sm font-medium mb-1">Module Description</label>
              <textarea 
                value={module.description} 
                onChange={(e) => handleModuleChange(index, 'description', e.target.value)} 
                required 
                className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 h-20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Module Overview</label>
              <textarea 
                value={module.overview} 
                onChange={(e) => handleModuleChange(index, 'overview', e.target.value)} 
                required 
                className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 h-20"
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium mb-1">Upload Module Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, index)} 
                required 
                className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div> */}
            <CurriculumEditor 
              moduleIndex={index} 
              onCurriculumChange={handleCurriculumChange} 
            />
          </div>
        ))}
        <button 
          type="button" 
          onClick={handleAddModule} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Module
        </button>
      </div>

      <button 
        type="submit" 
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Create Course Module
      </button>
    </form>
  );
};

const CurriculumEditor = ({ moduleIndex, onCurriculumChange }) => {
  const [topics, setTopics] = useState([{ title: '', content: '' }]);

  const handleInputChange = (index, event) => {
    const newTopics = [...topics];
    newTopics[index][event.target.name] = event.target.value;
    setTopics(newTopics);
    onCurriculumChange(moduleIndex, newTopics); // Notify parent of changes
  };

  const addTopic = () => {
    setTopics([...topics, { title: '', content: '' }]);
  };

  const removeTopic = (index) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
    onCurriculumChange(moduleIndex, newTopics); // Notify parent of changes
  };

  return (
    <div className="curriculum-editor mt-4">
      <h2 className="text-lg font-semibold">Curriculum Editor</h2>
      {topics.map((topic, index) => (
        <div key={index} className="flex flex-col space-y-2 mb-4">
          <input
            type="text"
            name="title"
            value={topic.title}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Topic Title"
            required
            className="border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            name="content"
            value={topic.content}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Topic Content"
            required
            className="border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 h-20"
          />
          <button
            type="button"
            onClick={() => removeTopic(index)}
            className="mt-1 text-red-500 hover:text-red-700"
          >
            Remove Topic
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addTopic}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Add Topic
      </button>
    </div>
  );
};

export default CourseCreator;
