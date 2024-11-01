// const express = require('express');
// const { check } = require('express-validator');
// const authController = require('../../controllers/users/authController');
// const router = express.Router();

// router.post(
//   '/login',
//   [
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Password is required').exists(),
//   ],
//   authController.login
// );

// module.exports = router;


const express = require('express');
const { check } = require('express-validator');
const authController = require('../../controllers/users/authController');
const router = express.Router();

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('role');
  res.json({ success: true, msg: 'Logged out successfully' });
});

// Route to request password reset
router.post('/forgot-password', authController.forgotPassword);

// Route to reset password using token
router.post('/reset-password', authController.resetPassword);

module.exports = router;
