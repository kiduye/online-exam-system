const express = require('express');
const EnrollmentType = require('../models/enrollmentTypeModel');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a new enrollment type
router.post('/', authMiddleware('superadmin'), async (req, res) => {
  const { name } = req.body;

  try {
    const newEnrollmentType = new EnrollmentType({ name });
    await newEnrollmentType.save();
    res.status(201).json(newEnrollmentType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all enrollment types
router.get('/', async (req, res) => {
  try {
    const enrollmentTypes = await EnrollmentType.find();
    res.status(200).json(enrollmentTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an enrollment type by ID
router.put('/:id', authMiddleware('superadmin'), async (req, res) => {
  const { name } = req.body;

  try {
    const updatedEnrollmentType = await EnrollmentType.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedEnrollmentType) {
      return res.status(404).json({ message: 'Enrollment type not found' });
    }

    res.status(200).json(updatedEnrollmentType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an enrollment type by ID
router.delete('/:id', authMiddleware('superadmin'), async (req, res) => {
  try {
    const deletedEnrollmentType = await EnrollmentType.findByIdAndDelete(req.params.id);

    if (!deletedEnrollmentType) {
      return res.status(404).json({ message: 'Enrollment type not found' });
    }

    res.status(204).json(); // No Content response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
