import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Card, CardContent, CardActions, Box, Divider, Container } from '@mui/material';
import ExamPassword from './startattemt'; // Import ExamPassword component
import Api from '../../api/axiosInstance'; // Axios instance for API calls

const StartExam = () => {
    const [exams, setExams] = useState([]); // State to hold the list of exams
    const [selectedExamId, setSelectedExamId] = useState(null); // State to hold the selected exam ID
    const [showPasswordDialog, setShowPasswordDialog] = useState(false); // State to control the dialog visibility
    const navigate = useNavigate(); // For navigation

    // Fetch accessible exams for the student
    useEffect(() => {
        const fetchExams = async () => {
            try {
                // Replace with your new endpoint to get all scheduled exams
                const response = await Api.get('/scheduledExams/exam'); // Adjust API endpoint as needed
                setExams(response.data);
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchExams();
    }, []);

    const handleExamSelect = (examId) => {
        setSelectedExamId(examId); // Set the selected exam ID
        setShowPasswordDialog(true); // Show the password dialog
    };

    const handlePasswordSuccess = () => {
        // Navigate to the exam page after successful password validation
        navigate(`/scheduledExams/${selectedExamId}/exam`); // Updated route for exam page
    };

    const handleCloseDialog = () => {
        setShowPasswordDialog(false); // Close the dialog
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: '20px', padding: '20px' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>Available Exams</Typography>
            <Divider sx={{ my: 2 }} />

            {exams.length > 0 ? (
                exams.map((exam) => (
                    <Card key={exam._id} sx={{ marginBottom: '20px', boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: '600' }}>{exam.exam.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{exam.exam.description}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button 
                                variant="contained" 
                                onClick={() => handleExamSelect(exam._id)} 
                                sx={{ backgroundColor: '#3f51b5', '&:hover': { backgroundColor: '#303f9f' } }}
                            >
                                Start Exam
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <Typography variant="body1">No accessible exams available.</Typography>
            )}

            {/* Overlay for Exam Password */}
            {showPasswordDialog && (
                <ExamPassword 
                    examId={selectedExamId} 
                    onPasswordSuccess={handlePasswordSuccess} 
                    onClose={handleCloseDialog} 
                />
            )}
        </Container>
    );
};

export default StartExam;
