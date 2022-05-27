const express = require('express');
const { validate } = require('express-validation');

const {
  loginHandler,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authControllers');
const authenticate = require('../middleware/validateToken');
const {
  loginValidation,
  changePasswordValidation,
} = require('../validator/validations');

const router = express.Router();

router.post('/login', validate(loginValidation, {}, {}), loginHandler);

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordValidation, {}, {}),
  changePassword
);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

module.exports = router;
