const fs = require('fs');
const crypto = require('crypto');
const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const AnalysisResult = require('../models/AnalysisResult');
const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const aiServiceClient = require('./aiServiceClient');
const auditService = require('./auditService');
const logger = require('../config/logger');

class DocumentService {
  /**
   * Computes SHA-256 checksum of an uploaded file.
   */
  async computeChecksum(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  }

  /**
   * Creates initial document metadata record in MongoDB.
   */
  async createDocumentRecord({ userId, file }) {
    const checksum = await this.computeChecksum(file.path);

    const doc = await Document.create({
      userId,
      fileName: file.filename,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      checksum,
      storagePath: file.path,
      status: 'uploaded'
    });

    await auditService.logEvent({
      userId,
      action: 'DOC_UPLOAD',
      level: 'info',
      details: { docId: doc._id, fileName: file.originalname, fileSize: file.size }
    });

    return doc;
  }

  /**
   * Dispatches text extraction task to AI microservice and saves page chunks.
   */
  async processExtraction(documentId, forceOcr = false) {
    const doc = await Document.findById(documentId);
    if (!doc) {
      throw new Error(`Document ${documentId} not found.`);
    }

    doc.status = 'extracting';
    await doc.save();

    try {
      const extractionResult = await aiServiceClient.extractDocument(doc.storagePath, doc._id.toString(), forceOcr);

      if (!extractionResult.success) {
        throw new Error(extractionResult.error || 'Extraction reported failure.');
      }

      // Remove existing chunks if re-extracting
      await DocumentChunk.deleteMany({ documentId: doc._id });

      // Save page chunks
      const chunkDocs = extractionResult.chunks.map((c) => ({
        documentId: doc._id,
        pageNumber: c.page_number,
        chunkIndex: c.chunk_index,
        textContent: c.text_content,
        charCount: c.char_count,
        isOcrApplied: c.is_ocr_applied
      }));

      await DocumentChunk.insertMany(chunkDocs);

      doc.status = 'ready';
      doc.pageCount = extractionResult.total_pages;
      doc.errorMessage = null;
      await doc.save();

      await auditService.logEvent({
        userId: doc.userId,
        action: 'DOC_EXTRACT_SUCCESS',
        level: 'info',
        details: { docId: doc._id, totalPages: doc.pageCount }
      });

      return { doc, chunks: chunkDocs };
    } catch (err) {
      logger.error(`Extraction failed for document ${doc._id}: ${err.message}`);
      doc.status = 'failed';
      doc.errorMessage = err.message;
      await doc.save();

      await auditService.logEvent({
        userId: doc.userId,
        action: 'DOC_EXTRACT_FAILED',
        level: 'error',
        details: { docId: doc._id, error: err.message }
      });

      throw err;
    }
  }

  /**
   * Deletes a document and cascades to chunks, analysis results, and chat messages.
   */
  async deleteDocument(documentId, requestingUserId, requestingUserRole) {
    const doc = await Document.findById(documentId);
    if (!doc) {
      const err = new Error('Document not found.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }

    // Ownership check: owner or admin
    if (doc.userId.toString() !== requestingUserId && requestingUserRole !== 'admin') {
      const err = new Error('Access denied. You do not own this document.');
      err.statusCode = 403;
      err.isOperational = true;
      throw err;
    }

    // Remove file from disk
    if (fs.existsSync(doc.storagePath)) {
      try {
        fs.unlinkSync(doc.storagePath);
      } catch (e) {
        logger.warn(`Could not delete physical file at ${doc.storagePath}: ${e.message}`);
      }
    }

    // Cascade deletions
    await DocumentChunk.deleteMany({ documentId: doc._id });
    await AnalysisResult.deleteOne({ documentId: doc._id });

    const sessions = await ChatSession.find({ documentId: doc._id });
    const sessionIds = sessions.map((s) => s._id);
    await ChatMessage.deleteMany({ sessionId: { $in: sessionIds } });
    await ChatSession.deleteMany({ documentId: doc._id });

    await Document.findByIdAndDelete(doc._id);

    await auditService.logEvent({
      userId: requestingUserId,
      action: 'DOC_DELETE',
      level: 'info',
      details: { docId: doc._id, fileName: doc.originalName }
    });

    return { message: 'Document and all associated intelligence records deleted successfully.' };
  }
}

module.exports = new DocumentService();

