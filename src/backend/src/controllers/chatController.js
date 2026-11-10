const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const aiServiceClient = require('../services/aiServiceClient');
const auditService = require('../services/auditService');

const askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    const documentId = req.params.id;

    const doc = await Document.findById(documentId);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Document not found.'
      });
    }

    // Ownership check
    if (doc.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access denied. You do not have permission to query this document.'
      });
    }

    // Retrieve document passages
    const chunks = await DocumentChunk.find({ documentId: doc._id }).sort({ pageNumber: 1 });
    if (!chunks || chunks.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Document has no extracted text passages available for question answering.'
      });
    }

    // Find or create chat session
    let session = await ChatSession.findOne({ documentId: doc._id, userId: req.user.id });
    if (!session) {
      session = await ChatSession.create({
        documentId: doc._id,
        userId: req.user.id,
        title: `Inquiry on ${doc.originalName}`
      });
    }

    // Retrieve last 6 messages for context
    const recentMessages = await ChatMessage.find({ sessionId: session._id })
      .sort({ createdAt: -1 })
      .limit(6);
    recentMessages.reverse();

    const historyTurns = recentMessages.map((m) => ({
      role: m.senderRole,
      content: m.content
    }));

    const contextChunks = chunks.map((c) => ({
      page_number: c.pageNumber,
      text_content: c.textContent
    }));

    // Call AI service
    const chatResult = await aiServiceClient.chatWithDocument(
      doc._id.toString(),
      question,
      contextChunks,
      historyTurns
    );

    // Save user message
    await ChatMessage.create({
      sessionId: session._id,
      senderRole: 'user',
      content: question
    });

    // Save assistant message
    const assistantMessage = await ChatMessage.create({
      sessionId: session._id,
      senderRole: 'assistant',
      content: chatResult.answer,
      citedPages: chatResult.cited_pages || [],
      confidence: chatResult.confidence || 'High',
      isUnknown: chatResult.is_unknown || false
    });

    session.lastActiveAt = new Date();
    await session.save();

    await auditService.logEvent({
      userId: req.user.id,
      action: 'CHAT_QUERY',
      level: 'info',
      details: { docId: doc._id, sessionId: session._id }
    });

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session._id.toString(),
        answer: chatResult.answer,
        citedPages: chatResult.cited_pages || [],
        confidence: chatResult.confidence || 'High',
        isUnknown: chatResult.is_unknown || false,
        disclaimer: chatResult.disclaimer
      }
    });
  } catch (err) {
    next(err);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const doc = await Document.findById(documentId);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Document not found.'
      });
    }

    // Ownership check
    if (doc.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Access denied.'
      });
    }

    const session = await ChatSession.findOne({ documentId: doc._id, userId: req.user.id });
    if (!session) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      sessionId: session._id.toString(),
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  askQuestion,
  getChatHistory
};

