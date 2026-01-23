const UserGroup = require('../models/UserGroup');
const User = require('../models/User');

// Get all user groups
async function getAllUserGroups(req, res) {
  try {
    const groups = await UserGroup.find()
      .populate('members', 'id email name firstName lastName')
      .populate('createdBy', 'id email name')
      .lean();
    
    return res.json({
      groups: groups.map(group => ({
        id: group._id.toString(),
        name: group.name,
        description: group.description || '',
        logo: group.logo || '',
        members: (group.members || []).map(member => ({
          id: member._id?.toString() || member,
          email: member.email || '',
          name: member.name || '',
          firstName: member.firstName || '',
          lastName: member.lastName || ''
        })),
        createdBy: group.createdBy ? { 
          id: group.createdBy._id?.toString(), 
          name: group.createdBy.name 
        } : null,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get all user groups error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get user group by ID
async function getUserGroupById(req, res) {
  const { id } = req.params;

  try {
    const group = await UserGroup.findById(id)
      .populate('members', 'id email name firstName lastName image')
      .populate('createdBy', 'id email name')
      .lean();
    
    if (!group) {
      return res.status(404).json({ message: 'User group not found' });
    }

    return res.json({
      group: {
        id: group._id.toString(),
        name: group.name,
        description: group.description || '',
        logo: group.logo || '',
        members: (group.members || []).map(member => ({
          id: member._id?.toString() || member,
          email: member.email || '',
          name: member.name || '',
          firstName: member.firstName || '',
          lastName: member.lastName || '',
          image: member.image || ''
        })),
        createdBy: group.createdBy ? { 
          id: group.createdBy._id?.toString(), 
          name: group.createdBy.name 
        } : null,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
      }
    });
  } catch (error) {
    console.error('Get user group by ID error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new user group
async function createUserGroup(req, res) {
  const { name, description, members } = req.body || {};
  const userId = req.user?.userId || req.user?.id;

  // Validation
  if (!name) {
    return res.status(400).json({ message: 'Group name is required' });
  }

  try {
    // Parse members safely (multer + FormData sends strings)
    let parsedMembers = [];
    if (members) {
      if (Array.isArray(members)) {
        parsedMembers = members;
      } else {
        try {
          parsedMembers = JSON.parse(members);
        } catch (err) {
          parsedMembers = [];
        }
      }
    }

    // Validate members exist
    if (parsedMembers.length > 0) {
      const existingMembers = await User.countDocuments({ _id: { $in: parsedMembers } });
      if (existingMembers !== parsedMembers.length) {
        return res.status(400).json({ message: 'One or more users do not exist' });
      }
    }

    const logo = req.file ? `/uploads/${req.uploadSubdir || 'avatars'}/${req.file.filename}` : '';

    const newGroup = new UserGroup({
      name: name.trim(),
      description: description?.trim() || '',
      logo,
      members: parsedMembers,
      createdBy: userId
    });

    await newGroup.save();
    await newGroup.populate('members', 'id email name firstName lastName image');
    await newGroup.populate('createdBy', 'id email name');

    return res.status(201).json({
      message: 'User group created successfully',
      group: {
        id: newGroup._id.toString(),
        name: newGroup.name,
        description: newGroup.description,
        logo: newGroup.logo,
        members: (newGroup.members || []).map(member => ({
          id: member._id.toString(),
          email: member.email,
          name: member.name,
          firstName: member.firstName || '',
          lastName: member.lastName || '',
          image: member.image || ''
        })),
        createdBy: newGroup.createdBy ? {
          id: newGroup.createdBy._id.toString(),
          name: newGroup.createdBy.name
        } : null,
        createdAt: newGroup.createdAt,
        updatedAt: newGroup.updatedAt
      }
    });
  } catch (error) {
    console.error('Create user group error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Update user group
async function updateUserGroup(req, res) {
  const { id } = req.params;
  const { name, description, members } = req.body || {};

  try {
    const group = await UserGroup.findById(id);

    if (!group) {
      return res.status(404).json({ message: 'User group not found' });
    }

    // Update basic fields
    if (name) group.name = name.trim();
    if (description !== undefined) group.description = description?.trim() || '';
    
    // Update members
    if (members !== undefined) {
      let parsedMembers = [];
      if (Array.isArray(members)) {
        parsedMembers = members;
      } else {
        try {
          parsedMembers = JSON.parse(members);
        } catch (err) {
          parsedMembers = [];
        }
      }

      const existingMembers = await User.countDocuments({ _id: { $in: parsedMembers } });
      if (existingMembers !== parsedMembers.length) {
        return res.status(400).json({ message: 'One or more users do not exist' });
      }
      group.members = parsedMembers;
    }

    // Update logo if new file is uploaded
    if (req.file) {
      group.logo = `/uploads/${req.uploadSubdir || 'avatars'}/${req.file.filename}`;
    }

    await group.save();
    await group.populate('members', 'id email name firstName lastName image');
    await group.populate('createdBy', 'id email name');

    return res.json({
      message: 'User group updated successfully',
      group: {
        id: group._id.toString(),
        name: group.name,
        description: group.description,
        logo: group.logo,
        members: (group.members || []).map(member => ({
          id: member._id.toString(),
          email: member.email,
          name: member.name,
          firstName: member.firstName || '',
          lastName: member.lastName || '',
          image: member.image || ''
        })),
        createdBy: group.createdBy ? {
          id: group.createdBy._id.toString(),
          name: group.createdBy.name
        } : null,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
      }
    });
  } catch (error) {
    console.error('Update user group error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete user group
async function deleteUserGroup(req, res) {
  const { id } = req.params;

  try {
    const group = await UserGroup.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ message: 'User group not found' });
    }

    return res.json({ message: 'User group deleted successfully' });
  } catch (error) {
    console.error('Delete user group error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Add member to group
async function addMemberToGroup(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const group = await UserGroup.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'User group not found' });
    }

    // Check if user already in group
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in this group' });
    }

    group.members.push(userId);
    await group.save();
    await group.populate('members', 'id email name firstName lastName image');

    return res.json({
      message: 'Member added successfully',
      group: {
        id: group._id.toString(),
        name: group.name,
        members: (group.members || []).map(member => ({
          id: member._id.toString(),
          email: member.email,
          name: member.name,
          firstName: member.firstName || '',
          lastName: member.lastName || '',
          image: member.image || ''
        }))
      }
    });
  } catch (error) {
    console.error('Add member to group error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Remove member from group
async function removeMemberFromGroup(req, res) {
  const { id, userId } = req.params;

  try {
    const group = await UserGroup.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'User group not found' });
    }

    group.members = group.members.filter(member => member.toString() !== userId);
    await group.save();
    await group.populate('members', 'id email name firstName lastName image');

    return res.json({
      message: 'Member removed successfully',
      group: {
        id: group._id.toString(),
        name: group.name,
        members: (group.members || []).map(member => ({
          id: member._id.toString(),
          email: member.email,
          name: member.name,
          firstName: member.firstName || '',
          lastName: member.lastName || '',
          image: member.image || ''
        }))
      }
    });
  } catch (error) {
    console.error('Remove member from group error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllUserGroups,
  getUserGroupById,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
  addMemberToGroup,
  removeMemberFromGroup
};
