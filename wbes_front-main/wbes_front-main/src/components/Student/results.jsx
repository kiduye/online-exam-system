import React, { useState } from 'react';
import { Typography,Container, Button, Box } from '@mui/material';
import AfterContinue from './aftercontinue'; // Import the AfterContinue component

const PsswordChanged = () => {
  const [showAfterContinue, setShowAfterContinue] = useState(false);

  const handleContinue = () => {
    setShowAfterContinue(true); // Set state to show AfterContinue component
  };

  if (showAfterContinue) {
    return <AfterContinue />; // Display AfterContinue component
  }

  return (
    <Container maxWidth="100%" style={{ marginTop: '20px',marginLeft:'50px' }}>

<div style={{ display: 'flex' }}>
      <Box>
        <Typography>Password has been changed</Typography>
      </Box>
      <Box
        sx={{
          marginTop: '20px',
          marginLeft: '50%',
          marginBottom: '50px',
          transform: 'translateX(-50%)',
        }}
      >
        <Button variant="contained" color="primary" onClick={handleContinue}>
          Continue
        </Button>
      </Box>
    </div>

    </Container>
   
  );
};

export default PsswordChanged;
