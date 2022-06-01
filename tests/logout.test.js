require('dotenv').config({
  path: '.env.test',
});
const request = require('supertest');
const app = require('../app');
const { statusCodes } = require('../utils/statusCodes');
const { messages } = require('../utils/messages');

let token;
const old_token = process.env.OLD_TOKEN;
const fake_token = process.env.FAKE_TOKEN;
const admin_email = process.env.ADMIN_EMAILADDR;
const admin_password = process.env.ADMIN_PASSWORD;

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('Logout API TESTING', () => {
  it('Post /api/v1/login SUCCESS', async () => {
    const res = await request(app).post('/api/v1/login').send({
      email: admin_email,
      password: admin_password,
    });

    token = res.body.meta.token;

    expect(res.status).toBe(statusCodes.OK.code);
    expect(res.body.message).toBe(messages.LOGIN_SUCCESSFUL);
  });

  it('Post /api/v1/logout SUCCESS', async () => {
    const res = await await request(app)
      .post('/api/v1/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.meta.code).toBe(statusCodes.OK.code);
    expect(res.body.message).toBe(messages.LOGOUT_SUCCESSFULLY);
  });

  it('Post /api/v1/logout FAILURE', async () => {
    const res = await await request(app)
      .post('/api/v1/logout')
      .set('Authorization', `Bearer ${old_token}`);

    expect(res.body.meta.code).toBe(statusCodes.UNAUTHORIZED.code);
    expect(res.body.message).toBe(messages.UNAUTHORIZED);
  });

  it('Post /api/v1/logout FAKE TOKEN', async () => {
    const res = await await request(app)
      .post('/api/v1/logout')
      .set('Authorization', `Bearer ${fake_token}`);

    expect(res.body.meta.code).toBe(statusCodes.UNAUTHORIZED.code);
    expect(res.body.message).toBe(messages.UNAUTHORIZED);
  });

  it('Post /api/v1/logout EMPTY TOKEN', async () => {
    const res = await await request(app)
      .post('/api/v1/logout')
      .set('Authorization', `Bearer `);

    expect(res.body.meta.code).toBe(statusCodes.UNAUTHORIZED.code);
    expect(res.body.message).toBe(messages.UNAUTHORIZED);
  });

  it('Post /api/v1/logout EMPTY HEADER', async () => {
    const res = await await request(app)
      .post('/api/v1/logout')
      .set('Authorization', '');

    expect(res.body.meta.code).toBe(statusCodes.UNAUTHORIZED.code);
    expect(res.body.message).toBe(messages.UNAUTHORIZED);
  });
});
