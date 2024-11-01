import React,{useState} from 'react';
import { Typography, Button, Box ,Divider,TextField,Container } from '@mui/material';
import SelectDepartment from './selectdepartment';
const AfterContinue = () => {
    const [showAfterContinue, setShowAfterContinue] = useState(false);

    const handleContinue = () => {
      setShowAfterContinue(true); // Set state to show AfterContinue component
    };
  
    if (showAfterContinue) {
      return <SelectDepartment />; // Display AfterContinue component
    }
  return (
    <Container maxWidth="100%" style={{ marginTop: '20px',marginLeft:'50px' }}><div style={{
  
    }}> <div>
    <container maxWidth="5%" style={{ marginTop: '20px' }}>
      <Typography>Welcome, Kebede! </Typography>
    </container>
    </div> <Divider sx={{ my: 2 }} />
    
    <Typography>Exam overview</Typography>
    <div style={{display: 'flex'}}><Box sx={{ width: '50%', maxWidth: 200, marginTop: '10px' }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiInputBase-root': {
              height: 40, // Adjust the height of the input box
              fontSize: '0.875rem', // Adjust font size to make it look compact
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.75rem', // Smaller font size for the label
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 1, // Optional: Adjust border radius
            },
          }}
    
       
        />
      </Box>
      <Box sx={{ width: '50%', maxWidth: 200, marginLeft: '5px', marginBottom: '30px', marginTop: '10px' }}>
        <Button
          variant="outlined"
          sx={{
            height: '38px', // Increase button height
            fontSize: '0.75rem', // Adjust font size if needed
            padding: '12px 24px', // Adjust padding to maintain proportion
          }}
        >
          Sort by Exam Name
        </Button>
      </Box>
      </div>
      <div>    <Box
        sx={{
          width: '50%',
          height: '200px',
          maxWidth: 250,
          marginLeft: '5px',
          marginBottom: '30px',
          marginTop: '10px',
          border: '1px solid #888' // Add black border with 1px thickness
        }}
      >
       <Box sx={{ width: '100%',Width:'100%', height: '100px',backgroundColor:'yellowgreen' }}>
       
      </Box>
      <Typography 
       
        onClick={handleContinue}
     // Replace with your target URL
        style={{ marginLeft: '7px', marginTop: '5px', color: 'blue', textDecoration: 'none' }} // Link styling
      >
        Accounting and Finance
      </Typography>
      </Box></div>
    
      </div></Container>

  );
};

export default AfterContinue;
