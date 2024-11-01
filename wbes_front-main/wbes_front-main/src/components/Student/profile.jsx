import React, { useState } from 'react';
import { Button, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ExamResults from './grade'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
const Interface = ({ onMenuSelect,fullName }) => { // Accepting onMenuSelect as a prop
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    onMenuSelect('Profile'); // Pass the selected menu to parent
    handleClose();
  };

  const handleGradesClick = () => {
    onMenuSelect('Grades'); // Pass the selected menu to parent
    handleClose();
  };

  const getInitials = () => {
  return fullName.slice(0, 2).toUpperCase(); // Get the first two letters of fullName and convert them to uppercase
};
  const handlePreferencesClick = () => {
    onMenuSelect('Preferences');
    handleClose();
  };

  const handleLogoutClick = () => {
    handleClose();
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Button
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>{getInitials()}</Avatar>
          <ExpandMoreIcon />
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              border: '1px solid rgba(0, 0, 0, 0.12)',
              mt: 1,
              minWidth: '250px',
            },
          }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleGradesClick}>Grades</MenuItem>
          <MenuItem onClick={handlePreferencesClick}>Preferences</MenuItem>
          <Divider sx={{ my: 2 }} />
          <MenuItem onClick={handleLogoutClick}>Log out</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Interface;
