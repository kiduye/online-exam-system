const SuperAdmin = require('../../models/users/superAdminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new super admin
exports.registerSuperAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Check if the super admin already exists
    let superAdmin = await SuperAdmin.findOne({ email });
    if (superAdmin) {
      return res.status(400).json({ msg: 'SuperAdmin already exists' });
    }

    // Create a new super admin
    superAdmin = new SuperAdmin({ email, password });
    await superAdmin.save();

    res.status(201).json({ msg: 'SuperAdmin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login super admin
exports.loginSuperAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Check if the super admin exists
    let superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { id: superAdmin._id, role: superAdmin.role };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get super admin profile
exports.getSuperAdminProfile = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.user.id).select('-password');
    if (!superAdmin) {
      return res.status(404).json({ msg: 'SuperAdmin not found' });
    }
    res.status(200).json(superAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update super admin profile
exports.updateSuperAdminProfile = async (req, res) => {
  const { email, password } = req.body;
  try {
    let superAdmin = await SuperAdmin.findById(req.user.id);
    if (!superAdmin) {
      return res.status(404).json({ msg: 'SuperAdmin not found' });
    }

    // Update super admin fields
    superAdmin.email = email || superAdmin.email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      superAdmin.password = await bcrypt.hash(password, salt);
    }

    // Save the updated super admin
    await superAdmin.save();
    res.status(200).json({ msg: 'Profile updated successfully', superAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout super admin (token-based, this could be handled client-side by removing the token)
exports.logoutSuperAdmin = (req, res) => {
  res.status(200).json({ msg: 'Logged out successfully' });
};

// Get all super admins
exports.getAllSuperAdmins = async (req, res) => {
  try {
    const superAdmins = await SuperAdmin.find().select('-password');
    res.status(200).json(superAdmins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get super admin by ID
exports.getSuperAdminById = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.params.id).select('-password');
    if (!superAdmin) {
      return res.status(404).json({ msg: 'SuperAdmin not found' });
    }
    res.status(200).json(superAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete super admin
exports.deleteSuperAdmin = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findByIdAndDelete(req.params.id);
    if (!superAdmin) {
      return res.status(404).json({ msg: 'SuperAdmin not found' });
    }
    res.status(200).json({ msg: 'SuperAdmin removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
