const request = require('supertest');
const app = require('../server'); // export app from server.js if needed

describe('Workout Routes', () => {
  it('should get all workouts', async () => {
    const res = await request(app).get('/api/workouts');
    expect(res.statusCode).toBe(200);
  });
});