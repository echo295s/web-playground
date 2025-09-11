process.env.JWT_SECRET = 'testsecret';
process.env.DB_PATH = ':memory:';

const request = require('supertest');
const app = require('../index');
const db = require('../db');

afterAll(() => {
  db.close();
});

describe('Auth and Messages API', () => {
  test('registers, logs in, posts and fetches messages', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ username: 'alice', password: 'Password1' });
    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'alice', password: 'Password1' });
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const messageRes = await request(app)
      .post('/api/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'hello' });
    expect(messageRes.status).toBe(200);
    expect(messageRes.body).toHaveProperty('success', true);

    const listRes = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.messages)).toBe(true);
    expect(listRes.body.messages.length).toBe(1);
    expect(listRes.body.messages[0].content).toBe('hello');
  });
});
