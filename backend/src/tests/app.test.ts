import request from 'supertest';
import app from '../app';

describe('GET /', () => {
  it('responds with API info', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Backend Imparable');
  });
});

describe('GET /health', () => {
  it('responds with health check', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('ok');
  });
});
