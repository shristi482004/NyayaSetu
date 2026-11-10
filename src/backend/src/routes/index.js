const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const documentRoutes = require('./documentRoutes');
const analysisRoutes = require('./analysisRoutes');
const chatRoutes = require('./chatRoutes');
const adminRoutes = require('./adminRoutes');
const healthRoutes = require('./healthRoutes');

router.use('/', authRoutes);
router.use('/documents', documentRoutes);
router.use('/analysis', analysisRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);
router.use('/', healthRoutes);

module.exports = router;

