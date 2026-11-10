const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const documentService = require('../services/documentService');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No file uploaded. Please supply a PDF document.'
      });
    }

    const doc = await documentService.createDocumentRecord({
      userId: req.user.id,
      file: req.file
    });

    // Start extraction asynchronously or synchronously based on query
    const syncExtract = req.query.sync === 'true';
    if (syncExtract) {
      await documentService.processExtraction(doc._id);
      const updated = await Document.findById(doc._id);
      return res.status(201).json({
        success: true,
        data: updated,
        message: 'Document uploaded and text extraction completed.'
      });
    }

    // Trigger extraction in background
    documentService.processExtraction(doc._id).catch((err) => {
      // Background extraction errors are caught and updated in MongoDB
    });

    return res.status(201).json({
      success: true,
      data: {
        docId: doc._id.toString(),
        fileName: doc.fileName,
        originalName: doc.originalName,
        fileSize: doc.fileSize,
        status: doc.status,
        uploadDate: doc.uploadDate
      },
      message: 'Document uploaded successfully and queued for text extraction.'
    });
  } catch (err) {
    next(err);
  }
};

const listDocuments = async (req, res, next) => {
  try {
    const query = { userId: req.user.id };
    const documents = await Document.find(query).sort({ uploadDate: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (err) {
    next(err);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Document not found.'
      });
    }

    // Tenant isolation ownership check
    if (doc.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access denied. You do not have permission to view this document.'
      });
    }

    const chunks = await DocumentChunk.find({ documentId: doc._id }).sort({ pageNumber: 1 });

    return res.status(200).json({
      success: true,
      data: {
        document: doc,
        chunks
      }
    });
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const result = await documentService.deleteDocument(req.params.id, req.user.id, req.user.role);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadDocument,
  listDocuments,
  getDocumentById,
  deleteDocument
};

