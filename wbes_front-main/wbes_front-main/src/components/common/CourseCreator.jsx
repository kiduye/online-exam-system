// // src/components/CourseCreator.jsx

// import React, { useReducer, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';

// // Initial State
// const initialState = {
//   courseName: '',
//   courseImage: null,
//   courseDescription: '',
//   overview: '',
//   chapters: [],
//   instructorName: 'John Doe', // Replace with dynamic instructor name if available
// };

// // Reducer Function
// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_COURSE_NAME':
//       return { ...state, courseName: action.payload };
//     case 'SET_COURSE_IMAGE':
//       return { ...state, courseImage: action.payload };
//     case 'SET_COURSE_DESCRIPTION':
//       return { ...state, courseDescription: action.payload };
//     case 'SET_OVERVIEW':
//       return { ...state, overview: action.payload };
//     case 'ADD_CHAPTER':
//       return {
//         ...state,
//         chapters: [
//           ...state.chapters,
//           { id: uuidv4(), title: '', lessons: [] },
//         ],
//       };
//     case 'REMOVE_CHAPTER':
//       return {
//         ...state,
//         chapters: state.chapters.filter(
//           (chapter) => chapter.id !== action.payload
//         ),
//       };
//     case 'SET_CHAPTER_TITLE':
//       return {
//         ...state,
//         chapters: state.chapters.map((chapter) =>
//           chapter.id === action.payload.id
//             ? { ...chapter, title: action.payload.title }
//             : chapter
//         ),
//       };
//     case 'ADD_LESSON':
//       return {
//         ...state,
//         chapters: state.chapters.map((chapter) =>
//           chapter.id === action.payload
//             ? {
//                 ...chapter,
//                 lessons: [
//                   ...chapter.lessons,
//                   { id: uuidv4(), title: '', content: '' },
//                 ],
//               }
//             : chapter
//         ),
//       };
//     case 'REMOVE_LESSON':
//       return {
//         ...state,
//         chapters: state.chapters.map((chapter) =>
//           chapter.id === action.payload.chapterId
//             ? {
//                 ...chapter,
//                 lessons: chapter.lessons.filter(
//                   (lesson) => lesson.id !== action.payload.lessonId
//                 ),
//               }
//             : chapter
//         ),
//       };
//     case 'SET_LESSON_TITLE':
//       return {
//         ...state,
//         chapters: state.chapters.map((chapter) =>
//           chapter.id === action.payload.chapterId
//             ? {
//                 ...chapter,
//                 lessons: chapter.lessons.map((lesson) =>
//                   lesson.id === action.payload.lessonId
//                     ? { ...lesson, title: action.payload.title }
//                     : lesson
//                 ),
//               }
//             : chapter
//         ),
//       };
//     case 'SET_LESSON_CONTENT':
//       return {
//         ...state,
//         chapters: state.chapters.map((chapter) =>
//           chapter.id === action.payload.chapterId
//             ? {
//                 ...chapter,
//                 lessons: chapter.lessons.map((lesson) =>
//                   lesson.id === action.payload.lessonId
//                     ? { ...lesson, content: action.payload.content }
//                     : lesson
//                 ),
//               }
//             : chapter
//         ),
//       };
//     case 'RESET_FORM':
//       return initialState;
//     default:
//       return state;
//   }
// };

// const CourseCreator = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const [currentSection, setCurrentSection] = useState('information'); // 'information' or 'details'
//   const [message, setMessage] = useState({ type: '', text: '' });

//   // Handle Image Upload with Validation
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
//       const maxSize = 2 * 1024 * 1024; // 2MB

//       if (!validTypes.includes(file.type)) {
//         setMessage({
//           type: 'error',
//           text: 'Only JPEG, PNG, and GIF files are allowed.',
//         });
//         return;
//       }

