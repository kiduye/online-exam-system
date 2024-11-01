import axios from 'axios';

const API_URL = '/api/student';

export const createStudent = (studentData) => { 
  return axios.post(`${API_URL}/register`, studentData);
};
