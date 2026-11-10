const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');
const User = require('../src/models/User');
const SystemLog = require('../src/models/SystemLog');
const aiServiceClient = require('../src/services/aiServiceClient');

setupTestDB();

describe('System Administration & Health Module', () => {
  let adminToken;
  let adminId;
  let regularUserId;

  beforeEach(async () => {
    // Create Admin user directly in DB
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@nyayasetu.gov.in',
      passwordHash: 'hashed_password_placeholder',
      role: 'admin',
      status: 'active'
    });
    adminToken = admin.generateJWT();
    adminId = admin._id.toString();

    // Create a regular citizen user
    const regularUser = await User.create({
      name: 'Target Citizen',
      email: 'target@example.com',
      passwordHash: 'hashed_password_placeholder',
      role: 'citizen',
      status: 'active'
    });
    regularUserId = regularUser._id.toString();

    // Seed sample audit log
    await SystemLog.create({
      action: 'SYSTEM_BOOT',
      level: 'info',
      details: { version: '1.0.0' }
    });
  });

  describe('GET /api/admin/users', () => {
    it('should allow admin to list all users with pagination', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
      expect(res.body.pagination.total).toBeGreaterThanOrEqual(2);
      expect(res.body.data[0].passwordHash).toBeUndefined();
    });

    it('should filter users by role', async () => {
      const res = await request(app)
        .get('/api/admin/users?role=citizen')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((u) => u.role === 'citizen')).toBe(true);
    });
  });

  describe('PATCH /api/admin/users/:id/status', () => {
    it('should allow admin to suspend a user account', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${regularUserId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'suspended' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('suspended');

      // Verify in DB
      const updatedUser = await User.findById(regularUserId);
      expect(updatedUser.status).toBe('suspended');
    });

    it('should prevent admin from suspending their own active account (400)', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${adminId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'suspended' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('cannot suspend their own');
    });
  });

  describe('GET /api/admin/logs', () => {
    it('should allow admin to inspect system audit logs', async () => {
      const res = await request(app)
        .get('/api/admin/logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].action).toBeDefined();
    });
  });

  describe('GET /api/health', () => {
    it('should return operational health status of backend and components', async () => {
      jest.spyOn(aiServiceClient, 'getHealth').mockResolvedValue({ status: 'healthy' });

      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe('nyayasetu-backend');
      expect(res.body.components.database.status).toBe('connected');
    });

    it('should return user dashboard data for authenticated user', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stats).toBeDefined();
    });
  });
});
