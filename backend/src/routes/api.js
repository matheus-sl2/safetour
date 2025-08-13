const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const alertRoutes = require('./alertRoutes');

router.use('/auth', authRoutes);
router.use('/alerta', alertRoutes);

module.exports = router;