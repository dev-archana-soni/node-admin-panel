const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .populate('role', 'name description')
      .lean();
    
    return res.json({
      users: users.map(user => ({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role ? { id: user.role._id?.toString(), name: user.role.name } : null,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        image: user.image || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get user by ID
async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .select('-passwordHash')
      .populate('role', 'name description')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role ? { id: user.role._id?.toString(), name: user.role.name } : null,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        image: user.image || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new user
async function createUser(req, res) {
  const { email, password, name, role, firstName, lastName, phone, address } = req.body || {};

  // Validation
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'Email, password, name, and role are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if role exists and is active
    const roleDoc = await Role.findById(role);
    if (!roleDoc || !roleDoc.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive role' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const userData = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role,
      passwordHash,
      firstName: firstName?.trim() || '',
      lastName: lastName?.trim() || '',
      phone: phone?.trim() || '',
      address: address?.trim() || ''
    };
    
    // Add image if uploaded
    if (req.file) {
      userData.image = `/uploads/avatars/${req.file.filename}`;
    }
    
    const newUser = await User.create(userData);

    await newUser.populate('role', 'name description');

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role ? { id: newUser.role._id.toString(), name: newUser.role.name } : null,
        firstName: newUser.firstName || '',
        lastName: newUser.lastName || '',
        phone: newUser.phone || '',
        address: newUser.address || '',
        image: newUser.image || '',
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update user
async function updateUser(req, res) {
  const { id } = req.params;
  const { email, name, role, firstName, lastName, phone, address } = req.body || {};

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if new email already exists
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists with this email' });
      }
    }

    // Validate role if provided
    if (role) {
      const roleDoc = await Role.findById(role);
      if (!roleDoc || !roleDoc.isActive) {
        return res.status(400).json({ message: 'Invalid or inactive role' });
      }
    }

    // Update fields
    if (email) user.email = email.trim().toLowerCase();
    if (name) user.name = name.trim();
    if (role) user.role = role;
    if (firstName !== undefined) user.firstName = firstName?.trim() || '';
    if (lastName !== undefined) user.lastName = lastName?.trim() || '';
    if (phone !== undefined) user.phone = phone?.trim() || '';
    if (address !== undefined) user.address = address?.trim() || '';
    if (req.file) user.image = `/uploads/avatars/${req.file.filename}`;

    await user.save();
    await user.populate('role', 'name description');

    return res.json({
      message: 'User updated successfully',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role ? { id: user.role._id.toString(), name: user.role.name } : null,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        image: user.image || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete user
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get available roles
async function getAvailableRoles(req, res) {
  try {
    const roles = await Role.find({ isActive: true })
      .select('_id name description')
      .lean();
    
    return res.json({ 
      roles: roles.map(role => ({
        id: role._id.toString(),
        name: role.name,
        description: role.description || ''
      }))
    });
  } catch (error) {
    console.error('Get available roles error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAvailableRoles
};
