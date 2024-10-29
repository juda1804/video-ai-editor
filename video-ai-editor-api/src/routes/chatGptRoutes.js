const express = require('express');
const router = express.Router();
const { asktoChatGpt } = require('../controllers/chatGptController');

router.get('/ask', asktoChatGpt);

module.exports = router;