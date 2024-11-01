const Admin = require('../../models/users/adminModel');
const bcrypt = require('bcryptjs');

// Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create a new admin
    const newAdmin = new Admin({ name, email, password, department });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate('department'); // Populate department
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};

// Get an admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('department');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin', error: error.message });
  }
};

// Update an admin
exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    let admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.password = password ? await bcrypt.hash(password, 10) : admin.password;
    admin.department = department || admin.department;

    await admin.save();

    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin', error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log('Delete request for ID:', id);

    // Use findByIdAndDelete to remove the document directly
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      // console.log('Admin not found in the database');
      return res.status(404).json({ message: 'Admin not found' });
    }

    // console.log('Admin deleted successfully');
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error during deletion:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
