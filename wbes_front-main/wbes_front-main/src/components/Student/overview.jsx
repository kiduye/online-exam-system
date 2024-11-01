import React, { useState } from 'react';
import {
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import SubmitButtonWithConfirmation from './submitall';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SummaryOfAttempts from './summaryofattempt';
import { useCurrentUser } from '../../../useCurrentUser'; // Ensure the path is correct
import FlagIcon from '@mui/icons-material/Flag'; // Import FlagIcon for flagged questions

const Overview = ({ onBack, questionStatuses = [], examData }) => {
  // Get current user data using the custom hook
  const currentUser = useCurrentUser(); // This returns current user data like { studentName, email, _id }

  const [currentView, setCurrentView] = useState('overview');
  const [showSummary, setShowSummary] = useState(false);

  const handleShowSummary = () => {
    setShowSummary(true);
  };

  return (
    <div>
      {currentView === 'overview' && (
        <div>
          {showSummary ? (
            <SummaryOfAttempts />
          ) : (
            <div>
              {/* Display Student Information */}
              <Typography variant="h6">Student Information</Typography>
              <Typography variant="body1">Name: {currentUser.studentName || 'N/A'}</Typography>
              <Typography variant="body1">Email: {currentUser.email || 'N/A'}</Typography>
              <Typography variant="body1">UserId: {currentUser._id || 'N/A'}</Typography>
              {/* Display Exam Information */}
              <Typography variant="h6">Exam Information</Typography>
              <Typography variant="body1">Exam Name: {examData.title || 'N/A'}</Typography>
              <Typography variant="body1">Exam ID: {examData._id || 'N/A'}</Typography>

              <Paper style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5" gutterBottom>
                  Summary of Attempts
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Question Number</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Question ID</strong></TableCell>
                      <TableCell><strong>Question Text</strong></TableCell>
                      <TableCell><strong>Your Answer</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questionStatuses.length > 0 ? (
                      questionStatuses.map((question, index) => (
                        <TableRow key={question._id || index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {question.flagged ? (
                              <FlagIcon style={{ marginLeft: 5, color: 'red' }} /> // Red flag if flagged
                            ) : question.status === 'Answered' ? (
                              <CheckCircleOutlineIcon style={{ marginLeft: 5, color: 'green' }} /> // Green check if answered
                            ) : (
                              'Not Answered'
                            )}
                          </TableCell>
                          <TableCell>{question.id}</TableCell>
                          <TableCell>{question.text}</TableCell>
                          <TableCell>{question.answer || 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5}>No questions available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div style={{ display: 'flex', gap: '10%' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={onBack}
                    style={{ marginTop: '16px', textTransform: 'none' }}
                  >
                    Return to Attempt
                  </Button>
                  {/* Pass currentUser, examData, and questionStatuses to SubmitButtonWithConfirmation */}
                  <SubmitButtonWithConfirmation 
                    currentUser={currentUser} 
                    examData={examData} 
                    questionStatuses={questionStatuses} 
                    onSubmit={handleShowSummary} 
                  />
                </div>
              </Paper>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Overview;
