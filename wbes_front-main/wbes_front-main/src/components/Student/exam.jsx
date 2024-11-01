import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import {
  Container,
  Paper,
  AppBar,
  Grid,
  Card,
  Slide ,
  Tooltip ,
  Typography,
  Toolbar,
  IconButton,
  Box,
  CardContent,
  CircularProgress,
  Button,
} from '@mui/material';
import { Flag, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Api from '../../api/axiosInstance';
import Overview from './overview'; 
import SubmitButtonWithConfirmation from './submitResponseConfirmation';
// Adjust the import as necessary
// Function to format time in hh:mm:ss
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Countdown Timer Component
const CountdownTimer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  return (
    <Box mt={2} width="100%" display="flex" justifyContent="end">
      <Button variant="outlined" style={{ border: '1px solid red', textTransform: 'none', color: 'red' }}>
        Time left: {formatTime(timeLeft)}
      </Button>
    </Box>
  );
};

const ExamPage = (currentUser, examData, questionStatuses) => {
  const { id } = useParams(); // Get the scheduledExamId from the URL
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsState, setQuestionsState] = useState([]);
  //  const [questionsState, setQuestionsState] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examDuration, setExamDuration] = useState(null);
  const [currentContent, setCurrentContent] = useState('quiz');
  const [isNavigationOpen, setIsNavigationOpen] = useState(true);
  const [answers, setAnswers] = useState({});
 const [flaggedQuestions, setFlaggedQuestions] = useState({});

  const [overviewData, setOverviewData] = useState([]);
  const navigate = useNavigate();
   const [showOverview, setShowOverview] = useState(false);
  
const [examName, setExamName] = useState('');
const [examId, setExamId] = useState('');
const [department, setDepartment] = useState('');

  useEffect(() => {
    if (id) {
      fetchScheduledExam(id); // Call the API with the scheduledExamId
    }
  }, [id]);

  const fetchScheduledExam = async (id) => {
    try {
      const response = await Api.get(`/scheduledExams/${id}/exam`);
      console.log('Scheduled Exam Response:', response.data);
      setExam(response.data.exam);
      setExamDuration(response.data.exam.duration);
      const questionIds = response.data.exam.questions;
      console.log(' question id: '+questionIds);
      fetchQuestions(questionIds);

    const exam = response.data.exam;
    const examData = response.data.exam;
      setExam(examData);
      setExamName(examData.title);
      setExamId(examData._id);
      setDepartment(examData.department);
    } catch (error) {
      console.error('Failed to fetch exam details', error);
      setError('Failed to fetch exam details.');
    } finally {
      setLoading(false);
    }
  };

  // to randomize questions
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};





  const handleFinishAndSaveAttempt = async () => {
    const attemptData = {
      studentId: currentUser.id, // Use currentUser._id
      examId: examData._id,      // Use examData._id
      responses: questionStatuses.map((question) => ({
        questionId: question._id, // Question ID
        selectedOption: question.answer || null, // Selected answer or null if unanswered
      })),
    };

    try {
      const response = await Api.post('/exam-responses', attemptData);
      if (response.status === 201) {
        console.log('Exam attempt saved successfully.');
        // Handle successful submission (e.g., redirect to summary)
      } else {
        console.error('Failed to save exam attempt:', response.data);
      }
    } catch (error) {
      console.error('Error saving exam attempt:', error);
    }
  };



