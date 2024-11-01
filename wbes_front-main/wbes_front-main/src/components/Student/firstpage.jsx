import React, { useEffect, useState } from 'react';
import {
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Avatar,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Interface from './profile'; // Import the Interface component
import Api from '../../api/axiosInstance'; // To make API requests
import ExamResults from './grade'; // Ensure this path is correct
import StartExam from './startexamfterdepartmnt'
import Preferences from './updateprofile'
// Custom styled TableCell for vertical separator
const SeparatorCell = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: '2px 4px',
  fontSize: '0.75rem',
  lineHeight: '2',
  maxWidth: '10px',
  alignItems: 'left',
}));

const ProfileManagementInterface = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('Profile'); // State for menu selection

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await Api.get('/students/profile');
        setStudentData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student profile:', error);
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!studentData) {
    return <Typography>Error: Unable to fetch student data.</Typography>;
  }

  // Function to handle menu selection from Interface component
  const handleMenuSelection = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar sx={{ backgroundColor: 'whitesmoke', color: 'black', borderBottom: '1px solid black' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Profile Management
          </Typography>
          <Interface onMenuSelect={handleMenuSelection} fullName={studentData.fullName}/> {/* Pass function as prop */}
        </Toolbar>
      </AppBar>

      <Divider sx={{ my: 2, backgroundColor: 'red', height: '3px' }} />
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '60%', maxWidth: 1200, marginRight: 4 }}>
          {/* Conditional rendering based on selected menu */}
         
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'whitesmoke', height: '40px' }}>
                    <TableCell sx={{ width: '25%', padding: '4px 8px' }}>
                      <Typography variant="h6" align="start" paddingLeft={'15px'}>
                        Picture
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={2} sx={{ width: '75%', padding: '4px 8px' }}>
                      <Typography variant="h6" align="start">
                        Basic Information
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ verticalAlign: 'top', padding: 1 }}>
                      <Avatar sx={{ width: 80, height: 80, mb: 1 }} />
                    </TableCell>
                    <TableCell colSpan={2} sx={{ padding: 0, verticalAlign: 'top' }} align="start">
                      <Box sx={{ marginRight: 4 }}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ width: '25%', padding: '2px 14px' }}>Full Name:</TableCell>
                              <TableCell sx={{ width: '25%', padding: '2px 14px' }}>{studentData.fullName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ width: '25%', padding: '2px 14px' }}>Username:</TableCell>
                              <TableCell sx={{ width: '25%', padding: '2px 14px' }}>{studentData.username}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ width: '25%', padding: '2px 14px' }}>Email:</TableCell>
                              <TableCell sx={{ width: '25%', padding: '2px 14px' }}>{studentData.email}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ width: '25%', padding: '2px 14px' }}>Department:</TableCell>
                              <TableCell sx={{ width: '25%', padding: '2px 14px' }}>{studentData.department}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
  


        </Box>

        <br />
        <br />
   {selectedMenu === 'Grades' ? (
 
    <ExamResults />
 
) : selectedMenu === 'Preferences' ? (
  
    
    <Preferences /> 
  
) : (
  <div className="mt-4 w-full max-w-3xl">
    <p className="text-center text-gray-500"></p>
  </div>
)}

      <StartExam/>
      </Box>
    </div>
  );
};

export default ProfileManagementInterface;
