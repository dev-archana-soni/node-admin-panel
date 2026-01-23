const { Router } = require('express');
const { 
  getAllUserGroups, 
  getUserGroupById, 
  createUserGroup, 
  updateUserGroup, 
  deleteUserGroup,
  addMemberToGroup,
  removeMemberFromGroup
} = require('../controllers/userGroupsController');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = Router();

// Get all user groups
router.get('/', authenticate, getAllUserGroups);

// Get user group by ID
router.get('/:id', authenticate, getUserGroupById);

// Create new user group
router.post('/', authenticate, upload.single('logo'), createUserGroup);

// Update user group
router.put('/:id', authenticate, upload.single('logo'), updateUserGroup);

// Delete user group
router.delete('/:id', authenticate, deleteUserGroup);

// Add member to group
router.post('/:id/members', authenticate, addMemberToGroup);

// Remove member from group
router.delete('/:id/members/:userId', authenticate, removeMemberFromGroup);

module.exports = router;
