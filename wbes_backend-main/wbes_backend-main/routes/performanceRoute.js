// const express = require('express');
// const router = express.Router();
// const performanceController = require('../controllers/performanceController');

// // Get performance data for a student
// router.get('/student/:id', performanceController.getStudentPerformance);

// // Get performance improvement for a student
// router.get('/student/:id/improvement', performanceController.getPerformanceImprovement);

// module.exports = router;


// routes/performanceRoutes.js
 
const express = require('express');
const router = express.Router();
const { getStudentPerformance, getStudentImprovement } = require('../controllers/performanceController');
const authMiddleware = require('../middleware/auth');

// Route to get student performance data
router.get('/student/:studentId', authMiddleware('departmentboard, admin'), getStudentPerformance);

// Route to get student improvement data
router.get('/student/:studentId/improvement', authMiddleware('departmentboard, admin'), getStudentImprovement);

module.exports = router;
