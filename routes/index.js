const adminRoute = require('./admin.route');
const userRoute = require('./user.route');
const express = require('express');

const router = express.Router();

router.use('/admin', adminRoute);
router.use('/api/v1', userRoute);

module.exports = router;
