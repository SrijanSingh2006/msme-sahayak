const express = require('express');
const router = express.Router();
const { checkLoanEligibility, findRelevantSchemes } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Route for AI Loan Eligibility
router.post('/check-eligibility', protect, checkLoanEligibility);

// Route for AI Scheme Finder
router.post('/find-schemes', protect, findRelevantSchemes);

module.exports = router;
