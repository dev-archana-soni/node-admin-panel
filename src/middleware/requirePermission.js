const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

/**
 * Middleware to check if user has specific permission
 * Usage: router.post('/users', requirePermission('users.create'), createUser)
 */
function requirePermission(requiredPermission) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId)
        .populate({
          path: 'role',
          model: 'Role',
          populate: {
            path: 'permissions',
            model: 'Permission'
          }
        });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Get user's role with permissions
      const userRole = user.role;
      
      if (!userRole) {
        return res.status(403).json({ message: 'User has no role assigned' });
      }

      // Check if permission exists in user's role
      const hasPermission = userRole.permissions.some(
        perm => perm.name === requiredPermission && perm.isActive
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'Insufficient permissions',
          requiredPermission
        });
      }

      // Attach user info to request for use in controller
      req.user = user;
      req.userRole = userRole;
      
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

module.exports = requirePermission;
