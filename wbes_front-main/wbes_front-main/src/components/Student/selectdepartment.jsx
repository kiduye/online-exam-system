import React ,{useState}from 'react';
import { Typography, Button, Box,Container   } from '@mui/material';
import SideDrawer from './sidedrawer';
import StartExam from './startexamfterdepartmnt';
const SelectDepartment = () => {
    const [showAfterContinue, setShowAfterContinue] = useState(false);

    const handleContinue = () => {
      setShowAfterContinue(true); // Set state to show AfterContinue component
    };
  
    if (showAfterContinue) {
      return <StartExam />; // Display AfterContinue component
    }
  return (
    <Container maxWidth="100%" style={{ marginTop: '20px',marginLeft:'50px' }}><div style={{
  
    }}>   <div>
    <SideDrawer />
    
      <Box>
        <Typography
          component="a"
          href="https://example.com" // Replace with your target URL
          style={{ marginLeft: '7px', marginTop: '5px', color: 'blue', textDecoration: 'none' }} // Link styling
        >
          Acc030 / Exit Exam 2015
        </Typography>
        <div style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
          <Box sx={{ width: '100px', height: '100px', margin: '0', padding: '0' }}>
            <img
              style={{
                height: '100px',
                width: '100px',
                margin: '0',
              }}
              alt="Logo"
              src="./assets/images/logoo.png"
            />
          </Box>
          <div style={{ margin: '0', padding: '0', marginLeft: '5px' }}>
            <Typography style={{ margin: '0', padding: '0' }}>Exam</Typography>
            <Typography style={{ margin: '0', padding: '0' }}>Exit Exam 2015</Typography>
          </div>
        </div>
        <Typography style={{ marginLeft: '15px', padding: '0' }}>Opened: Saturday 17 Augest 2024 1:53 PM</Typography>
        <Typography sx={{ marginLeft: '15px', padding: '0' }}>Closes: Saturday 17 Augest 2024 5:53 PM</Typography>
      </Box>
    </div>
    
    <div style={{marginTop:'20px'}}>
    <Button
        variant="contained"
        onClick={handleContinue}
        sx={{
          height: '32px', // Increase button height
          fontSize: '0.75rem', // Adjust font size if needed
          padding: '12px 24px',
          marginBottom:'10px' // Adjust padding to maintain proportion
        }}
      >
        Start exam
      </Button>
    <Typography style={{ margin: '0', padding: '0' }}>Attempts allowed: 1</Typography>
            <Typography style={{ marginTop: '4px', padding: '0' }}>To start the exam you need to know the exam password</Typography>
            <Typography style={{ marginTop: '4px', marginBottom: '40px',padding: '0' }}>Time limit: 3 hours</Typography>
    </div>
    
      </div></Container>

  );
};

export default SelectDepartment;
