const express = require('express');
const router = express.Router();
const uploadMaterialController = require('../controllers/materialController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/multerConfig')


// Create new material (POST)
router.post('/', upload.single('file'), authMiddleware('instructor'), uploadMaterialController.createMaterial);

// Get all materials (GET)
router.get('/all', uploadMaterialController.getAllMaterials);

//get own materials
router.get('/instructor', authMiddleware('instructor'), uploadMaterialController.getOwnMaterials);

// Get all materials uploaded by an instructor
router.get('/instructor/:instructorId', authMiddleware('instructor'), uploadMaterialController.getInstructorMaterials);

// Get material by ID (GET)
router.get('/:id', uploadMaterialController.getMaterialById);

// Update material by ID (PUT)
router.put('/:id', authMiddleware('instructor'), uploadMaterialController.updateMaterial);

// Delete material by ID (DELETE)
router.delete('/:id', authMiddleware('instructor'), uploadMaterialController.deleteMaterial);

router.get('/filter', uploadMaterialController.getFilteredMaterials);

// New download route
router.get('/materials/download/:id', uploadMaterialController.downloadMaterial);

module.exports = router;
