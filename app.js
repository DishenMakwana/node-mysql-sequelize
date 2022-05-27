const express = require('express');
const cors = require('cors');
const app = express();
const { statusCodes } = require('./utils/statusCodes');
const { handleError } = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');

const Router = require('./routes/');

require('dotenv').config();

app.use(express.json());
app.use(cors());

app.get('/', async (_req, res) => {
  res.send('hello world');
});

app.use(Router);

app.get('/favicon.ico', (_req, res) => res.status(204).end());

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(statusCodes.NOT_FOUND, 'Not found'));
});

app.use(handleError);

module.exports = app;
