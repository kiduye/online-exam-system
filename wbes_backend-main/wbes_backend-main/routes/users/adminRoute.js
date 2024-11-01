const express = require('express');
const { createAdmin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin } = require('../../controllers/users/adminController');

const router = express.Router();

// Create a new admin
router.post('/', createAdmin);

// Get all admins
router.get('/', getAllAdmins);

// Get an admin by ID
router.get('/:id', getAdminById);

// Update an admin
router.put('/:id', updateAdmin);

// Delete an admin
router.delete('/:id', deleteAdmin);

module.exports = router;
