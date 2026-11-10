const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { registerSchema, loginSchema, updateProfileSchema } = require('../validators/authValidator');

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/users/me', authenticateToken, authController.getProfile);
router.put('/users/profile', authenticateToken, validateRequest(updateProfileSchema), authController.updateProfile);

module.exports = router;

