const express = require('express');
const {
  getUsers,
  getUserById,
  createNewUser,
  editUser,
  deleteUser,
} = require('../../controllers/userControllers');
const authenticate = require('../../middleware/validateToken');
const { adminAuthorization } = require('../../middleware/authorization');
const { validate } = require('express-validation');
const {
  idValidation,
  createUserValidation,
  pageSizeValidation,
} = require('../../validator/validations');
const { can } = require('../../middleware/permissionHandler');

const router = express.Router();

router.get(
  '/',
  authenticate,
  adminAuthorization,
  can('user', 'view'),
  validate(pageSizeValidation, {}, {}),
  getUsers
);

router.get(
  '/:id',
  authenticate,
  adminAuthorization,
  can('user', 'view'),
  validate(idValidation, {}, {}),
  getUserById
);

router.post(
  '/',
  authenticate,
  adminAuthorization,
  can('user', 'create'),
  validate(createUserValidation, {}, {}),
  createNewUser
);

router.put(
  '/:id',
  authenticate,
  adminAuthorization,
  can('user', 'update'),
  validate(idValidation, {}, {}),
  validate(createUserValidation, {}, {}),
  editUser
);

router.delete(
  '/:id',
  authenticate,
  can('user', 'delete'),
  validate(idValidation, {}, {}),
  deleteUser
);

module.exports = router;
