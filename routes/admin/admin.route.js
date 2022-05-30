const express = require('express');
const authenticate = require('../../middleware/validateToken');
const { adminAuthorization } = require('../../middleware/authorization');
const { validate } = require('express-validation');
const {
  idValidation,
  createAdminValidation,
  pageSizeValidation,
} = require('../../validator/validations');
const { can } = require('../../middleware/permissionHandler');
const {
  createAdmin,
  editAdmin,
  getAdmins,
  getAdminDetailById,
} = require('../../controllers/adminControllers');

const router = express.Router();

router.get(
  '/',
  authenticate,
  adminAuthorization,
  can('user', 'view'),
  validate(pageSizeValidation, {}, {}),
  getAdmins
);

router.get(
  '/:id',
  authenticate,
  adminAuthorization,
  can('user', 'view'),
  validate(idValidation, {}, {}),
  getAdminDetailById
);

router.post(
  '/',
  authenticate,
  adminAuthorization,
  can('user', 'create'),
  validate(createAdminValidation, {}, {}),
  createAdmin
);

router.put(
  '/:id',
  authenticate,
  adminAuthorization,
  can('user', 'update'),
  validate(idValidation, {}, {}),
  validate(createAdminValidation, {}, {}),
  editAdmin
);

module.exports = router;
