import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from '@mui/material';
import Api from '../../api/axiosInstance';

const SubmitButtonWithConfirmation = ({ currentUser, examData, questionStatuses, onSubmit }) => {
  const [open, setOpen] = useState(false);

  // Check if currentUser or examData is undefined before accessing their _id
  if (!currentUser || !examData) {
    console.error("Missing currentUser or examData");
    return null;  // Return early if data is missing
  }

  const handleFinishAndSaveAttempt = async () => {
    const attemptData = {
      studentId: currentUser._id,  // Ensure currentUser._id exists
      examId: examData._id,        // Ensure examData._id exists
      responses: questionStatuses.map((question) => ({
        questionId: question.id,       // Ensure question._id exists
        selectedOption: question.answer || null,  // Selected answer, or null if not answered
      })),
    };

    try {
      // Send the exam response data to the backend using Axios
      const response = await Api.post('/exam-responses', attemptData);

      if (response.status === 201) {
        console.log('Exam attempt saved successfully.');
        onSubmit(); // Call the onSubmit function passed as a prop
      } else {
        console.error('Failed to save exam attempt:', response.data);
      }
    } catch (error) {
      console.error('Error saving exam attempt:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleClickOpen}
        style={{ marginTop: '16px', textTransform: 'none' }}
      >
        Finish and Submit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ 
          '& .MuiDialog-paper': { 
            width: '500px', 
            height: '300px', 
            maxWidth: '80vw', 
            maxHeight: '80vh'  
          }
        }}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText sx={{ color: 'black' }}>
            Are you sure you want to finish and submit your exam? Once submitted, you cannot make any changes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleFinishAndSaveAttempt} color="primary" variant="contained" sx={{ textTransform: 'none' }}>
            Submit all and finish
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubmitButtonWithConfirmation;
