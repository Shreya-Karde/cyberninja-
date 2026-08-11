const express = require('express');
const router = express.Router();
const { analyzeURL } = require('../controllers/phishingController');
const { protect } = require('../middleware/auth');
router.post('/analyze', protect, analyzeURL);
module.exports = router;