// To fetch questions by id
 const fetchQuestions = async (questionIds) => {
  try {
    const fetchedQuestions = await Promise.all(
      questionIds.map(async (questionId) => {
        try {
          const questionResponse = await Api.get(`/questions/${questionId}`);
          const questionData = questionResponse.data;

          // Shuffle options within the question (on the frontend)
          if (Array.isArray(questionData.options)) {
            questionData.options = shuffleArray([...questionData.options]); // Clone and shuffle options
          }

          return {
            id: questionData._id,
            questionText: questionData.questionText,
            options: questionData.options,
          };
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.warn(`Question ID ${questionId} not found.`);
            return null;
          }
          throw err;
        }
      })
    );

    // Filter out null responses (missing questions)
    const validQuestions = fetchedQuestions.filter(q => q !== null);

    // Shuffle the order of the questions (on the frontend)
    const shuffledQuestions = shuffleArray([...validQuestions]); // Clone and shuffle the questions array

    // Update the questionsState with shuffled questions
    setQuestionsState(shuffledQuestions);
    console.log('Shuffled questions and options:', shuffledQuestions);
  } catch (error) {
    console.error('Failed to fetch questions', error.response ? error.response.data : error.message);
    setError('Failed to fetch questions.');
  }
};



const handleNext = () => {
  console.log(`Current Question Index: ${currentQuestionIndex}, Total Questions: ${questionsState.length}`);
  if (currentQuestionIndex < questionsState.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
  } else {
    console.log("Already at the last question.");
  }
};

const handlePrevious = () => {
  console.log(`Current Question Index: ${currentQuestionIndex}`);
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(currentQuestionIndex - 1); // Move to the previous question
  } else {
    console.log("Already at the first question.");
  }
};


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

 const currentQuestion = questionsState[currentQuestionIndex] || {};// Corrected to use questionsState


  // Handle choice selection
// 
    const handleChoiceChange = (event) => {
        const value = event.target.value; // Get the selected value from the event
        // Update the selected answer in the state
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentQuestionIndex]: { selected: value, isSelected: true }, // Mark it as selected
        }));

        // Update question status to 'Answer saved'
        setQuestionsState((prevQuestions) =>
            prevQuestions.map((question, index) =>
                index === currentQuestionIndex ? { ...question, status: 'Answer saved' } : question
            )
        );
    };

    // Function to clear the selected choice
         const handleClearChoice = () => {
        // Clear the answer for the current question
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentQuestionIndex]: { selected: null, isSelected: false }, // Clear the selected answer
        }));

        // Update question status to indicate the answer is cleared
        setQuestionsState((prevQuestions) =>
            prevQuestions.map((question, index) =>
                index === currentQuestionIndex ? { ...question, status: 'Answer cleared' } : question
            )
        );
    };

  

 

const handleFlagClick = () => {
  const currentQuestion = questionsState[currentQuestionIndex];

  if (currentQuestion) {
    setFlaggedQuestions(prevState => {
      const newState = {
        ...prevState,
        [currentQuestionIndex]: !prevState[currentQuestionIndex], // Toggle the flag state
      };
      console.log('Updated Flagged Questions:', newState); // Log the updated state
      return newState;
    });
  } else {
    console.warn("Current question does not exist.");
  }
};








 const handleQuestionClick = (index) => {
  setCurrentQuestionIndex(index); // Update the current question index
};

// Usage in your navigation component

  const toggleNavigation = () => {
    setIsNavigationOpen((prev) => !prev); // Toggle visibility
  };const handleFinishAttempt = () => {
    // Create the attempt summary for all questions using the index
    const attemptSummary = questionsState.map((question, index) => {
        const questionIndex = index; // Use the index as the question identifier
        const isAnswered = answers[questionIndex]?.isSelected; // Check if the current question is answered
        const status = isAnswered ? 'Answered' : 'Not yet answered'; // Set status based on answered check
        const answer = isAnswered ? answers[questionIndex].selected : 'No answer selected'; // Get the selected answer or default message
        const flagged = flaggedQuestions[questionIndex] || false; // Check if the question is flagged

        return {
            id: question.id, // Include question ID
            index: questionIndex, // Use the question index
            status, // The status of the question
            answer, // The answer or default message
            flagged, // Flagged status
            text: question.questionText || 'No question text available' // Include question text
        };
    });

    // Set the summary in context
    setOverviewData(attemptSummary);

    // Navigate to the overview page
    setCurrentContent('overview');
};

// Common Exam Details (to be passed once, not per question)


