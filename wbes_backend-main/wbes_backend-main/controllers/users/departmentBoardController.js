// const DepartmentBoard = require('../../models/users/departmentBoardModel');
// const Admin = require('../../models/users/adminModel');

// // Create Department Board Member
// exports.createDepartmentBoard = async (req, res) => {
//   const adminId = req.user._id; // Admin ID from authenticated user

//   try {
//     // Find the admin to get the department information
//     const admin = await Admin.findById(adminId).populate('department');

//     if (!admin) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     const { name, email, password } = req.body;
//     const department = {
//       id: admin.department._id, // Use the department ID from the admin
//       name: admin.department.name // Get the department name from the admin
//     };

//     const newDepartmentBoard = new DepartmentBoard({ 
//       name, 
//       email, 
//       password, 
//       department // Store department ID and name
//     });

//     await newDepartmentBoard.save();
//     res.status(201).json({ message: 'Department Board Member created', data: newDepartmentBoard });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get All Department Board Members (Admin's department)
// exports.getDepartmentBoards = async (req, res) => {
//   try {
//     // Find the admin to get the department information
//     const admin = await Admin.findById(req.user._id).populate('department');

//     if (!admin || !admin.department) {
//       return res.status(404).json({ error: 'Admin or department not found' });
//     }

//     const departmentName = admin.department.name;

//     // Find department boards based on the department name
//     const departmentBoards = await DepartmentBoard.find({ 'department.name': departmentName });

//     res.json(departmentBoards);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // Update Department Board Member
// exports.updateDepartmentBoard = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const updatedDepartmentBoard = await DepartmentBoard.findOneAndUpdate(
//       { _id: id, department: req.user.department._id },
//       updates,
//       { new: true }
//     );

//     if (!updatedDepartmentBoard) {
//       return res.status(404).json({ message: 'Department Board Member not found or not in your department' });
//     }

//     res.json(updatedDepartmentBoard);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete Department Board Member
// exports.deleteDepartmentBoard = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedDepartmentBoard = await DepartmentBoard.findOneAndDelete({
//       _id: id, 
//       department: req.user.department._id
//     });

//     if (!deletedDepartmentBoard) {
//       return res.status(404).json({ message: 'Department Board Member not found or not in your department' });
//     }

//     res.json({ message: 'Department Board Member deleted' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const DepartmentBoard = require('../../models/users/departmentBoardModel');
const Admin = require('../../models/users/adminModel');

// Create Department Board Member
exports.createDepartmentBoard = async (req, res) => {
  const adminId = req.user._id; // Admin ID from authenticated user

  try {
    // Find the admin to get the department information
    const admin = await Admin.findById(adminId).populate('department');

    if (!admin || !admin.department) {
      return res.status(404).json({ error: 'Admin or department not found' });
    }

    const { name, email, password } = req.body;
    
    // Create new Department Board member with the admin's department
    const newDepartmentBoard = new DepartmentBoard({ 
      name, 
      email, 
      password, 
      department: {
        id: admin.department._id, // Use the department ID from the admin
        name: admin.department.name // Use department name from the admin
      }
    });

    await newDepartmentBoard.save();
    res.status(201).json({ message: 'Department Board Member created', data: newDepartmentBoard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Department Board Members (Admin's department)
exports.getDepartmentBoards = async (req, res) => {
  try {
    // Find the admin to get the department information
    const admin = await Admin.findById(req.user._id).populate('department');

    if (!admin || !admin.department) {
      return res.status(404).json({ error: 'Admin or department not found' });
    }

    // Find department board members belonging to the admin's department
    const departmentBoards = await DepartmentBoard.find({ 'department.id': admin.department._id });

    res.json(departmentBoards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Department Board Member (restrict to admin's department)
exports.updateDepartmentBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Restrict the update to department boards within the admin's department
    const updatedDepartmentBoard = await DepartmentBoard.findOneAndUpdate(
      { _id: id, 'department.id': req.user.department._id },
      updates,
      { new: true }
    );

    if (!updatedDepartmentBoard) {
      return res.status(404).json({ message: 'Department Board Member not found or not in your department' });
    }

    res.json(updatedDepartmentBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Department Board Member (restrict to admin's department)
exports.deleteDepartmentBoard = async (req, res) => {
  try {
    const { id } = req.params;

    // Restrict the delete action to department boards within the admin's department
    const deletedDepartmentBoard = await DepartmentBoard.findOneAndDelete({
      _id: id, 
      'department.id': req.user.department._id
    });

    if (!deletedDepartmentBoard) {
      return res.status(404).json({ message: 'Department Board Member not found or not in your department' });
    }

    res.json({ message: 'Department Board Member deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
