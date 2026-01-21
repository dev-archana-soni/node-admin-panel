const Module = require('../models/Module');
const Permission = require('../models/Permission');

// Get all modules
async function getAllModules(req, res) {
  try {
    const modules = await Module.find()
      .lean();
    
    return res.json({
      modules: modules.map(module => ({
        id: module._id.toString(),
        name: module.name,
        displayName: module.displayName,
        description: module.description || '',
        icon: module.icon || '',
        isActive: module.isActive,
        createdAt: module.createdAt,
        updatedAt: module.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all modules error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get active modules only
async function getActiveModules(req, res) {
  try {
    const modules = await Module.find({ isActive: true })
      .lean();
    
    return res.json({
      modules: modules.map(module => ({
        id: module._id.toString(),
        name: module.name,
        displayName: module.displayName,
        description: module.description || '',
        icon: module.icon || '',
        isActive: true
      }))
    });
  } catch (error) {
    console.error('Get active modules error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get module by ID
async function getModuleById(req, res) {
  const { id } = req.params;

  try {
    const module = await Module.findById(id).lean();
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    return res.json({
      module: {
        id: module._id.toString(),
        name: module.name,
        displayName: module.displayName,
        description: module.description || '',
        icon: module.icon || '',
        isActive: module.isActive,
        createdAt: module.createdAt,
        updatedAt: module.updatedAt
      }
    });
  } catch (error) {
    console.error('Get module by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new module
async function createModule(req, res) {
  const { name, displayName, description, icon, isActive } = req.body || {};

  if (!name || !displayName) {
    return res.status(400).json({ message: 'Module name and display name are required' });
  }

  try {
    // Check if module already exists
    const existingModule = await Module.findOne({ name: name.trim().toLowerCase() });
    if (existingModule) {
      return res.status(409).json({ message: 'Module already exists' });
    }

    const newModule = await Module.create({
      name: name.trim().toLowerCase(),
      displayName: displayName.trim(),
      description: description?.trim() || '',
      icon: icon?.trim() || '',
      isActive: isActive !== undefined ? isActive : true
    });

    return res.status(201).json({
      message: 'Module created successfully',
      module: {
        id: newModule._id.toString(),
        name: newModule.name,
        displayName: newModule.displayName,
        description: newModule.description,
        icon: newModule.icon,
        isActive: newModule.isActive,
        createdAt: newModule.createdAt,
        updatedAt: newModule.updatedAt
      }
    });
  } catch (error) {
    console.error('Create module error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update module
async function updateModule(req, res) {
  const { id } = req.params;
  const { name, displayName, description, icon, isActive } = req.body || {};

  try {
    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    if (name && name.toLowerCase() !== module.name) {
      const existingModule = await Module.findOne({ name: name.trim().toLowerCase() });
      if (existingModule) {
        return res.status(409).json({ message: 'Module already exists' });
      }
    }

    if (name) module.name = name.trim().toLowerCase();
    if (displayName) module.displayName = displayName.trim();
    if (description !== undefined) module.description = description?.trim() || '';
    if (icon !== undefined) module.icon = icon?.trim() || '';
    if (isActive !== undefined) module.isActive = isActive;

    await module.save();

    return res.json({
      message: 'Module updated successfully',
      module: {
        id: module._id.toString(),
        name: module.name,
        displayName: module.displayName,
        description: module.description,
        icon: module.icon,
        isActive: module.isActive,
        createdAt: module.createdAt,
        updatedAt: module.updatedAt
      }
    });
  } catch (error) {
    console.error('Update module error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete module
async function deleteModule(req, res) {
  const { id } = req.params;

  try {
    // Check if any permissions use this module
    const permissionCount = await Permission.countDocuments({ module: id });
    if (permissionCount > 0) {
      return res.status(409).json({ 
        message: `Cannot delete module. ${permissionCount} permission(s) are using this module.` 
      });
    }

    const module = await Module.findByIdAndDelete(id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    return res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Delete module error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllModules,
  getActiveModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule
};
