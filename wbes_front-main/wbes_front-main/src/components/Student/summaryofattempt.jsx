import React, { useState } from 'react';
import { Box, Typography, Paper, Button,Divider, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const SummaryOfAttempts = () => {
  const [selectedSection, setSelectedSection] = useState('state'); // 'state' or 'review'

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom sx={{textTransform:'none'}}>Summary of your previous attempts</Typography>
      <Divider sx={{ my: 2 }} />
      {/* Display clickable Typography for State and Review */}
      <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
        <Typography
          variant="h6"
          style={{ marginLeft:'20px', cursor: 'pointer', fontWeight: selectedSection === 'state' ? 'bold' : 'normal' }}
          onClick={() => handleSectionClick('state')}
        >
          State
        </Typography>
        <Typography
          variant="h6"
          style={{  marginRight:'200px',cursor: 'pointer', fontWeight: selectedSection === 'review' ? 'bold' : 'normal' }}
          onClick={() => handleSectionClick('review')}
        >
          Review
        </Typography>
      </Box>
     

      {/* Conditionally render the content based on the selected section */}
      {selectedSection === 'state' && (
        <Box mt={2}>
          <div style={{backgroundColor:'whitesmoke', borderTop:'0.5px solid #e0e0e0',    
    // Light grey color from Material-UI's color palette
    padding: 2,}}>  <Typography variant="body1" gutterBottom>Finished</Typography>
          
            Submitted Friday, 23 June 2023, 1:20 PM
          </div>
        
          <Typography variant="body1" color="black" sx={{marginTop:'30px'}}>No more attempts are allowed</Typography>
        </Box>
      )}

      {selectedSection === 'review' && (
        <Box mt={2}>
          <div style={{backgroundColor:'whitesmoke', borderTop:'0.5px solid #e0e0e0',    
    // Light grey color from Material-UI's color palette
    padding: 2,}}>
          <Typography variant="body1" gutterBottom>This is the content for the Review section.</Typography>
          </div>
         
          {/* You can add more content here */}
        </Box>
      )}

      {/* Back button and help icon */}
      <Box display="flex" justifyContent="space-between" mt={4} sx={{marginLeft:'400px'}}>
        <Button variant="contained" color="primary">Back</Button>
        <IconButton color="primary" sx={{marginRight:'100px'}}>
          <HelpOutlineIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default SummaryOfAttempts;
