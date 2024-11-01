const express = require('express');
const router = express.Router();
const superAdminController = require('../../controllers/users/superAdminController');
const authMiddleware = require('../../middleware/auth');
const { check } = require('express-validator');

// Auth Routes
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters').isLength({ min: 8 })
  ],
  superAdminController.registerSuperAdmin
);

// router.post(
//   '/login',
//   [
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Password is required').exists()
//   ],
//   superAdminController.loginSuperAdmin
// );

// Profile Routes
router.get('/profile', authMiddleware('superadmin'), superAdminController.getSuperAdminProfile);
router.put('/profile', authMiddleware(), superAdminController.updateSuperAdminProfile);

// CRUD Routes
router.get('/', superAdminController.getAllSuperAdmins);
router.get('/:id', superAdminController.getSuperAdminById);
router.delete('/:id',authMiddleware('superadmin'), superAdminController.deleteSuperAdmin); 

module.exports = router;
