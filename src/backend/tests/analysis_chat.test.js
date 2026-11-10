const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');
const Document = require('../src/models/Document');
const DocumentChunk = require('../src/models/DocumentChunk');
const aiServiceClient = require('../src/services/aiServiceClient');

setupTestDB();

describe('AI Legal Analysis and Grounded Chat Module', () => {
  let citizenToken;
  let lawyerToken;
  let otherCitizenToken;
  let docId;
  let lawyerDocId;

  const mockAnalysis = {
    summary: {
      disputeType: 'Tenancy Dispute',
      keyParties: ['Landlord Sharma', 'Tenant Verma'],
      factualBackground: ['Lease executed on 2025-05-01.', 'Unpaid rent for 3 months.'],
      legalIssues: ['Eviction under Section 14', 'Arrears recovery'],
      rulingsOrObligations: ['Vacate premises within 30 days.'],
      plainLanguageSummary: 'The landlord is demanding eviction and payment of overdue rent within 30 days.'
    },
    faqs: [
      {
        question: 'What is the eviction notice period?',
        answer: '30 days from receipt of this notice.',
        relevantClauseOrPage: 'Page 2, Clause 8'
      }
    ],
    timeline: [
      { date: '2025-05-01', event: 'Lease signed', sourcePage: 1 },
      { date: '2026-03-01', event: 'First default of rent', sourcePage: 2 }
    ],
    flowchart: [
      {
        stepNumber: 1,
        stageName: 'Notice Served',
        description: 'Notice delivered to tenant.',
        actionRequired: 'Pay arrears or respond',
        deadlineOrTimeframe: 'Day 0'
      },
      {
        stepNumber: 2,
        stageName: 'Eviction Petition',
        description: 'Filing before Rent Controller.',
        actionRequired: 'Appear for hearing',
        deadlineOrTimeframe: 'After 30 days'
      }
    ],
    arguments: [
      {
        claim: 'Tenant defaulted without justification.',
        evidenceOrBasis: 'Bank account statements showing zero credits.',
        counterArgument: 'Tenant may allege unaddressed premises repairs.'
      }
    ],
    actionItems: [
      {
        priority: 'High',
        action: 'Pay overdue rent or submit written reply',
        responsibleParty: 'Tenant Verma',
        deadline: 'Within 30 days'
      }
    ],
    disclaimer: 'NyayaSetu provides informational assistance only and does not constitute formal legal counsel.'
  };

  const mockChatReply = {
    answer: 'The tenant has 30 days to respond to the eviction notice.',
    cited_pages: [1, 2],
    confidence: 'High',
    is_unknown: false,
    disclaimer: 'NyayaSetu provides informational assistance only and does not constitute formal legal counsel.'
  };

  beforeEach(async () => {
    // Mock AI service calls to ensure deterministic, isolated tests
    jest.spyOn(aiServiceClient, 'analyzeDocument').mockResolvedValue(mockAnalysis);
    jest.spyOn(aiServiceClient, 'chatWithDocument').mockResolvedValue(mockChatReply);

    // Register Citizen 1 (Owner)
    const citizenRes = await request(app).post('/api/register').send({
      name: 'Anil Verma',
      email: 'anil.verma@example.com',
      password: 'Password123!',
      role: 'citizen'
    });
    citizenToken = citizenRes.body.data.token;
    const citizenId = citizenRes.body.data.user.id;

    // Register Citizen 2 (Attacker / Different Tenant)
    const otherCitizenRes = await request(app).post('/api/register').send({
      name: 'Sneha Patel',
      email: 'sneha.patel@example.com',
      password: 'Password123!',
      role: 'citizen'
    });
    otherCitizenToken = otherCitizenRes.body.data.token;

    // Register Lawyer
    const lawyerRes = await request(app).post('/api/register').send({
      name: 'Advocate Kapoor',
      email: 'kapoor.law@example.com',
      password: 'Password123!',
      role: 'lawyer'
    });
    lawyerToken = lawyerRes.body.data.token;
    const lawyerId = lawyerRes.body.data.user.id;

    // Create a ready document owned by Citizen 1
    const doc = await Document.create({
      userId: citizenId,
      fileName: 'tenancy_notice.pdf',
      originalName: 'tenancy_notice.pdf',
      fileSize: 10240,
      mimeType: 'application/pdf',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      storagePath: '/tmp/tenancy_notice.pdf',
      status: 'ready',
      pageCount: 2
    });
    docId = doc._id.toString();

    // Insert chunks for Citizen 1 document
    await DocumentChunk.create([
      {
        documentId: doc._id,
        pageNumber: 1,
        chunkIndex: 0,
        textContent: 'Tenancy Notice: Unpaid rent default.',
        charCount: 36
      },
      {
        documentId: doc._id,
        pageNumber: 2,
        chunkIndex: 1,
        textContent: 'Vacate premises within 30 days.',
        charCount: 31
      }
    ]);

    // Create a ready document owned by Lawyer
    const lawyerDoc = await Document.create({
      userId: lawyerId,
      fileName: 'lawyer_brief.pdf',
      originalName: 'lawyer_brief.pdf',
      fileSize: 20480,
      mimeType: 'application/pdf',
      checksum: 'd41d8cd98f00b204e9800998ecf8427e',
      storagePath: '/tmp/lawyer_brief.pdf',
      status: 'ready',
      pageCount: 1
    });
    lawyerDocId = lawyerDoc._id.toString();

    await DocumentChunk.create([
      {
        documentId: lawyerDoc._id,
        pageNumber: 1,
        chunkIndex: 0,
        textContent: 'Brief of arguments and citations.',
        charCount: 33
      }
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Separated Analysis Initiation (POST) and Retrieval (GET)', () => {
    it('should return 404 when GET /api/analysis/:id is queried BEFORE initiation', async () => {
      const res = await request(app)
        .get(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not been generated');
    });

    it('should successfully initiate and generate analysis via POST /api/analysis/:id (201 Created)', async () => {
      const res = await request(app)
        .post(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary.disputeType).toBe('Tenancy Dispute');
      expect(res.body.data.flowchart.length).toBe(2);
      expect(res.body.data.faqs.length).toBe(1);
      expect(res.body.data.timeline.length).toBe(2);
      expect(res.body.data.disclaimer).toContain('informational assistance only');
    });

    it('should return 200 with existing analysis on repeated POST without re-invoking AI service (idempotency)', async () => {
      // First initiation
      await request(app)
        .post(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`);

      // Second initiation attempt
      const res2 = await request(app)
        .post(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res2.status).toBe(200);
      expect(res2.body.success).toBe(true);
      expect(aiServiceClient.analyzeDocument).toHaveBeenCalledTimes(1);
    });

    it('should return 200 with analysis on GET /api/analysis/:id AFTER initiation', async () => {
      // Initiate
      await request(app)
        .post(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`);

      // Retrieve
      const res = await request(app)
        .get(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary.disputeType).toBe('Tenancy Dispute');
    });

    it('should reject initiation if document extraction is still in progress (409 Conflict)', async () => {
      const pendingDoc = await Document.create({
        userId: (await Document.findById(docId)).userId,
        fileName: 'pending.pdf',
        originalName: 'pending.pdf',
        fileSize: 1000,
        mimeType: 'application/pdf',
        checksum: '1234',
        storagePath: '/tmp/pending.pdf',
        status: 'extracting'
      });

      const res = await request(app)
        .post(`/api/analysis/${pendingDoc._id}`)
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('in progress');
    });

    it('should reject initiation if document extraction failed (422 Unprocessable)', async () => {
      const failedDoc = await Document.create({
        userId: (await Document.findById(docId)).userId,
        fileName: 'failed.pdf',
        originalName: 'failed.pdf',
        fileSize: 1000,
        mimeType: 'application/pdf',
        checksum: '5678',
        storagePath: '/tmp/failed.pdf',
        status: 'failed',
        errorMessage: 'Corrupt PDF header'
      });

      const res = await request(app)
        .post(`/api/analysis/${failedDoc._id}`)
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('extraction failed');
    });
  });

  describe('Cross-User Access Isolation and RBAC Hardening', () => {
    beforeEach(async () => {
      // Initiate analysis on citizen 1 document
      await request(app)
        .post(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`);
    });

    it('should BLOCK another user from initiating analysis on foreign document (403)', async () => {
      const res = await request(app)
        .post(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${otherCitizenToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });

    it('should BLOCK another user from retrieving foreign analysis (403)', async () => {
      const res = await request(app)
        .get(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${otherCitizenToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });

    it('should BLOCK another user from retrieving foreign sub-resources (summary, faqs, timeline, flowchart) (403)', async () => {
      const endpoints = ['summary', 'faqs', 'flowchart', 'timeline'];
      for (const ep of endpoints) {
        const res = await request(app)
          .get(`/api/analysis/${docId}/${ep}`)
          .set('Authorization', `Bearer ${otherCitizenToken}`);

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Access denied');
      }
    });

    it('should BLOCK another user from chatting with a foreign document (403)', async () => {
      const res = await request(app)
        .post(`/api/chat/${docId}`)
        .set('Authorization', `Bearer ${otherCitizenToken}`)
        .send({ question: 'What is in this document?' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });

    it('should BLOCK another user from fetching foreign chat history (403)', async () => {
      const res = await request(app)
        .get(`/api/chat/${docId}/history`)
        .set('Authorization', `Bearer ${otherCitizenToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });

    it('should allow lawyer role to access argument maps on their own document (200)', async () => {
      // Initiate on lawyer document
      await request(app)
        .post(`/api/analysis/${lawyerDocId}`)
        .set('Authorization', `Bearer ${lawyerToken}`);

      const res = await request(app)
        .get(`/api/analysis/${lawyerDocId}/arguments`)
        .set('Authorization', `Bearer ${lawyerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].claim).toBe('Tenant defaulted without justification.');
    });

    it('should BLOCK citizen role from accessing lawyer-only argument maps on their own document (403)', async () => {
      const res = await request(app)
        .get(`/api/analysis/${docId}/arguments`)
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });
  });

  describe('Sub-Resource Retrieval for Document Owner', () => {
    beforeEach(async () => {
      await request(app)
        .post(`/api/analysis/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`);
    });

    it('should retrieve sub-resources: summary, faqs, flowchart, and timeline for owner', async () => {
      const summaryRes = await request(app)
        .get(`/api/analysis/${docId}/summary`)
        .set('Authorization', `Bearer ${citizenToken}`);
      expect(summaryRes.status).toBe(200);
      expect(summaryRes.body.data.disputeType).toBe('Tenancy Dispute');

      const faqsRes = await request(app)
        .get(`/api/analysis/${docId}/faqs`)
        .set('Authorization', `Bearer ${citizenToken}`);
      expect(faqsRes.status).toBe(200);
      expect(faqsRes.body.data.length).toBe(1);

      const flowRes = await request(app)
        .get(`/api/analysis/${docId}/flowchart`)
        .set('Authorization', `Bearer ${citizenToken}`);
      expect(flowRes.status).toBe(200);
      expect(flowRes.body.data.length).toBe(2);

      const timeRes = await request(app)
        .get(`/api/analysis/${docId}/timeline`)
        .set('Authorization', `Bearer ${citizenToken}`);
      expect(timeRes.status).toBe(200);
      expect(timeRes.body.data.timeline.length).toBe(2);
    });
  });

  describe('Document Grounded Q&A Chat Module', () => {
    it('should answer questions grounded in document text with page citations', async () => {
      const res = await request(app)
        .post(`/api/chat/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ question: 'How many days does the tenant have to respond?' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.answer).toContain('30 days');
      expect(res.body.data.citedPages).toEqual([1, 2]);
      expect(res.body.data.disclaimer).toContain('informational assistance');
    });

    it('should retrieve conversation history for document chat session', async () => {
      // Ask first question
      await request(app)
        .post(`/api/chat/${docId}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ question: 'What is the notice about?' });

      // Retrieve history
      const historyRes = await request(app)
        .get(`/api/chat/${docId}/history`)
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(historyRes.status).toBe(200);
      expect(historyRes.body.success).toBe(true);
      expect(historyRes.body.data.length).toBe(2); // 1 user + 1 assistant message
    });
  });
});
