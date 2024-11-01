const express = require('express');
const router = express.Router();
const { generateSalesAnglesHandler } = require('../controllers/salesAnglesController');

router.post('/generate', generateSalesAnglesHandler);

module.exports = router; 