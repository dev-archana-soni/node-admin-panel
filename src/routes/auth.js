const { Router } = require('express');
const { login, register, logout, getProfile, updateProfile, updatePassword } = require('../controllers/authController');
const authenticate = require('../middleware/auth');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, (req, res) => {
  return res.json({ user: req.user });
});
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/update-password', authenticate, updatePassword);

module.exports = router;
