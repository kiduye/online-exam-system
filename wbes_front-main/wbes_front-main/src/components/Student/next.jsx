import React, { useState } from 'react';
import { Button , Typography,Paper,} from '@mui/material';
import SubmitButtonWithConfirmation from './submitall';
import SummaryOfAttempts from './summaryofattempt';// Import the SummaryOfAttempts component

const NextPage = ({ onBack }) => {
  const [showSummary, setShowSummary] = useState(false); // State to control the display

  const handleShowSummary = () => {
    setShowSummary(true); // Set the state to true to show the SummaryOfAttempts component
  };
 
  return (
    <div>
      {showSummary ? (
        <SummaryOfAttempts /> // Render SummaryOfAttempts component when showSummary is true
      ) : (
        <div>
          <Typography variant="body1">
            This is the content of the next page.
          </Typography>
          <Paper style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>Exit Exam 2015</Typography>
            <Typography variant="h6" gutterBottom>Summary of attempt</Typography>
            
            {/* Table or other content */}
            <div style={{ display: 'flex', gap: '10%' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={onBack}
                style={{ marginTop: '16px', textTransform: 'none' }}
              >
                Return to attempt
              </Button>

              <SubmitButtonWithConfirmation onSubmit={handleShowSummary} />
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default NextPage;
