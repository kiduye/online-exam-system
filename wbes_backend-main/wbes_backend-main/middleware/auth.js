// const jwt = require('jsonwebtoken');
// const Student = require('../models/users/studentModel');
// const Admin = require('../models/users/adminModel');
// const SuperAdmin = require('../models/users/superAdminModel');
// const Instructor = require('../models/users/instructorModel');
// const DepartmentBoard = require('../models/users/departmentBoardModel');

// const authMiddleware = (role) => async (req, res, next) => {
//   let token;

//   if (req.cookies && req.cookies.token) {
//     token = req.cookies.token;
//     console.log('Token provided in cookie:', token);
//   } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//     console.log('Token provided in Authorization header:', token);
//   } else {
//     console.log('No token provided');
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded token:', decoded);

//     if (decoded.role !== role && decoded.role !== 'superadmin') {
//       console.log(`Access denied. Expected role: ${role}, Found role: ${decoded.role}`);
//       return res.status(403).json({ msg: 'Access denied' });
//     }

//     let user;
//     if (decoded.role === 'superadmin') {
//       console.log('SuperAdmin access granted');
//       user = await SuperAdmin.findById(decoded.id);
//     } else {
//       switch (role) {
//         case 'admin':
//           user = await Admin.findById(decoded.id).populate('department');
//           break;
//         case 'student':
//           user = await Student.findById(decoded.id).populate('department');
//           break;
//         case 'instructor':
//           user = await Instructor.findById(decoded.id).populate('department courses');
//           break;
//         case 'departmentboard':
//           user = await DepartmentBoard.findById(decoded.id).populate('department');
//           break;
//         default:
//           console.log('Invalid role');
//           return res.status(403).json({ msg: 'Access denied' });
//       }
//     }

//     if (!user) {
//       console.log('User not found for the provided token');
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.log('Token verification failed:', err.message);
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

const jwt = require('jsonwebtoken');
const Student = require('../models/users/studentModel');
const Admin = require('../models/users/adminModel');
const SuperAdmin = require('../models/users/superAdminModel');
const Instructor = require('../models/users/instructorModel');
const DepartmentBoard = require('../models/users/departmentBoardModel');

const authMiddleware = (role = null) => async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token provided in cookie:', token);
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token provided in Authorization header:', token);
  } else {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Check role if one is provided
    if (role && decoded.role !== role && decoded.role !== 'superadmin') {
      console.log(`Access denied. Expected role: ${role}, Found role: ${decoded.role}`);
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Fetch the appropriate user
    let user;
    if (decoded.role === 'superadmin') {
      user = await SuperAdmin.findById(decoded.id);
    } else {
      switch (decoded.role) {
        case 'admin':
          user = await Admin.findById(decoded.id).populate('department');
          break;
        case 'student':
          user = await Student.findById(decoded.id).populate('department enrollmentType');
          break;
        case 'instructor':
          user = await Instructor.findById(decoded.id).populate('department courses');
          break;
        case 'departmentboard':
          user = await DepartmentBoard.findById(decoded.id).populate('department');
          break;
        default:
          return res.status(403).json({ msg: 'Access denied' });
      }
    }

    if (!user) {
      console.log('User not found for the provided token');
      return res.status(404).json({ msg: 'User not found' });
    } 

    // Attach the user object to req.user
    req.user = user;
    console.log('User authenticated:', req.user);

    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
