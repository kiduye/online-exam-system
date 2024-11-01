const express = require('express');
const { 
  createDepartmentBoard,
  getDepartmentBoards,
  updateDepartmentBoard,
  deleteDepartmentBoard
} = require('../../controllers/users/departmentBoardController');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

// Create Department Board
router.post('/', authMiddleware('admin'), createDepartmentBoard);

// Get Department Boards (within the Admin's department)
router.get('/', authMiddleware('admin'), getDepartmentBoards);

// Update Department Board Member
router.put('/:id', authMiddleware('admin'), updateDepartmentBoard);

// Delete Department Board Member
router.delete('/:id', authMiddleware('admin'), deleteDepartmentBoard);

module.exports = router;
