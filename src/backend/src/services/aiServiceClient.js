const axios = require('axios');
const config = require('../config/env');
const logger = require('../config/logger');

class AIServiceClient {
  constructor() {
    this.client = axios.create({
      baseURL: config.aiServiceUrl,
      timeout: 45000, // 45 seconds for heavy inference / OCR
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': config.aiInternalApiKey
      }
    });
  }

  /**
   * Dispatches text and page extraction request to internal AI service.
   */
  async extractDocument(filePath, documentId, forceOcr = false) {
    try {
      const response = await this.client.post('/extract', {
        file_path: filePath,
        document_id: documentId,
        force_ocr: forceOcr
      });
      return response.data;
    } catch (err) {
      this._handleAxiosError(err, 'Document Extraction');
    }
  }

  /**
   * Invokes Gemini via Python AI service for structured legal analysis.
   */
  async analyzeDocument(documentId, documentText, pagesData = null) {
    try {
      const response = await this.client.post('/analyze', {
        document_id: documentId,
        document_text: documentText,
        pages_data: pagesData
      });
      return response.data;
    } catch (err) {
      this._handleAxiosError(err, 'AI Analysis');
    }
  }

  /**
   * Invokes document-grounded chat query.
   */
  async chatWithDocument(documentId, question, contextChunks, history = []) {
    try {
      const response = await this.client.post('/chat', {
        document_id: documentId,
        question,
        context_chunks: contextChunks,
        history
      });
      return response.data;
    } catch (err) {
      this._handleAxiosError(err, 'Document Chat');
    }
  }

  /**
   * Checks health of AI microservice.
   */
  async getHealth() {
    try {
      const response = await this.client.get('/health', { timeout: 3000 });
      return response.data;
    } catch (err) {
      return { status: 'unavailable', error: err.message };
    }
  }

  _handleAxiosError(err, operation) {
    if (err.response) {
      const status = err.response.status;
      const detail = err.response.data?.detail || err.response.data?.message || err.message;
      logger.error(`${operation} failed with status ${status}: ${detail}`);
      const customErr = new Error(`${operation} failed: ${detail}`);
      customErr.statusCode = status;
      customErr.isOperational = true;
      throw customErr;
    } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      logger.error(`AI Service unreachable at ${config.aiServiceUrl} during ${operation}`);
      const customErr = new Error('The AI processing microservice is currently unreachable. Please try again later.');
      customErr.statusCode = 503;
      customErr.isOperational = true;
      throw customErr;
    } else {
      logger.error(`${operation} unexpected failure: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new AIServiceClient();

