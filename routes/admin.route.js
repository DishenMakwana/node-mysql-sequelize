const express = require('express');
const validateUserRoutes = require('./admin/validate.route');
const userRoutes = require('./admin/user.route');

const router = express.Router();

router.use('/', validateUserRoutes);

router.use('/user', userRoutes);

module.exports = router;
