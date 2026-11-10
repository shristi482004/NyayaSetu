const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');
const User = require('../src/models/User');

setupTestDB();

describe('Authentication & RBAC Module', () => {
  const validUser = {
    name: 'Ramesh Sharma',
    email: 'ramesh.sharma@example.com',
    password: 'Password123!',
    role: 'citizen'
  };

  describe('POST /api/register', () => {
    it('should register a new citizen user successfully', async () => {
      const res = await request(app).post('/api/register').send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
      expect(res.body.data.user.passwordHash).toBeUndefined();

      // Verify user persisted in database with bcrypt hash
      const savedUser = await User.findOne({ email: validUser.email.toLowerCase() });
      expect(savedUser).toBeDefined();
      expect(savedUser.passwordHash).not.toBe(validUser.password);
    });

    it('should reject registration if email is already taken (409)', async () => {
      await request(app).post('/api/register').send(validUser);
      const res = await request(app).post('/api/register').send(validUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already registered');
    });

    it('should reject registration if password does not meet complexity (400)', async () => {
      const weakUser = {
        name: 'Weak Pass',
        email: 'weak@example.com',
        password: 'weak' // missing length, uppercase, number
      };
      const res = await request(app).post('/api/register').send(weakUser);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation Error');
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/register').send(validUser);
    });

    it('should successfully authenticate user with correct credentials', async () => {
      const res = await request(app).post('/api/login').send({
        email: validUser.email,
        password: validUser.password
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
    });

    it('should reject authentication with incorrect password (401)', async () => {
      const res = await request(app).post('/api/login').send({
        email: validUser.email,
        password: 'WrongPassword999!'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject authentication for non-existent email (401)', async () => {
      const res = await request(app).post('/api/login').send({
        email: 'unknown.person@example.com',
        password: 'Password123!'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('RBAC and Protected Routes', () => {
    let citizenToken;
    let lawyerToken;

    beforeEach(async () => {
      const citizenRes = await request(app).post('/api/register').send(validUser);
      citizenToken = citizenRes.body.data.token;

      const lawyerRes = await request(app).post('/api/register').send({
        name: 'Advocate Priya Sen',
        email: 'priya.sen@law.example.com',
        password: 'Password123!',
        role: 'lawyer'
      });
      lawyerToken = lawyerRes.body.data.token;
    });

    it('should allow authenticated user to fetch their own profile (/api/users/me)', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(validUser.email.toLowerCase());
    });

    it('should allow authenticated user to update their profile', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          name: 'Ramesh Sharma Updated',
          phone: '+919876543210'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Ramesh Sharma Updated');
    });

    it('should block unauthenticated requests to protected endpoints (401)', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject malformed JWT tokens (401)', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer this-is-not-a-valid-token-string');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid or expired');
    });

    it('should reject JWT tokens signed with an invalid secret (401)', async () => {
      const jwt = require('jsonwebtoken');
      const forgedToken = jwt.sign(
        { id: '654321fedcba0987654321fe', email: 'forged@example.com', role: 'citizen' },
        'wrong-secret-key-12345'
      );

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${forgedToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid or expired');
    });

    it('should reject expired JWT tokens (401)', async () => {
      const jwt = require('jsonwebtoken');
      const config = require('../src/config/env');
      const expiredToken = jwt.sign(
        { id: '654321fedcba0987654321fe', email: 'expired@example.com', role: 'citizen' },
        config.jwtSecret,
        { expiresIn: '-5s' }
      );

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid or expired');
    });

    it('should reject access if user account has been suspended (403)', async () => {
      const user = await User.findOne({ email: validUser.email.toLowerCase() });
      user.status = 'suspended';
      await user.save();

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('suspended');
    });

    it('should reject access if account no longer exists in database (401)', async () => {
      await User.deleteOne({ email: validUser.email.toLowerCase() });

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('no longer exists');
    });

    it('should block citizen role from accessing admin endpoints (403)', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${citizenToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });
  });
});
