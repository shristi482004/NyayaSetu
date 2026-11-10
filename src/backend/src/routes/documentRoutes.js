const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticateToken } = require('../middleware/auth');
const { upload, verifyPdfHeader } = require('../middleware/upload');

router.use(authenticateToken);

router.post('/', upload.single('file'), verifyPdfHeader, documentController.uploadDocument);
router.get('/', documentController.listDocuments);
router.get('/:id', documentController.getDocumentById);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;

