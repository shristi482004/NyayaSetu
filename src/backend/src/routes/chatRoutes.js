const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { askQuestionSchema } = require('../validators/chatValidator');
const { attachLegalDisclaimer } = require('../middleware/disclaimer');

router.use(authenticateToken);
router.use(attachLegalDisclaimer);

router.post('/:id', validateRequest(askQuestionSchema), chatController.askQuestion);
router.get('/:id/history', chatController.getChatHistory);

module.exports = router;

