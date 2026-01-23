const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/config');
const User = require('../models/User');
const Role = require('../models/Role');

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .populate('role', 'name')
      .lean();
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role?.name || 'user',
        name: user.name
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role?.name || 'user'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function register(req, res) {
  const { email, password, name } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    // Get default 'user' role
    const defaultRole = await Role.findOne({ name: 'user', isActive: true });
    if (!defaultRole) {
      return res.status(500).json({ message: 'Default user role not found' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: defaultRole._id,
      passwordHash
    });

    await newUser.populate('role', 'name');

    const token = jwt.sign(
      {
        userId: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role?.name || 'user',
        name: newUser.name
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role?.name || 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function logout(req, res) {
  // Stateless JWT logout: validate token (via middleware) and let the client discard it.
  // A token blacklist/persistence layer can be added here later if needed.
  return res.json({ message: 'Logged out successfully' });
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.userId)
      .populate('role', 'name')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role?.name || 'user',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        image: user.image || ''
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateProfile(req, res) {
  const { firstName, lastName, phone, address } = req.body || {};
  const updateData = {
    firstName: firstName?.trim() || '',
    lastName: lastName?.trim() || '',
    phone: phone?.trim() || '',
    address: address?.trim() || ''
  };

  // Add image if file was uploaded
  if (req.file) {
    updateData.image = `http://localhost:5000/uploads/avatars/${req.file.filename}`;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).populate('role', 'name').lean();

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role?.name || 'user',
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || '',
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        image: updatedUser.image || ''
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updatePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body || {};

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: 'New password must be different from current password' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and save new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newPasswordHash;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  updatePassword
};
