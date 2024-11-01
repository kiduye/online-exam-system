// src/hooks/useCurrentUser.js
import { useSelector } from 'react-redux';

export const useCurrentUser = () => {
  const user = useSelector((state) => state.user); 

  return {
    email: user.email,
    _id: user._id,
    role: user.role,
    studentName: user.studentName, // Access studentName from Redux store
  };
};
