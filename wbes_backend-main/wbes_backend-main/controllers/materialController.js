const UploadMaterial = require('../models/materialModel');
const Instructor = require('../models/users/instructorModel');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
// Create new material
exports.createMaterial = async (req, res) => {
  try {
    const { title, description, fileType } = req.body;
    const fileUrl = req.file.path; // Get the file path from the uploaded file

    console.log('Instructor from req.user:', req.user);

    const instructor = req.user;

    if (!instructor || !instructor.department || !instructor.courses) {
      console.log('Missing department or courses:', instructor);
      return res.status(400).json({ message: 'Instructor department or courses not found' });
    }

    const newMaterial = new UploadMaterial({
      title,
      description,
      fileUrl, // File URL from multer
      fileType,
      uploadedBy: instructor._id, 
      department: instructor.department._id, 
      course: instructor.courses[0]._id 
    });

    await newMaterial.save();
    res.status(201).json({ message: 'Material uploaded successfully', data: newMaterial });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading material', error: error.message });
  }
};

// Get all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await UploadMaterial.find()
      .populate('uploadedBy', 'name') // Populate instructor's name
      .populate('department', 'name') // Populate department's name
      .populate('course', 'name'); // Populate course's name

    res.status(200).json({ message: 'Materials fetched successfully', data: materials });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error: error.message });
  }
};

// Get all materials uploaded by the authenticated instructor
exports.getInstructorMaterials = async (req, res) => {
  try {
    const instructorId = req.user._id; // Use the authenticated instructor's ID from req.user

    // Fetch all materials uploaded by this instructor
    const materials = await UploadMaterial.find({ uploadedBy: instructorId })
                                          .populate('course')      // Populate the course details
                                          .populate('department'); // Populate the department details

    // If no materials are found, return a 404
    if (!materials || materials.length === 0) {
      return res.status(404).json({ message: 'No materials found for this instructor' });
    }

    res.status(200).json({ message: 'Materials fetched successfully', data: materials });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error: error.message });
  }
};


// get own materials
exports.getOwnMaterials = async (req, res) => {
  try {
    const instructorId = req.user._id;
  console.log('Instructor ID:', instructorId); // Log to check

    const materials = await UploadMaterial.find({ uploadedBy: instructorId })
      .populate('department course');

    res.status(200).json({ materials});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error: error.message });
  }
};


// Get material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await UploadMaterial.findById(req.params.id)
      .populate('uploadedBy', 'name')
      .populate('department', 'name')
      .populate('course', 'name');

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.status(200).json({ message: 'Material fetched successfully', data: material });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching material', error: error.message });
  }
};

// Update Material
exports.updateMaterial = async (req, res) => {
  try {
    const materialId = req.params.materialId;
    const updates = req.body; // Contains the fields to be updated

    // Find the material by ID and ensure it was uploaded by the authenticated instructor
    const material = await UploadMaterial.findOneAndUpdate(
      { _id: materialId, uploadedBy: req.user._id },  // Ensures the material belongs to the instructor
      updates,
      { new: true, runValidators: true }  // Return the updated document and validate the input
    );

    if (!material) {
      return res.status(404).json({ message: 'Material not found or not authorized' });
    }

    res.status(200).json({ message: 'Material updated successfully', data: material });
  } catch (error) {
    res.status(500).json({ message: 'Error updating material', error: error.message });
  }
};


// Delete Material




// Delete Material
exports.deleteMaterial = async (req, res) => {
  try {
    const materialId = req.params.materialId;  // Material ID from request params

    if (!materialId) {
      return res.status(400).json({ message: 'Material ID is required' });
    }

    console.log('Material ID:', materialId);  // Debugging: Log the material ID
    console.log('Authenticated Instructor ID:', req.user._id);  // Debugging: Log instructor ID

    // Convert IDs to ObjectId for proper querying
    const materialObjectId = mongoose.Types.ObjectId(materialId);
    const instructorObjectId = mongoose.Types.ObjectId(req.user._id);

    // Find the material by ID and ensure it was uploaded by the authenticated instructor
    const material = await UploadMaterial.findOne({
      _id: materialObjectId,
      uploadedBy: instructorObjectId  // Match the uploadedBy field with instructor ID
    });

    if (!material) {
      console.log('Material not found or not authorized');  // Debugging
      return res.status(404).json({ message: 'Material not found or not authorized' });
    }

    // Proceed to delete the material
    await material.remove();
    res.status(200).json({ message: 'Material deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting material:', error);  // Handle errors and log them
    res.status(500).json({ message: 'Error deleting material', error: error.message });
  }
};



// Get all materials (public)
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await UploadMaterial.find().populate('department course uploadedBy', 'name');
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error: error.message });
  }
};

// Get all materials with optional filters (course, department, instructor)
exports.getFilteredMaterials = async (req, res) => {
  try {
    const { courseName, departmentName, instructorName } = req.query;

    // Build the query object
    const query = {};
    if (courseName) {
      query.course = await Course.findOne({ name: courseName }).select('_id'); // Assuming Course model has a 'name' field
    }
    if (departmentName) {
      query.department = await Department.findOne({ name: departmentName }).select('_id'); // Assuming Department model has a 'name' field
    }
    if (instructorName) {
      query.uploadedBy = await Instructor.findOne({ name: instructorName }).select('_id'); // Assuming Instructor model has a 'name' field
    }

    // Fetch materials based on the constructed query
    const materials = await UploadMaterial.find(query).populate('department course uploadedBy', 'name');
    
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error: error.message });
  }
};


exports.downloadMaterial = async (req, res) => {
  try {
    const { id } = req.params; // Get the material ID from the request parameters
    const material = await UploadMaterial.findById(id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const fileUrl = material.fileUrl;

    // Check if the fileUrl is an external URL
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      // If it's an external URL, redirect the user to the download URL
      return res.redirect(fileUrl);
    }

    // If it's a local file, construct the file path from the 'uploads' directory
    const filePath = path.join(__dirname, '..', fileUrl);

    console.log('Full File Path:', filePath);

    // Check if the file exists on the server
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Detect file type to set the appropriate headers
    const fileExtension = path.extname(filePath).toLowerCase();

    // Set headers based on the file type
    let contentType;
    switch (fileExtension) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.ppt':
        contentType = 'application/vnd.ms-powerpoint';
        break;
      case '.pptx':
        contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      default:
        contentType = 'application/octet-stream'; // Fallback for unknown file types
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    res.setHeader('Content-Type', contentType);

    // Send the file for download
    return res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading material', error: error.message });
  }
};