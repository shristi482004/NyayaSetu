const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { authenticateToken } = require('../middleware/auth');

router.get('/health', healthController.getHealthStatus);
router.get('/dashboard', authenticateToken, healthController.getDashboard);

module.exports = router;

