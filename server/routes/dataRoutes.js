const express = require('express');
const router = express.Router();
const {
    getTransactions,
    addTransaction,
    deleteTransaction,
    getCreditKitData,
    getSchemes,
    getComplianceReport
} = require('../controllers/dataController');
const { protect } = require('../middleware/authMiddleware');

// Transaction Routes
router.route('/transactions').get(protect, getTransactions).post(protect, addTransaction);
router.route('/transactions/:id').delete(protect, deleteTransaction);

// New Compliance Report Route
router.post('/compliance-report', protect, getComplianceReport);

// Mock Data Routes
router.get('/credit-kit', protect, getCreditKitData);
router.get('/schemes', protect, getSchemes);

module.exports = router;

