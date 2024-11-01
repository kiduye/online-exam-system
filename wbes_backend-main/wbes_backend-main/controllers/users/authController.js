const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const Student = require('../../models/users/studentModel');
const Admin = require('../../models/users/adminModel');
const SuperAdmin = require('../../models/users/superAdminModel');
const Instructor = require('../../models/users/instructorModel');
const DepartmentBoard = require('../../models/users/departmentBoardModel');

const findUserByEmail = async (email) => {
  let user = await Student.findOne({ email }).populate('enrollmentType');;
  if (user) return { user, role: 'student' };
  
  user = await Admin.findOne({ email });
  if (user) return { user, role: 'admin' };
  
  user = await SuperAdmin.findOne({ email });
  if (user) return { user, role: 'superadmin' };

  user = await Instructor.findOne({ email });
  if (user) return { user, role: 'instructor' };

  user = await DepartmentBoard.findOne({ email });
  if (user) return { user, role: 'departmentboard' };

  return null;
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const result = await findUserByEmail(email);

    if (!result) {
      console.log('No user found for email:', email); // Log if no user found
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const { user, role } = result;

    // Log the entered and stored password for debugging
    console.log('Attempting to login with email:', email);
    console.log('Entered Password:', password);
    console.log('Stored Hashed Password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password does not match for email:', email); // Log if password does not match
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie('role', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    console.log('Login successful for email:', email); // Log successful login
    res.json({ token, user, role: user.role });
  } catch (error) {
    console.log('Error during login:', error); // Log any errors
    res.status(500).json({ error: error.message });
  }
};



// Password reset request (send reset link to user's email)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await findUserByEmail(email);
    if (!result) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const { user, role } = result;

    // Generate password reset token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create reset URL (can be your frontend URL)
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Set up nodemailer (Gmail example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password
      },
    });

    // Handle user-specific greeting based on role
    let greeting;
    if (role === 'student') {
      greeting = `Hello ${user.firstName},`;
    } else if (role === 'superadmin') {
      greeting = `Hello ${user.email},`;
    } else {
      greeting = `Hello ${user.name},`; // for admin, instructor, department board
    }

    // Define HTML template for email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333333; text-align: center;">Password Reset Request</h2>
          <p style="color: #555555; font-size: 16px;">
            ${greeting}<br /><br />
            You requested to reset your password. Please click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 20px;">
            <a href="${resetURL}" style="display: inline-block; background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
          </div>
          <p style="color: #555555; font-size: 16px;">
            If you did not request this, please ignore this email. This link is valid for only 1 hour.
          </p>
          <div style="border-top: 1px solid #eeeeee; margin-top: 20px; padding-top: 20px;">
            <p style="color: #999999; font-size: 14px; text-align: center;">
              &copy; ${new Date().getFullYear()} WBES. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: htmlContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ msg: 'Password reset link sent to your email' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by token
    const userId = decoded.id;
    const user = await Student.findById(userId) ||
                 await Admin.findById(userId) ||
                 await SuperAdmin.findById(userId) ||
                 await Instructor.findById(userId) ||
                 await DepartmentBoard.findById(userId);
                 
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    res.json({ msg: 'Password has been updated' });
    
  } catch (error) {
    res.status(500).json({ error: 'Invalid or expired token' });
  }
};
