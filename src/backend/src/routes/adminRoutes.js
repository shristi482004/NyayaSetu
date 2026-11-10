const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { validateRequest } = require('../middleware/validation');
const { updateUserStatusSchema } = require('../validators/adminValidator');

router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/users', adminController.listUsers);
router.patch('/users/:id/status', validateRequest(updateUserStatusSchema), adminController.updateUserStatus);
router.get('/logs', adminController.getAuditLogs);

module.exports = router;

