import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

function QuizNavigation() {
  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h6">Quiz navigation</Typography>
      <Box mt={2}>
        <Typography>Time left: 2h 07m 09s</Typography>
      </Box>
      <Box mt={2} display="flex" flexWrap="wrap">
        {[...Array(81).keys()].map((num) => (
          <Button key={num} variant="outlined" style={{ margin: '5px' }}>
            {num + 1}
          </Button>
        ))}
      </Box>
    </Paper>
  );
}

export default QuizNavigation;
