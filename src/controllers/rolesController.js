const Role = require('../models/Role');
const User = require('../models/User');

// Get all roles
async function getAllRoles(req, res) {
  try {
    const roles = await Role.find()
      .populate('permissions', '_id')
      .lean();
    
    return res.json({
      roles: roles.map(role => ({
        id: role._id.toString(),
        name: role.name,
        description: role.description || '',
        isActive: role.isActive,
        permissions: (role.permissions || []).map(p => p._id?.toString() || p),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all roles error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get active roles only (for dropdowns)
async function getActiveRoles(req, res) {
  try {
    const roles = await Role.find({ isActive: true })
      .select('_id name')
      .lean();
    
    return res.json({
      roles: roles.map(role => ({
        id: role._id.toString(),
        name: role.name
      }))
    });
  } catch (error) {
    console.error('Get active roles error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get role by ID
async function getRoleById(req, res) {
  const { id } = req.params;

  try {
    const role = await Role.findById(id)
      .populate('permissions', '_id')
      .lean();
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    return res.json({
      role: {
        id: role._id.toString(),
        name: role.name,
        description: role.description || '',
        isActive: role.isActive,
        permissions: (role.permissions || []).map(p => p._id?.toString() || p),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      }
    });
  } catch (error) {
    console.error('Get role by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new role
async function createRole(req, res) {
  const { name, description, isActive, permissions } = req.body || {};

  // Validation
  if (!name) {
    return res.status(400).json({ message: 'Role name is required' });
  }

  try {
    const existingRole = await Role.findOne({ name: name.trim().toLowerCase() });
    if (existingRole) {
      return res.status(409).json({ message: 'Role already exists with this name' });
    }

    const newRole = await Role.create({
      name: name.trim().toLowerCase(),
      description: description?.trim() || '',
      isActive: isActive !== undefined ? isActive : true,
      permissions: permissions || []
    });

    await newRole.populate('permissions', '_id');

    return res.status(201).json({
      message: 'Role created successfully',
      role: {
        id: newRole._id.toString(),
        name: newRole.name,
        description: newRole.description,
        isActive: newRole.isActive,
        permissions: (newRole.permissions || []).map(p => p._id?.toString() || p),
        createdAt: newRole.createdAt,
        updatedAt: newRole.updatedAt
      }
    });
  } catch (error) {
    console.error('Create role error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update role
async function updateRole(req, res) {
  const { id } = req.params;
  const { name, description, isActive, permissions } = req.body || {};

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if name is being changed and if new name already exists
    if (name && name.toLowerCase() !== role.name) {
      const existingRole = await Role.findOne({ name: name.trim().toLowerCase() });
      if (existingRole) {
        return res.status(409).json({ message: 'Role already exists with this name' });
      }
    }

    // Update fields
    if (name) role.name = name.trim().toLowerCase();
    if (description !== undefined) role.description = description?.trim() || '';
    if (isActive !== undefined) role.isActive = isActive;
    if (permissions !== undefined) role.permissions = permissions;

    await role.save();
    await role.populate('permissions', '_id');

    return res.json({
      message: 'Role updated successfully',
      role: {
        id: role._id.toString(),
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        permissions: (role.permissions || []).map(p => p._id?.toString() || p),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      }
    });
  } catch (error) {
    console.error('Update role error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete role
async function deleteRole(req, res) {
  const { id } = req.params;

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if any users have this role
    const usersWithRole = await User.countDocuments({ role: role._id });
    if (usersWithRole > 0) {
      return res.status(400).json({ 
        message: `Cannot delete role. ${usersWithRole} user(s) are assigned to this role.` 
      });
    }

    await Role.findByIdAndDelete(id);

    return res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllRoles,
  getActiveRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
