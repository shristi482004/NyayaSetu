const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { attachLegalDisclaimer } = require('../middleware/disclaimer');

router.use(authenticateToken);
router.use(attachLegalDisclaimer);

// Analysis initiation and retrieval
router.post('/:id', analysisController.initiateAnalysis);
router.get('/:id', analysisController.getAnalysis);

// Specific structured analysis sub-resources
router.get('/:id/summary', analysisController.getSummary);
router.get('/:id/faqs', analysisController.getFaqs);
router.get('/:id/flowchart', analysisController.getFlowchart);
router.get('/:id/timeline', analysisController.getTimeline);
router.get('/:id/arguments', requireRole(['lawyer', 'admin']), analysisController.getArguments);

module.exports = router;
