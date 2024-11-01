// src/axiosInstance.js
import axios from 'axios';
// import { store } from './app/store'; // Adjust the path as necessary

const Api = axios.create({
    baseURL: 'http://localhost:5000/api', // Update this with your backend server URL
  withCredentials: true, // Allows sending cookies with the request
});

// Add an interceptor to include the token in the Authorization header
Api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default Api;
