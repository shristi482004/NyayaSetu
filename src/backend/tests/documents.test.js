const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');
const Document = require('../src/models/Document');

setupTestDB();

describe('Document Management & Tenant Isolation Module', () => {
  let userAToken;
  let userBToken;
  let userAId;

  // Minimal valid PDF binary buffer with %PDF- header
  const validPdfBuffer = Buffer.from(
    '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources <<>> /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n210\n%%EOF'
  );

  beforeEach(async () => {
    // Register User A
    const resA = await request(app).post('/api/register').send({
      name: 'User A',
      email: 'user.a@example.com',
      password: 'Password123!',
      role: 'citizen'
    });
    userAToken = resA.body.data.token;
    userAId = resA.body.data.user.id;

    // Register User B
    const resB = await request(app).post('/api/register').send({
      name: 'User B',
      email: 'user.b@example.com',
      password: 'Password123!',
      role: 'citizen'
    });
    userBToken = resB.body.data.token;
  });

  describe('POST /api/documents (Upload)', () => {
    it('should successfully upload a valid PDF document', async () => {
      const res = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${userAToken}`)
        .attach('file', validPdfBuffer, 'court_notice.pdf');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.docId).toBeDefined();
      expect(res.body.data.originalName).toBe('court_notice.pdf');

      // Verify in DB
      const doc = await Document.findById(res.body.data.docId);
      expect(doc).toBeDefined();
      expect(doc.userId.toString()).toBe(userAId);
    });

    it('should reject file with fake PDF extension but non-PDF content (400)', async () => {
      const fakeBuffer = Buffer.from('THIS IS NOT A VALID PDF FILE HEADER');
      const res = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${userAToken}`)
        .attach('file', fakeBuffer, 'fake.pdf');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('missing %PDF- header');
    });

    it('should reject non-PDF file MIME types (400)', async () => {
      const textBuffer = Buffer.from('hello world plain text');
      const res = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${userAToken}`)
        .attach('file', textBuffer, 'notes.txt');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Only PDF documents');
    });
  });

  describe('Document Ownership & Cross-Tenant Isolation', () => {
    let docAId;

    beforeEach(async () => {
      const uploadRes = await request(app)
        .post('/api/documents')
        .set('Authorization', `Bearer ${userAToken}`)
        .attach('file', validPdfBuffer, 'private_contract.pdf');

      docAId = uploadRes.body.data.docId;
    });

    it('should allow Owner (User A) to retrieve their own document', async () => {
      const res = await request(app)
        .get(`/api/documents/${docAId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.document._id).toBe(docAId);
    });

    it('should BLOCK User B from viewing User A document (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/documents/${docAId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });

    it('should BLOCK User B from deleting User A document (403 Forbidden)', async () => {
      const res = await request(app)
        .delete(`/api/documents/${docAId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);

      // Verify document still exists
      const doc = await Document.findById(docAId);
      expect(doc).toBeDefined();
    });

    it('should allow Owner (User A) to delete their own document (200)', async () => {
      const res = await request(app)
        .delete(`/api/documents/${docAId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify document deleted from database
      const doc = await Document.findById(docAId);
      expect(doc).toBeNull();
    });
  });
});

