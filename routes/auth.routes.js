const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/jwt');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});

module.exports = router;