// You can now pass `attemptSummary` and `examDetails` to any component where you need to display them



  return (
    <div>
      {/* AppBar with Notifications and Profile */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Exam Page
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Container maxWidth={false} style={{ padding: '16px' }}>
        {currentContent === 'quiz' ? (
          <>
          
            <Grid container spacing={2} style={{ marginTop: 3 }}>
              {/* Left: Card for showing flag for question */}
              <Grid item xs={2} style={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: 25 }}>
                <Card style={{ maxWidth: '250px', flexGrow: 1, marginTop: 27, backgroundColor: 'lightgrey' }}>
                  <CardContent>
                   <Typography>
  Question <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{currentQuestionIndex + 1}</span> of {questionsState.length}
</Typography>

     <Typography 
        variant="body1" 
        style={{ marginTop: '20px', color: answers[currentQuestionIndex]?.isSelected ? 'green' : 'red' }}
      >
        {answers[currentQuestionIndex]?.isSelected 
          ? `Answered: ${answers[currentQuestionIndex].selected}` // Show saved answer if answered
          : 'Not yet answered'} 
      </Typography>

                    <Typography>Mark out of 1.0</Typography>
                  <Box mt={2} display="flex" alignItems="center">

<Box mt={2} display="flex" alignItems="center">
  <IconButton
    color={flaggedQuestions[currentQuestionIndex] ? 'error' : 'inherit'} // Set color based on flagged stat
    onClick={handleFlagClick} // Calls the flag function when clicked
  >
    <Flag />
  </IconButton>
  <Typography style={{ marginLeft: '8px' }}>
    {flaggedQuestions[currentQuestionIndex] ? 'Unflag Question' : 'Flag Question'} {/* Updated text */}
  </Typography>
</Box>






</Box>

                  </CardContent>
                </Card>
              </Grid>

              {/* Center: Container for showing question with multiple choice */}
              <Grid item xs={isNavigationOpen ? 7 : 9} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
             {examDuration && (
  <CountdownTimer
    duration={examDuration}
    onTimeUp={handleFinishAndSaveAttempt} // Call the submission function instead of alert
    style={{ border: '2px solid red', padding: '10px', borderRadius: '4px' }}
  />
)}

         <Paper style={{ padding: '16px', marginTop: 3, flexGrow: 1, backgroundColor: 'lightblue' }}>
            {currentQuestion && currentQuestion.questionText && (
  <div>
    <Typography variant="h5" style={{ marginTop: '20px', marginBottom: '20px' }}>
      {currentQuestion.questionText}
    </Typography>
    {currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
      currentQuestion.options.map((choice, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`} // Grouping for radio buttons
              value={choice.value || choice} // Ensure value is set correctly
              checked={answers[currentQuestionIndex]?.selected === (choice.value || choice)} // Check for selected answer
              onChange={handleChoiceChange} // Handles the change
              style={{ marginRight: '8px' }}
            />
            <span>{String.fromCharCode(97 + index)}. {choice.label || choice}</span>
          </label>
        </div>
      ))
    ) : (
      <Typography>No options available for this question.</Typography>
    )}
  


                    <Box display="flex" justifyContent="space-between" style={{ marginTop: '20px' }}>
                            {/* Check if an answer is selected */}
                            {answers[currentQuestionIndex]?.isSelected ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleClearChoice}
                                        aria-label="Clear selected answer"
                                    >
                                        Clear Choice
                                    </Button>
                                </>
                            ) : (
                                <Typography variant="body1" color="textSecondary">
                                    No answer selected.
                                </Typography>
                            )}
                        </Box>
                </div>
            )}
        </Paper>

         {/* Navigation buttons */}
              
  <Box display="flex" justifyContent="space-between" style={{ marginTop: '20px' }}>
    {/* Render Previous button only if not on the first question */}
    {currentQuestionIndex > 0 && (
      <Button
        variant="contained"
        onClick={handlePrevious} 
      >
        Previous
      </Button>
    )}
    
    {/* Empty Box to maintain the layout and push Next to the end */}
    <Box sx={{ flexGrow: 1 }} /> {/* This Box takes the remaining space */}
    
    {/* Render Next button only if not on the last question */}
    {currentQuestionIndex < questionsState.length - 1 && (
      <Button
        variant="contained"
        onClick={handleNext}
      >
        Next
      </Button>
    )}
  </Box>



              </Grid>

            <Grid item xs={isNavigationOpen ? 3 : 1} style={{ display: 'flex', justifyContent: 'flex-end', height: '100%' }}>
              {/* Side Button for Toggle */}
              <Slide direction="left" in={isNavigationOpen} mountOnEnter unmountOnExit>
                <Paper elevation={3} style={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                  <Typography variant="h6">Quiz Navigation</Typography>
             <Box mt={1} display="flex" flexWrap="wrap" justifyContent="flex-start">
                {questionsState.map((question, index) => {
                    const isCurrent = currentQuestionIndex === index; // Check if this is the current question
                    const isFlagged = flaggedQuestions[index] || false; // Check if this question is flagged
                    const isAnswered = answers[index]?.isSelected || false; // Check if this question is answered

                    return (
                        <Box
                            key={index} // Use the question ID as the key to ensure uniqueness
                            sx={{
                                position: 'relative',
                                margin: '2px',
                                width: '30px',
                                height: '35px',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '2px solid',
                                borderColor: isCurrent
                                    ? 'black' // Current question gets a black border
                                    : isFlagged
                                        ? 'red'  // Flagged question gets a red border
                                        : 'gray', // Unflagged, unanswered question gets a gray border
                                borderRadius: '4px',
                                overflow: 'hidden',
                                cursor: 'pointer', // Add cursor pointer to indicate it's clickable
                                transition: 'border-color 0.3s ease', // Smooth transition on border color change
                            }}
                            onClick={() => handleQuestionClick(index)} // Set the clicked question as current
                            role="button" // Accessibility role
                            aria-label={`Go to question ${index + 1}`} // Accessibility label
                        >
                            {/* Upper Half for Question Number */}
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'white', // Background for question number
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'black',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {index + 1} {/* Display question number (1-based index) */}
                                </Typography>
                            </Box>

                            {/* Lower Half for Status (Answered/Unanswered) */}
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                      backgroundColor: isAnswered ? 'black' : 'transparent',  // Black if answered, otherwise transparent
                                    color: isAnswered ? 'white' : 'gray', // White text if answered, otherwise grayotherwise gray
                                    borderTop: '1px solid',
                                    borderColor: isFlagged ? 'red' : 'gray', // Red top border if flagged, otherwise gray
                                }}
                            >
                                {isFlagged && ( // Show flag icon if flagged
                                    <Typography
                                        sx={{
                                            fontSize: '0.6rem',
                                            color: 'red',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        !
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>



                  <Box mt={2} display="flex" justifyContent="center">
                    <Box mt={2}>
                      <Typography
                        variant="body2"
                        style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                        onClick={handleFinishAttempt}
                      >
                        Finish Attempt
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Slide>
              <Box mt={2}>
              <Tooltip
      title={isNavigationOpen ? "Collapse Exam Navigation" : "Expand Exam Navigation"}
      placement="bottom" // Shows tooltip below the button
    >
      <span> {/* Add a <span> to make Tooltip work correctly with IconButton */}
        <IconButton onClick={toggleNavigation}   sx={{
            backgroundColor: 'lightgrey', // Set your background color here


'&:hover': {
              backgroundColor: 'grey', // Background color on hover
            }
          }}>
          {isNavigationOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </span>
    </Tooltip>
              </Box>
            </Grid>
            </Grid>
          </>
        ) : (
      <Overview 
        onBack={() => setCurrentContent('quiz')}  // Go back to quiz view
        questionStatuses={overviewData}  
          examName={examName} 
  examData={{ title: examName, _id: examId }} 
     
  // Pass question status data
      />
    ) }
      </Container>
    </div>
  );
};

export default ExamPage;
