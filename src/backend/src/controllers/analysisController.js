const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const AnalysisResult = require('../models/AnalysisResult');
const aiServiceClient = require('../services/aiServiceClient');
const auditService = require('../services/auditService');

/**
 * Verify document existence and caller ownership.
 * Returns { doc, errorResponse } tuple.
 */
const verifyDocumentAccess = async (docId, user) => {
  const doc = await Document.findById(docId);
  if (!doc) {
    return {
      doc: null,
      errorResponse: {
        status: 404,
        body: {
          success: false,
          error: 'Not Found',
          message: 'Document not found.'
        }
      }
    };
  }

  if (doc.userId.toString() !== user.id && user.role !== 'admin') {
    return {
      doc: null,
      errorResponse: {
        status: 403,
        body: {
          success: false,
          error: 'Forbidden',
          message: 'Access denied. You do not have permission to access this document analysis.'
        }
      }
    };
  }

  return { doc, errorResponse: null };
};

/**
 * POST /api/analysis/:id
 * Initiates AI analysis for a processed document or returns existing analysis idempotently.
 */
const initiateAnalysis = async (req, res, next) => {
  try {
    const { doc, errorResponse } = await verifyDocumentAccess(req.params.id, req.user);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    if (doc.status === 'extracting' || doc.status === 'uploaded') {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Document text extraction is still in progress. Please poll again shortly.'
      });
    }

    if (doc.status === 'failed') {
      return res.status(422).json({
        success: false,
        error: 'Unprocessable Entity',
        message: `Document text extraction failed: ${doc.errorMessage || 'Unknown error'}. Cannot run AI analysis.`
      });
    }

    // Check if pre-computed analysis already exists (idempotent)
    let analysis = await AnalysisResult.findOne({ documentId: doc._id });
    if (analysis) {
      return res.status(200).json({
        success: true,
        message: 'Analysis already generated.',
        data: analysis
      });
    }

    // Retrieve all document chunks
    const chunks = await DocumentChunk.find({ documentId: doc._id }).sort({ pageNumber: 1 });
    if (!chunks || chunks.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No extracted text found for this document.'
      });
    }

    const fullText = chunks.map((c) => `[Page ${c.pageNumber}]\n${c.textContent}`).join('\n\n');

    // Call internal AI service
    const aiResult = await aiServiceClient.analyzeDocument(doc._id.toString(), fullText);

    analysis = await AnalysisResult.create({
      documentId: doc._id,
      summary: aiResult.summary,
      faqs: aiResult.faqs,
      timeline: aiResult.timeline,
      flowchart: aiResult.flowchart,
      arguments: aiResult.arguments,
      actionItems: aiResult.actionItems,
      disclaimer: aiResult.disclaimer
    });

    await auditService.logEvent({
      userId: req.user.id,
      action: 'AI_ANALYZE_SUCCESS',
      level: 'info',
      details: { docId: doc._id }
    });

    return res.status(201).json({
      success: true,
      message: 'Analysis initiated and generated successfully.',
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/analysis/:id
 * Retrieves existing analysis. Returns 404 if not yet initiated.
 */
const getAnalysis = async (req, res, next) => {
  try {
    const { doc, errorResponse } = await verifyDocumentAccess(req.params.id, req.user);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    const analysis = await AnalysisResult.findOne({ documentId: doc._id });
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Analysis has not been generated for this document yet. Please initiate analysis via POST /api/analysis/:id.'
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const { doc, errorResponse } = await verifyDocumentAccess(req.params.id, req.user);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    const analysis = await AnalysisResult.findOne({ documentId: doc._id });
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Analysis has not been generated for this document yet.'
      });
    }
    return res.status(200).json({
      success: true,
      data: analysis.summary
    });
  } catch (err) {
    next(err);
  }
};

const getFaqs = async (req, res, next) => {
  try {
    const { doc, errorResponse } = await verifyDocumentAccess(req.params.id, req.user);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    const analysis = await AnalysisResult.findOne({ documentId: doc._id });
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Analysis has not been generated for this document yet.'
      });
    }
    return res.status(200).json({
      success: true,
      data: analysis.faqs
    });
  } catch (err) {
    next(err);
  }
};

const getFlowchart = async (req, res, next) => {
  try {
    const { doc, errorResponse } = await verifyDocumentAccess(req.params.id, req.user);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    const analysis = await AnalysisResult.findOne({ documentId: doc._id });
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Analysis has not been generated for this document yet.'
      });
    }
    return res.status(200).json({
      success: true,
      data: analysis.flowchart
    });
  } catch (err) {
    next(err);
  }
};

const getTimeline = async (req, res, next) => {
  try {
    const { doc, errorResponse } = await verifyDocumentAccess(req.params.id, req.user);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    const analysis = await AnalysisResult.findOne({ documentId: doc._id });
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Analysis has not been generated for this document yet.'
      });
    }
    return res.status(200).json({
      success: true,
      data: {
        timeline: analysis.timeline,
        actionItems: analysis.actionItems
      }
    });
  } catch (err) {
    next(err);
  }
};

const getArguments = async (req, res, next) => {
  try {
    const { doc, errorResponse } = await verifyDocumentAccess(req.params.id, req.user);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    const analysis = await AnalysisResult.findOne({ documentId: doc._id });
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Analysis has not been generated for this document yet.'
      });
    }
    return res.status(200).json({
      success: true,
      data: analysis.arguments
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  initiateAnalysis,
  getAnalysis,
  getSummary,
  getFaqs,
  getFlowchart,
  getTimeline,
  getArguments
};
