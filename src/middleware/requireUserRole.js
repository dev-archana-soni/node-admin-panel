const User = require('../models/User');

async function requireUserRole(req, res, next) {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId).populate('role');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user has 'user' role (not admin)
    const hasUserRole = user.role && user.role.name && user.role.name.toLowerCase() === 'user';
    
    if (!hasUserRole) {
      return res.status(403).json({ message: 'Access denied. Only users with user role can access this resource.' });
    }

    next();
  } catch (error) {
    console.error('Role check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = requireUserRole;
