import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaBookOpen, FaUsers,FaBook } from 'react-icons/fa';
import Api from '../../api/axiosInstance'; // Import axios for API calls
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';


const Overview = () => {
  // State to store total students
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  

   // Fetch students from the backend
   // Fetch students from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await Api.get('/students');  // Fetch data from API
        console.log("Full API Response: ", response);  // Debug: log full response

        // Check if response.data is an array of students
        if (Array.isArray(response.data)) {
          setStudents(response.data);  // Set students in state
          setTotalStudents(response.data.length);  // Set total number of students
          console.log("Total Students Count: ", response.data.length);  // Debug: log count
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);  // Log any errors
      }
    };

    fetchStudents();  // Call the function when the component mounts
  }, []);
  // Runs once when the component mounts

//instructor
const [instructors, setInstructors] = useState([]);  // State to hold instructor data
const [totalInstructors, setTotalInstructors] = useState(0);
useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await Api.get('/instructors');  // Fetch data from API (adjust endpoint as needed)
        console.log("Full API Response: ", response);  // Debug: log full response

        // Check if response.data is an array of instructors
        if (Array.isArray(response.data)) {
          setInstructors(response.data);  // Set instructors in state
          setTotalInstructors(response.data.length);  // Set total number of instructors
          console.log("Total Instructors Count: ", response.data.length);  // Debug: log count
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);  // Log any errors
      }
    };

    fetchInstructors();  // Call the function when the component mounts
  }, []); 
//total board member
const [boardMembers, setBoardMembers] = useState([]);
const [totalBoardMembers, setTotalBoardMembers] = useState(0);
useEffect(() => {
    const fetchBoardMembers = async () => {
      try {
        const response = await Api.get('/departmentBoards');
        setBoardMembers(response.data);
        setTotalBoardMembers(response.data.length);
      } catch (error) {
        console.error("Error fetching board members:", error);
      }
    };

    fetchBoardMembers();
  }, []);
//tttttt
//total courses
 // Fetch Courses
 const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
 useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await Api.get('/courses');
        setCourses(response.data);
        setTotalCourses(response.data.length);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
//courses
  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Enrollments',
        data: [50, 70, 60, 90, 100, 80],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#4B5563',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#6B7280' },
        grid: { color: '#E5E7EB' },
      },
      y: {
        ticks: { color: '#6B7280' },
        grid: { color: '#E5E7EB' },
      },
    },
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-blue-600">Department Overview</h1>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Students */}
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 flex items-center">
          <FaUserGraduate className="text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Students</h2>
            <p className="text-2xl">{totalStudents}</p> {/* Dynamic total students */}
          </div>
        </div>
        {/* Department Board Members */}
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 flex items-center">
          <FaUsers className="text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Department Board Members</h2>
            <p className="text-2xl">{totalBoardMembers}</p>
          </div>
          </div>
           {/* Total Courses */}
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 flex items-center">
          <FaBook className="text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Courses</h2>
            <p className="text-2xl">{totalCourses}</p>
          </div>
        </div>

        {/* Add other KPI cards here as needed */}
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 flex items-center">
          <FaChalkboardTeacher className="text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Instructors</h2>
            <p className="text-2xl">{totalInstructors}</p>
          </div>
        </div>

        {/* Other cards... */}
      </div>
    

      {/* Graphical Analysis Section */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Enrollment Trend (Last 6 Months)</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Overview;
