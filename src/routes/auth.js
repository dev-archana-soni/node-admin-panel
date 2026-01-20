const { Router } = require('express');
const { login, register } = require('../controllers/authController');
const authenticate = require('../middleware/auth');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
