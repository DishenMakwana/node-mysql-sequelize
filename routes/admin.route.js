const express = require('express');
const userRoutes = require('./admin/user.route');
const adminRoutes = require('./admin/admin.route');

const router = express.Router();

router.use('/user', userRoutes);

router.use('/sub-admin', adminRoutes);

module.exports = router;
