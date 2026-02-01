const Transaction = require('../models/Transaction');

// @desc    Get all transactions for a user
// @route   GET /api/data/transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
};

// @desc    Add a new transaction
// @route   POST /api/data/transactions
exports.addTransaction = async (req, res) => {
  const { date, partyName, details, amount, type } = req.body;
  try {
    const transaction = await Transaction.create({
      date,
      partyName,
      details,
      amount,
      type,
      userId: req.user.id,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Error adding transaction', error: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/data/transactions/:id
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.destroy();
        res.json({ message: 'Transaction removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Generate compliance report for Tamil Nadu
// @route   POST /api/data/compliance-report
exports.getComplianceReport = (req, res) => {
    const { employees } = req.body;
    if (!employees || !Array.isArray(employees)) {
        return res.status(400).json({ message: 'Invalid input: employees array is required.' });
    }
    try {
        const report = employees.map(employee => {
            const { name, salary } = employee;
            if (typeof name !== 'string' || typeof salary !== 'number' || isNaN(salary)) {
                throw new Error(`Invalid data for employee: ${name || 'Unnamed'}. Salary must be a number.`);
            }
            const grossSalary = parseFloat(salary);
            const epf_employee = grossSalary * 0.12;
            const epf_employer = grossSalary * 0.12;
            let esi_employee = 0;
            let esi_employer = 0;
            if (grossSalary <= 21000) {
                esi_employee = grossSalary * 0.0075;
                esi_employer = grossSalary * 0.0325;
            }
            const halfYearlySalary = grossSalary * 6;
            let halfYearlyTax = 0;
            if (halfYearlySalary > 21000 && halfYearlySalary <= 30000) halfYearlyTax = 180;
            else if (halfYearlySalary > 30000 && halfYearlySalary <= 45000) halfYearlyTax = 425;
            else if (halfYearlySalary > 45000 && halfYearlySalary <= 60000) halfYearlyTax = 930;
            else if (halfYearlySalary > 60000 && halfYearlySalary <= 75000) halfYearlyTax = 1025;
            else if (halfYearlySalary > 75000) halfYearlyTax = 1250;
            const prof_tax = halfYearlyTax / 6;
            const total_deductions = epf_employee + esi_employee + prof_tax;
            const take_home = grossSalary - total_deductions;
            return { name, salary: grossSalary, epf_employee, esi_employee, prof_tax, take_home, epf_employer, esi_employer };
        });
        res.json(report);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error calculating compliance report' });
    }
};

// --- MOCK DATA FOR OTHER FEATURES ---
exports.getCreditKitData = (req, res) => {
    res.json([
        { id: 1, name: 'Business KYC Documents', status: 'Pending Upload' },
        { id: 2, name: 'Cash Flow Statement', status: 'Generated' },
        { id: 3, name: 'GST Reports (Last 3 Months)', status: 'Pending Upload' },
        { id: 4, name: 'Payroll Summary', status: 'Generated' },
    ]);
};
exports.getSchemes = (req, res) => {
    res.json([
        { id: 1, title: "Mudra Loan Scheme", benefit: "Collateral-free loans up to ₹10 lakh.", eligibility: "All MSMEs" },
        { id: 2, title: "Stand-Up India", benefit: "Loans from ₹10 lakh to ₹1 crore for women/SC/ST entrepreneurs.", eligibility: "Women, SC/ST" },
        { id: 3, title: "Credit Guarantee Scheme (CGS)", benefit: "Credit guarantee for loans up to ₹2 crore.", eligibility: "New & Existing MSMEs" },
    ]);
};

