const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/manageDepartmentController');

// Create a new department
router.post('/', departmentController.createDepartment);

// Get all departments
router.get('/', departmentController.getAllDepartments);

// Get a single department by ID
router.get('/:id', departmentController.getDepartmentById);

// Update a department by ID
router.put('/:id', departmentController.updateDepartment);

// Delete a department by ID
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;
