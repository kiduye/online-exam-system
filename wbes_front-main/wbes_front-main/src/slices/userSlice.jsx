// src/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    _id:'',
    role: '',
    studentName: '', // New field for student name
    token: '',       // Optional field for JWT token
  },
  reducers: {
    setUser: (state, action) => {
      const { email, _id, role, firstName, token } = action.payload; // Use firstName here
      state.email = email;
      state._id =_id;
      state.role = role;
      state.studentName = firstName; // Set student name
      state.token = token || '';      // Set token, if available
    },
    clearUser: (state) => {
      state.email = '';
      state._id ='';
      state.role = '';
      state.studentName = '';  // Clear student name
      state.token = '';        // Clear token
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
