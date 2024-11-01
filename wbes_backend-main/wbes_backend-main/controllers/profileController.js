// const Admin = require('../models/users/adminModel'); 
// const DepartmentBoard = require('../models/users/departmentBoardModel');
// const Instructor = require('../models/users/instructorModel');
// const Student = require('../models/users/studentModel');
// const SuperAdmin = require('../models/users/superAdminModel');

// // Controller to get the authenticated user's profile information
// exports.getProfile = async (req, res) => {
//   try {
//     const { role } = req.user;

//     let userProfile;
//     switch (role) {
//       case 'admin':
//         userProfile = await Admin.findById(req.user._id).select('name email');
//         break;
//       case 'departmentboard':
//         userProfile = await DepartmentBoard.findById(req.user._id).select('name email');
//         break;
//       case 'instructor':
//         userProfile = await Instructor.findById(req.user._id).select('name email');
//         break;
//       case 'student':
//         userProfile = await Student.findById(req.user._id).select('firstName lastName email');
//         break;
//       case 'superadmin':
//         userProfile = await SuperAdmin.findById(req.user._id).select('email');
//         break;
//       default:
//         return res.status(400).json({ msg: 'Invalid user role' });
//     }

//     if (!userProfile) {
//       return res.status(404).json({ msg: 'Profile not found' });
//     }

//     res.json({ user: userProfile });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // Controller to update the authenticated user's name and password
// exports.updateProfile = async (req, res) => {
//   try {
//     const { role } = req.user;
//     const { name, firstName, lastName, password } = req.body;

//     let userProfile;
//     switch (role) {
//       case 'admin':
//         userProfile = await Admin.findById(req.user._id);
//         if (name) userProfile.name = name;
//         break;

//       case 'departmentboard':
//         userProfile = await DepartmentBoard.findById(req.user._id);
//         if (name) userProfile.name = name;
//         break;

//       case 'instructor':
//         userProfile = await Instructor.findById(req.user._id);
//         if (name) userProfile.name = name;
//         break;

//       case 'student':
//         userProfile = await Student.findById(req.user._id);
//         if (firstName) userProfile.firstName = firstName;
//         if (lastName) userProfile.lastName = lastName;
//         break;

//       case 'superadmin':
//         userProfile = await SuperAdmin.findById(req.user._id);
//         // SuperAdmin only has an email, so there's no "name"
//         break;

//       default:
//         return res.status(400).json({ msg: 'Invalid user role' });
//     }

//     // If password needs to be updated
//     if (password) {
//       userProfile.password = password;
//     }

//     // Save the updated profile
//     await userProfile.save();

//     res.json({ msg: 'Profile updated successfully', user: userProfile });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get the profile of the authenticated user
// Get the profile of the authenticated user

const bcrypt = require('bcrypt');
const getProfile = async (req, res) => {
  try {
    // Prepare user data to return
    const userData = {
      email: req.user.email,
      role: req.user.role,
    };

    // Check if the user is a student and include enrollment type if so
    if (req.user.role === 'student') {
      userData.firstName = req.user.firstName;
      userData.lastName = req.user.lastName;
      userData.enrollmentType = req.user.enrollmentType ? req.user.enrollmentType.name : null; // Add enrollment type name
    } else {
      userData.name = req.user.name; // Include name for non-student roles
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};


const updateProfile = async (req, res) => {
  const { name, password, firstName, lastName, enrollmentType } = req.body; // Include enrollmentType

  try {
    // Log current user details before updates
    console.log('Current User Before Update:', req.user);

    // Update the name (or first and last name for students) and password if provided
    if (req.user.role === 'student') {
      if (firstName) req.user.firstName = firstName;
      if (lastName) req.user.lastName = lastName;

      // Optional: Update enrollment type if provided (ensure the ID is valid)
      if (enrollmentType) {
        req.user.enrollmentType = enrollmentType; // Assuming enrollmentType is a valid ID
      }
    } else if (name) {
      req.user.name = name;
    }

    // Update password if provided
    if (password) {
      // Assuming hashing logic exists in the model or here
      const salt = await bcrypt.genSalt(10);
      req.user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await req.user.save();
    console.log('Updated User:', updatedUser);

    res.json({ msg: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error); // Log the error message
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};


const updateStudentProfile = async (req, res) => {
  const { password, firstName, lastName } = req.body; // Include only necessary fields

  try {
    // Log current user details before updates
    console.log('Current User Before Update:', req.user);

    // Ensure the user is a student
    if (req.user.role === 'student') {
      // Update firstName if provided
      if (firstName && firstName !== req.user.firstName) {
        req.user.firstName = firstName;
      }

      // Update lastName if provided
      if (lastName && lastName !== req.user.lastName) {
        req.user.lastName = lastName;
      }

      // Update password if provided
      if (password) {
        // Check if the new password is the same as the old password
        const isSamePassword = await bcrypt.compare(password, req.user.password);
        if (isSamePassword) {
          return res.status(400).json({ msg: 'New password cannot be the same as the old password' });
        }

        req.user.password = password; // Set new password (will be hashed in pre-save hook)
      }
    } else {
      return res.status(403).json({ msg: 'Only students can update their profiles.' });
    }

    // Save updated user
    const updatedUser = await req.user.save(); // This will trigger the pre-save hook
    console.log('Updated User:', updatedUser);

    res.json({ msg: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error); // Log the error message
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};


module.exports = { getProfile, updateProfile ,updateStudentProfile};
