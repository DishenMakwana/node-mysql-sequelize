require('dotenv').config({
  path: '.env.test',
});
const request = require('supertest');
const app = require('../app');
const { statusCodes } = require('../utils/statusCodes');
const { messages } = require('../utils/messages');

const admin_email = process.env.ADMIN_EMAILADDR;
const admin_password = process.env.ADMIN_PASSWORD;
const admin_wrong_email = process.env.ADMIN_WRONG_EMAIL;
const admin_wrong_password = process.env.ADMIN_WRONG_PASSWORD;

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('Login API TESTING', () => {
  it('Post /api/v1/login SUCCESS', async () => {
    const res = await request(app).post('/api/v1/login').send({
      email: admin_email,
      password: admin_password,
    });

    expect(res.status).toBe(statusCodes.OK.code);
    expect(res.body.message).toBe(messages.LOGIN_SUCCESSFUL);
    expect(res.body.meta.token).toBeDefined();
    expect(res.body.data.userDetails).toBeDefined();
  });

  it('Post /api/v1/login WRONG PASSWORD', async () => {
    const res = await request(app).post('/api/v1/login').send({
      email: admin_email,
      password: admin_wrong_password,
    });

    expect(res.status).toBe(statusCodes.BAD_REQUEST.code);
    expect(res.body.message).toBe(messages.WRONG_CREDENTIALS);
  });

  it('Post /api/v1/login WRONG EMAIL', async () => {
    const res = await request(app).post('/api/v1/login').send({
      email: admin_wrong_email,
      password: admin_password,
    });

    expect(res.status).toBe(statusCodes.BAD_REQUEST.code);
    expect(res.body.message).toBe(messages.WRONG_CREDENTIALS);
  });

  it('Post /api/v1/login EMPTY PASSWORD', async () => {
    const res = await request(app).post('/api/v1/login').send({
      email: admin_email,
    });

    expect(res.status).toBe(statusCodes.BAD_REQUEST.code);
    expect(res.body.meta.code).toBe(statusCodes.BAD_REQUEST.code);
    expect(res.body.message).toBe(messages.ENTER_NECESSARY_FIELDS);
  });

  it('Post /api/v1/login EMPTY EMAIL', async () => {
    const res = await request(app).post('/api/v1/login').send({
      password: admin_password,
    });

    expect(res.status).toBe(statusCodes.BAD_REQUEST.code);
    expect(res.body.meta.code).toBe(statusCodes.BAD_REQUEST.code);
    expect(res.body.message).toBe(messages.ENTER_NECESSARY_FIELDS);
  });

  it('Post /api/v1/login EMPTY EMAIL & PASSWORD', async () => {
    const res = await request(app).post('/api/v1/login').send({});

    expect(res.status).toBe(statusCodes.BAD_REQUEST.code);
    expect(res.body.meta.code).toBe(statusCodes.BAD_REQUEST.code);
    expect(res.body.message).toBe(messages.ENTER_NECESSARY_FIELDS);
  });

  it('Post /api/v1/login REQ WITH EXTRA DETAILS', async () => {
    const res = await request(app).post('/api/v1/login').send({
      email: admin_email,
      password: admin_password,
      name: 'John Doe',
    });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(messages.VALIDATION_FAILED);
    expect(res.body.error.statusCode).toBe(statusCodes.BAD_REQUEST.code);
  });
});
