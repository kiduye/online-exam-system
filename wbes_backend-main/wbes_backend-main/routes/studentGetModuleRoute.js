// routes/courseModuleRoutes.js
const express = require('express');
const router = express.Router();
const { getAllCourseModules } = require('../controllers/studentGetModule');

// Public route to get all course modules (no authentication required)
router.get('/modules', getAllCourseModules);

module.exports = router;
