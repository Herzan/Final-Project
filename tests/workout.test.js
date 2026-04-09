const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Workout Routes - GET Endpoints', () => {
  let token;

  beforeAll(async () => {
    // Login to get token (or create test user)
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'TestPass123!' });
    token = loginRes.body.token;
  });

  it('should get all workouts (GET /api/workouts)', async () => {
    const res = await request(app).get('/api/workouts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get workout by ID (GET /api/workouts/:id)', async () => {
    // First create one or use existing ID
    const res = await request(app).get('/api/workouts/some-valid-id');
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should get workouts by user (GET /api/workouts/user/:userId)', async () => {
    const res = await request(app).get('/api/workouts/user/valid-user-id');
    expect(res.statusCode).toBe(200);
  });

  it('should get workouts by date (GET /api/workouts/date/:date)', async () => {
    const res = await request(app).get('/api/workouts/date/2026-04-08');
    expect(res.statusCode).toBe(200);
  });
});