const axios = require('axios');
const aiServiceClient = require('../src/services/aiServiceClient');
const config = require('../src/config/env');

jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn()
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn(),
    post: jest.fn()
  };
});

describe('AIServiceClient Cloud Run IAM Authentication', () => {
  const originalEnv = process.env;
  const originalAiUrl = config.aiServiceUrl;
  const originalNodeEnv = config.nodeEnv;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    aiServiceClient.cachedToken = null;
    aiServiceClient.tokenExpiry = null;
  });

  afterAll(() => {
    process.env = originalEnv;
    config.aiServiceUrl = originalAiUrl;
    config.nodeEnv = originalNodeEnv;
  });

  test('Local development: does not query metadata server and returns null', async () => {
    delete process.env.K_SERVICE;
    config.aiServiceUrl = 'http://localhost:8000';
    config.nodeEnv = 'development';

    const token = await aiServiceClient.getIdToken();
    expect(token).toBeNull();
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('Cloud Run production: queries metadata server with audience and caches token', async () => {
    process.env.K_SERVICE = 'nyayasetu-backend';
    config.aiServiceUrl = 'https://nyayasetu-ai-service-544071824007.asia-south1.run.app';
    config.nodeEnv = 'production';

    // Mock a standard JWT with exp in the future
    const expTime = Math.floor(Date.now() / 1000) + 3600;
    const payloadBase64 = Buffer.from(JSON.stringify({ exp: expTime, aud: config.aiServiceUrl })).toString('base64');
    const mockIdToken = `header.${payloadBase64}.signature`;

    axios.get.mockResolvedValueOnce({ data: mockIdToken });

    const token = await aiServiceClient.getIdToken();
    expect(token).toBe(mockIdToken);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('audience=' + encodeURIComponent('https://nyayasetu-ai-service-544071824007.asia-south1.run.app')),
      expect.objectContaining({ headers: { 'Metadata-Flavor': 'Google' } })
    );

    // Second call should return cached token without querying metadata server again
    const cached = await aiServiceClient.getIdToken();
    expect(cached).toBe(mockIdToken);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('Cloud Run production: throws error when metadata server fails (no silent unauthenticated fallback)', async () => {
    process.env.K_SERVICE = 'nyayasetu-backend';
    config.aiServiceUrl = 'https://nyayasetu-ai-service-544071824007.asia-south1.run.app';
    config.nodeEnv = 'production';

    axios.get.mockRejectedValueOnce(new Error('Connection to metadata server timed out'));

    await expect(aiServiceClient.getIdToken()).rejects.toThrow(
      /Cloud Run IAM authentication failure for AI Service/
    );
  });
});
