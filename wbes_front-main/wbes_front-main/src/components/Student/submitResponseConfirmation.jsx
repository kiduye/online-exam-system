const SubmitButtonWithConfirmation = ({ currentUser, examData, questionStatuses, onSubmit }) => {
  const [open, setOpen] = useState(false);

  const handleFinishAndSaveAttempt = async () => {
    const attemptData = {
      studentId: currentUser.id,  // Use currentUser._id (previously it was id)
      examId: examData._id,        // Use examData._id
      responses: questionStatuses.map((question) => ({
        questionId: question._id,       // Question ID
        selectedOption: question.answer || null,  // Selected answer or null if unanswered
      })),
    };

    try {
      const response = await Api.post('/exam-responses', attemptData);

      if (response.status === 201) {
        console.log('Exam attempt saved successfully.');
        onSubmit(); // Trigger the summary view
      } else {
        console.error('Failed to save exam attempt:', response.data);
      }
    } catch (error) {
      console.error('Error saving exam attempt:', error);
    }
  };

  // Remaining parts of the SubmitButtonWithConfirmation component stay the same...
};

export default SubmitButtonWithConfirmation;
