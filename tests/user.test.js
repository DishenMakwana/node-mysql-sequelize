require('dotenv').config({
  path: '.env.test',
});
const request = require('supertest');
const _ = require('lodash');
const chance = require('chance').Chance();
const app = require('../app');
const { statusCodes } = require('../utils/statusCodes');
const { messages } = require('../utils/messages');

let token;
const admin_email = process.env.ADMIN_EMAILADDR;
const admin_password = process.env.ADMIN_PASSWORD;

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('USERS API', () => {
  it('Post /api/v1/login SUCCESS', async () => {
    const res = await request(app).post('/api/v1/login').send({
      email: admin_email,
      password: admin_password,
    });

    token = res.body.meta.token;

    expect(res.status).toBe(statusCodes.OK.code);
    expect(res.body.message).toBe(messages.LOGIN_SUCCESSFUL);
  });

  it('GET /admin/user SUCCESS', async () => {
    const res = await request(app)
      .get('/admin/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(statusCodes.OK.code);
    expect(res.body.message).toBe(messages.USERS_LIST);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toEqual(
      res.body.meta.length > 10 ? res.body.meta.size : res.body.meta.length
    );
  });

  it('GET /admin/user/:id SUCCESS', async () => {
    const res = await request(app)
      .get('/admin/user/2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(statusCodes.OK.code);
    expect(res.body.message).toBe(messages.USER_FOUND);
    expect(_.isObject(res.body.data)).toBeTruthy();
  });

  it('GET /admin/user/:id FAILURE', async () => {
    const res = await request(app)
      .get('/admin/user/100')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(statusCodes.NOT_FOUND.code);
    expect(res.body.message).toBe(messages.USER_NOT_FOUND);
  });

  it('POST /admin/user SUCCESS', async () => {
    const res = await request(app)
      .post('/admin/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: chance.name(),
        email: chance.email({ domain: 'gmail.com' }),
        mobile: '9171234567',
      });

    expect(res.status).toBe(statusCodes.CREATED.code);
    expect(res.body.message).toBe(messages.REGISTRATION_SUCCESSFUL);
  });

  it('POST /admin/user FAILURE', async () => {
    const res = await request(app)
      .post('/admin/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: chance.name(),
        email: chance.email({ domain: 'gmail.com' }),
      });

    expect(res.status).toBe(statusCodes.BAD_REQUEST.code);
    expect(res.body.message).toBe(messages.VALIDATION_FAILED);
  });

  it('PUT /admin/user/:id SUCCESS', async () => {
    const res = await request(app)
      .put('/admin/user/5')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: chance.name(),
        email: chance.email({ domain: 'gmail.com' }),
        mobile: '9171234567',
      });

    expect(res.status).toBe(statusCodes.CREATED.code);
    expect(res.body.message).toBe(messages.USER_EDITED);
  });

  it('PUT /admin/user/:id FAILURE', async () => {
    const res = await request(app)
      .put('/admin/user/100')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: chance.name(),
        email: chance.email({ domain: 'gmail.com' }),
        mobile: '9171234567',
      });

    expect(res.status).toBe(statusCodes.NOT_FOUND.code);
    expect(res.body.message).toBe(messages.ACCOUNT_DOESNOT_EXISTS);
  });

  it('DELETE /admin/user/:id SUCCESS', async () => {
    const res = await request(app)
      .delete('/admin/user/6')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(statusCodes.OK.code);
    expect(res.body.message).toBe(messages.USER_DELETED);
  });

  it('DELETE /admin/user/:id FAILURE', async () => {
    const res = await request(app)
      .delete('/admin/user/100')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(statusCodes.NOT_FOUND.code);
    expect(res.body.message).toBe(messages.ACCOUNT_DOESNOT_EXISTS);
  });
});
