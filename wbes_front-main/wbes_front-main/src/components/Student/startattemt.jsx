// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography, Divider } from '@mui/material';
// import Api from '../../api/axiosInstance'; // Adjust this import as needed
// import ExamPage from './exam'; // Import the ExamPage component

// const ExamPassword = ({ examId, onClose }) => {
//     const [password, setPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [isExamOpen, setIsExamOpen] = useState(false); // State to manage whether to show the ExamPage

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await Api.post('/scheduledExams/verifyExamPassword', { examId, enteredPassword: password });
//             setMessage(response.data.message);
//             if (response.status === 200) {
//                 // If password verification is successful, show the ExamPage
//                 setIsExamOpen(true);
//                 // No need to call onClose since we don't need to close a dialog
//             }
//         } catch (error) {
//             setMessage(error.response?.data?.message || 'An error occurred while verifying the password.');
//         }
//     };

//     // If the exam is open, return the ExamPage directly
//     if (isExamOpen) {
//         return <ExamPage examId={examId} onClose={() => setIsExamOpen(false)} />;
//     }

//     return (
//         <Box>
//             {/* Render the password input area */}
//             <Box
//                 sx={{
//                     position: 'fixed',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     zIndex: 1300, // Ensures it appears above other components
//                 }}
//             >
//                 <Box
//                     sx={{
//                         width: '80%',
//                         maxWidth: '500px',
//                         backgroundColor: 'white',
//                         borderRadius: '8px',
//                         boxShadow: 24,
//                         p: 4,
//                         position: 'relative',
//                     }}
//                 >
//                     <Typography variant="h4" align="center">Enter Exam Password</Typography>
//                     <Divider sx={{ my: 2 }} />
//                     <form onSubmit={handleSubmit}>
//                         <TextField
//                             variant="outlined"
//                             fullWidth
//                             label="Password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             helperText={message}
//                             error={!!message}
//                         />
//                         <Divider sx={{ my: 2 }} />
//                         <Button variant="contained" type="submit" fullWidth>
//                             Submit
//                         </Button>
//                         <Button variant="outlined" onClick={onClose} fullWidth sx={{ mt: 2 }}>
//                             Cancel
//                         </Button>
//                     </form>
//                 </Box>
//             </Box>
//         </Box>
//     );
// };

// export default ExamPassword;

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Divider } from '@mui/material';
import Api from '../../api/axiosInstance';

const ExamPassword = ({ examId, onPasswordSuccess, onClose }) => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/scheduledExams/verifyExamPassword', { examId, enteredPassword: password });
            if (response.status === 200) {
                onPasswordSuccess(); // Call success handler
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred while verifying the password.');
        }
    };

    return (
        <Box>
            <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300 }}>
                <Box sx={{ width: '80%', maxWidth: '500px', backgroundColor: 'white', borderRadius: '8px', boxShadow: 24, p: 4, position: 'relative' }}>
                    <Typography variant="h4" align="center">Enter Exam Password</Typography>
                    <Divider sx={{ my: 2 }} />
                    <form onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText={message}
                            error={!!message}
                        />
                        <Divider sx={{ my: 2 }} />
                        <Button variant="contained" type="submit" fullWidth>
                            Submit
                        </Button>
                        <Button variant="outlined" onClick={onClose} fullWidth sx={{ mt: 2 }}>
                            Cancel
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default ExamPassword;