//       if (file.size > maxSize) {
//         setMessage({
//           type: 'error',
//           text: 'Image size should be less than 2MB.',
//         });
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         dispatch({ type: 'SET_COURSE_IMAGE', payload: reader.result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle Form Submission with Validation
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Basic Validation
//     if (!state.courseName.trim()) {
//       setMessage({ type: 'error', text: 'Course name is required.' });
//       return;
//     }
//     if (!state.courseDescription.trim()) {
//       setMessage({ type: 'error', text: 'Course description is required.' });
//       return;
//     }
//     if (state.chapters.length === 0) {
//       setMessage({ type: 'error', text: 'At least one chapter is required.' });
//       return;
//     }

//     // Further validations can be added here (e.g., check lessons)

//     // If all validations pass
//     console.log('Course Details:', state);
//     setMessage({ type: 'success', text: 'Course submitted successfully!' });

//     // Optionally reset the form
//     // dispatch({ type: 'RESET_FORM' });
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-6 text-gray-700">Create a New Course</h1>

//       {message.text && (
//         <div className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
//           {message.text}
//         </div>
//       )}

//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <form onSubmit={handleSubmit}>
//           {/* Course Information Section */}
//           <div className={currentSection === 'information' ? 'block' : 'hidden'}>
//             <h2 className="text-xl font-medium mb-4">Course Information</h2>

//             <label htmlFor="courseName" className="block text-gray-700">Course Name<span className="text-red-500">*</span></label>
//             <input
//               type="text"
//               id="courseName"
//               className="w-full p-2 mb-4 border border-gray-300 rounded"
//               placeholder="Enter Course Name"
//               value={state.courseName}
//               onChange={(e) =>
//                 dispatch({ type: 'SET_COURSE_NAME', payload: e.target.value })
//               }
//               required
//             />

//             <label htmlFor="courseImage" className="block text-gray-700">Course Image</label>
//             <input
//               type="file"
//               id="courseImage"
//               className="block w-full mb-4"
//               accept="image/*"
//               onChange={handleImageUpload}
//             />
//             {state.courseImage && (
//               <div className="w-40 h-40">
//                 <img
//                   src={state.courseImage}
//                   alt="Course Preview"
//                   className="w-full h-full object-cover rounded-md"
//                 />
//               </div>
//             )}

//             <label htmlFor="courseDescription" className="block text-gray-700">Course Description<span className="text-red-500">*</span></label>
//             <textarea
//               id="courseDescription"
//               className="w-full p-2 mb-4 border border-gray-300 rounded"
//               placeholder="Enter Course Description"
//               value={state.courseDescription}
//               onChange={(e) =>
//                 dispatch({
//                   type: 'SET_COURSE_DESCRIPTION',
//                   payload: e.target.value,
//                 })
//               }
//               required
//             />

//             <label className="block text-gray-700">Instructor Name</label>
//             <div className="mb-4 p-2 bg-gray-100 rounded text-gray-700">
//               {state.instructorName}
//             </div>

//             <button
//               type="button"
//               onClick={() => setCurrentSection('details')}
//               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//             >
//               Next
//             </button>
//           </div>

//           {/* Course Details Section */}
//           <div className={currentSection === 'details' ? 'block' : 'hidden'}>
//             <h2 className="text-xl font-medium mb-4">Course Details</h2>

//             <label htmlFor="overview" className="block text-gray-700">Course Overview</label>
//             <textarea
//               id="overview"
//               className="w-full p-2 mb-4 border border-gray-300 rounded"
//               placeholder="Enter a high-level overview of the course content"
//               value={state.overview}
//               onChange={(e) =>
//                 dispatch({ type: 'SET_OVERVIEW', payload: e.target.value })
//               }
//             />

//             <label className="block text-gray-700">Chapters</label>
//             <button
//               type="button"
//               onClick={() => dispatch({ type: 'ADD_CHAPTER' })}
//               className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//             >
//               + Add Chapter
//             </button>

//             {state.chapters.map((chapter) => (
//               <div key={chapter.id} className="mb-4">
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="text"
//                     placeholder="Chapter Title"
//                     className="w-full p-2 border border-gray-300 rounded"
//                     value={chapter.title}
//                     onChange={(e) =>
//                       dispatch({
//                         type: 'SET_CHAPTER_TITLE',
//                         payload: { id: chapter.id, title: e.target.value },
//                       })
//                     }
//                   />
//                   <button
//                     type="button"
//                     onClick={() =>
//                       dispatch({ type: 'REMOVE_CHAPTER', payload: chapter.id })
//                     }
//                     className="ml-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
//                   >
//                     Remove
//                   </button>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => dispatch({ type: 'ADD_LESSON', payload: chapter.id })}
//                   className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
//                 >
//                   + Add Lesson
//                 </button>

//                 {chapter.lessons.map((lesson) => (
//                   <div key={lesson.id} className="pl-6 mt-2">
//                     <div className="flex items-center mb-2">
//                       <input
//                         type="text"
//                         placeholder="Lesson Title"
//                         className="w-full p-2 border border-gray-300 rounded"
//                         value={lesson.title}
//                         onChange={(e) =>
//                           dispatch({
//                             type: 'SET_LESSON_TITLE',
//                             payload: {
//                               chapterId: chapter.id,
//                               lessonId: lesson.id,
//                               title: e.target.value,
//                             },
//                           })
//                         }
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           dispatch({
//                             type: 'REMOVE_LESSON',
//                             payload: {
//                               chapterId: chapter.id,
//                               lessonId: lesson.id,
//                             },
//                           })
//                         }
//                         className="ml-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
//                       >
//                         Remove
//                       </button>
//                     </div>

//                     <textarea
//                       placeholder="Lesson Content"
//                       className="w-full p-2 border border-gray-300 rounded"
//                       value={lesson.content}
//                       onChange={(e) =>
//                         dispatch({
//                           type: 'SET_LESSON_CONTENT',
//                           payload: {
//                             chapterId: chapter.id,
//                             lessonId: lesson.id,
//                             content: e.target.value,
//                           },
//                         })
//                       }
//                     />
//                   </div>
//                 ))}
//               </div>
//             ))}

//             <button
//               type="submit"
//               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//             >
//               Submit Course
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CourseCreator;


import React, { useState, useEffect } from 'react';
import Api from '../../api/axiosInstance';

const CourseModuleManager = () => {
  const [courseModules, setCourseModules] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    description: '',
    overview: '',
    image: null,
    curriculum: []
  });
  const [mainTopic, setMainTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [title, setTitle] = useState({ name: '', content: '', image: null });

  const fetchCourseModules = async () => {
    try {
      const res = await Api.get('/api/course-modules');
      setCourseModules(res.data);
    } catch (error) {
      console.error('Error fetching course modules:', error);
    }
  };

  const fetchInstructorCourses = async () => {
    try {
      const res = await Api.get('/api/instructor/courses');
      setInstructorCourses(res.data);
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
    }
  };

  useEffect(() => {
    fetchCourseModules();
    fetchInstructorCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const addMainTopic = async () => {
    try {
      const res = await Api.post(`/api/module/${formData.courseId}/add-main-topic`, {
        mainTopic
      });
      setFormData({
        ...formData,
        curriculum: [...formData.curriculum, res.data.courseModule.curriculum]
      });
      setMainTopic('');
    } catch (error) {
      console.error('Error adding main topic:', error);
    }
  };

  const addSubTopic = async (mainTopicId) => {
    try {
      const res = await Api.post(`/api/module/${formData.courseId}/mainTopic/${mainTopicId}/add-subtopic`, {
        subTopic
      });
      const updatedCurriculum = formData.curriculum.map((topic) => 
        topic._id === mainTopicId ? { ...topic, subTopics: [...topic.subTopics, res.data.subTopic] } : topic
      );
      setFormData({
        ...formData,
        curriculum: updatedCurriculum
      });
      setSubTopic('');
    } catch (error) {
      console.error('Error adding subtopic:', error);
    }
  };

  const addTitle = async (mainTopicId, subTopicId) => {
    const form = new FormData();
    form.append('title', title.name);
    form.append('content', title.content);
    form.append('image', title.image);

    try {
      const res = await Api.post(`/api/module/${formData.courseId}/mainTopic/${mainTopicId}/subTopic/${subTopicId}/add-title`, form);
      const updatedCurriculum = formData.curriculum.map((topic) =>
        topic._id === mainTopicId
          ? {
              ...topic,
              subTopics: topic.subTopics.map((sub) =>
                sub._id === subTopicId
                  ? { ...sub, titles: [...sub.titles, res.data.title] }
                  : sub
              )
            }
          : topic
      );
      setFormData({
        ...formData,
        curriculum: updatedCurriculum
      });
      setTitle({ name: '', content: '', image: null });
    } catch (error) {
      console.error('Error adding title:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('courseId', formData.courseId);
    form.append('description', formData.description);
    form.append('overview', formData.overview);
    form.append('image', formData.image);
    form.append('curriculum', JSON.stringify(formData.curriculum));

    try {
      const res = await Api.post('/api/module', form);
      setCourseModules([...courseModules, res.data.courseModule]);
      setFormData({ courseId: '', description: '', overview: '', image: null, curriculum: [] });
    } catch (error) {
      console.error('Error creating course module:', error);
    }
  };

  return (
    <div className="course-module-manager">
      <h1>Create Course Module</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="courseId">Course</label>
        <select name="courseId" value={formData.courseId} onChange={handleInputChange} required>
          <option value="">Select a Course</option>
          {instructorCourses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>

        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="overview">Overview</label>
        <textarea
          name="overview"
          value={formData.overview}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="image">Upload Image</label>
        <input type="file" name="image" onChange={handleFileChange} accept="image/*" required />

        <button type="submit">Create Module</button>
      </form>

      <h2>Curriculum Management</h2>

      <div>
        <label>Main Topic</label>
        <input
          type="text"
          value={mainTopic}
          onChange={(e) => setMainTopic(e.target.value)}
        />
        <button onClick={addMainTopic}>Add Main Topic</button>
      </div>

      {formData.curriculum.map((mainTopic) => (
        <div key={mainTopic._id}>
          <h3>{mainTopic.mainTopic}</h3>

          <label>Sub Topic</label>
          <input
            type="text"
            value={subTopic}
            onChange={(e) => setSubTopic(e.target.value)}
          />
          <button onClick={() => addSubTopic(mainTopic._id)}>Add Subtopic</button>

          {mainTopic.subTopics.map((subTopic) => (
            <div key={subTopic._id}>
              <h4>{subTopic.subTopic}</h4>

              <label>Title</label>
              <input
                type="text"
                value={title.name}
                onChange={(e) => setTitle({ ...title, name: e.target.value })}
              />
              <label>Content</label>
              <textarea
                value={title.content}
                onChange={(e) => setTitle({ ...title, content: e.target.value })}
              />
              <label>Upload Image</label>
              <input type="file" onChange={(e) => setTitle({ ...title, image: e.target.files[0] })} />

              <button onClick={() => addTitle(mainTopic._id, subTopic._id)}>Add Title</button>
            </div>
          ))}
        </div>
      ))}

      <h2>Existing Course Modules</h2>
      {courseModules.map((module) => (
        <div key={module._id}>
          <h3>{module.courseName.name}</h3>
          <p>{module.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseModuleManager;
