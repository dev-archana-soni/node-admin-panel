const Permission = require('../models/Permission');
const Module = require('../models/Module');

// Get all permissions with module details
async function getAllPermissions(req, res) {
  try {
    const permissions = await Permission.find()
      .populate('module', 'name displayName')
      .lean();
    
    return res.json({
      permissions: permissions.map(perm => ({
        id: perm._id.toString(),
        name: perm.name,
        module: perm.module ? {
          id: perm.module._id.toString(),
          name: perm.module.name,
          displayName: perm.module.displayName
        } : null,
        description: perm.description || '',
        isActive: perm.isActive,
        createdAt: perm.createdAt,
        updatedAt: perm.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all permissions error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get permissions by module
async function getPermissionsByModule(req, res) {
  const { moduleId } = req.params;

  try {
    const permissions = await Permission.find({ module: moduleId, isActive: true })
      .lean();
    
    return res.json({
      permissions: permissions.map(perm => ({
        id: perm._id.toString(),
        name: perm.name,
        description: perm.description || '',
        isActive: perm.isActive
      }))
    });
  } catch (error) {
    console.error('Get permissions by module error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get permission by ID
async function getPermissionById(req, res) {
  const { id } = req.params;

  try {
    const permission = await Permission.findById(id)
      .populate('module', 'name displayName')
      .lean();
    
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    return res.json({
      permission: {
        id: permission._id.toString(),
        name: permission.name,
        module: permission.module,
        description: permission.description || '',
        isActive: permission.isActive,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt
      }
    });
  } catch (error) {
    console.error('Get permission by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new permission
async function createPermission(req, res) {
  const { name, module, description, isActive } = req.body || {};

  if (!name || !module) {
    return res.status(400).json({ message: 'Permission name and module are required' });
  }

  try {
    // Check if module exists
    const moduleExists = await Module.findById(module);
    if (!moduleExists) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Check if permission already exists
    const existingPermission = await Permission.findOne({ name: name.trim().toLowerCase() });
    if (existingPermission) {
      return res.status(409).json({ message: 'Permission already exists' });
    }

    const newPermission = await Permission.create({
      name: name.trim().toLowerCase(),
      module,
      description: description?.trim() || '',
      isActive: isActive !== undefined ? isActive : true
    });

    await newPermission.populate('module', 'name displayName');

    return res.status(201).json({
      message: 'Permission created successfully',
      permission: {
        id: newPermission._id.toString(),
        name: newPermission.name,
        module: newPermission.module,
        description: newPermission.description,
        isActive: newPermission.isActive,
        createdAt: newPermission.createdAt,
        updatedAt: newPermission.updatedAt
      }
    });
  } catch (error) {
    console.error('Create permission error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update permission
async function updatePermission(req, res) {
  const { id } = req.params;
  const { name, module, description, isActive } = req.body || {};

  try {
    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    if (module) {
      const moduleExists = await Module.findById(module);
      if (!moduleExists) {
        return res.status(404).json({ message: 'Module not found' });
      }
    }

    if (name && name.toLowerCase() !== permission.name) {
      const existingPermission = await Permission.findOne({ name: name.trim().toLowerCase() });
      if (existingPermission) {
        return res.status(409).json({ message: 'Permission already exists' });
      }
    }

    if (name) permission.name = name.trim().toLowerCase();
    if (module) permission.module = module;
    if (description !== undefined) permission.description = description?.trim() || '';
    if (isActive !== undefined) permission.isActive = isActive;

    await permission.save();
    await permission.populate('module', 'name displayName');

    return res.json({
      message: 'Permission updated successfully',
      permission: {
        id: permission._id.toString(),
        name: permission.name,
        module: permission.module,
        description: permission.description,
        isActive: permission.isActive,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt
      }
    });
  } catch (error) {
    console.error('Update permission error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete permission
async function deletePermission(req, res) {
  const { id } = req.params;

  try {
    const permission = await Permission.findByIdAndDelete(id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    return res.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    console.error('Delete permission error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllPermissions,
  getPermissionsByModule,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
};
