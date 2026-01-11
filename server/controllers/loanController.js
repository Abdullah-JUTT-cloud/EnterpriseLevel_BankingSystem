import Loan from '../models/Loan.js';

/**
 * @desc    Apply for loan
 * @route   POST /api/loans/apply
 * @access  Private (Customer)
 */
export const applyLoan = async (req, res) => {
    try {
        const {
            loanType,
            loanAmount,
            tenure,
            purpose,
            monthlyIncome,
            employmentType,
            companyName,
            employmentDuration
        } = req.body;

        // Check if user already has a pending loan application
        const existingLoan = await Loan.findOne({
            userId: req.user._id,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existingLoan) {
            return res.status(400).json({
                message: 'You already have a pending or approved loan application'
            });
        }

        const loan = await Loan.create({
            userId: req.user._id,
            loanType,
            loanAmount,
            tenure,
            purpose,
            monthlyIncome,
            employmentType,
            companyName,
            employmentDuration,
            status: 'Pending'
        });

        res.status(201).json({
            message: 'Loan application submitted successfully',
            loan,
            monthlyInstallment: loan.monthlyInstallment
        });
    } catch (error) {
        console.error('Loan application error:', error);
        res.status(500).json({
            message: 'Failed to apply for loan',
            error: error.message
        });
    }
};

/**
 * @desc    Get user's loan applications
 * @route   GET /api/loans/my-loans
 * @access  Private
 */
export const getMyLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.user._id })
            .populate('approvedBy', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(loans);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get loan applications',
            error: error.message
        });
    }
};

/**
 * @desc    Get all pending loan applications (Admin)
 * @route   GET /api/loans/pending
 * @access  Private (Admin)
 */
export const getPendingLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ status: 'Pending' })
            .populate('userId', 'fullName email cnic phone')
            .sort({ createdAt: -1 });

        res.json(loans);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get pending loans',
            error: error.message
        });
    }
};

/**
 * @desc    Approve/Reject loan application (Admin)
 * @route   PUT /api/loans/:id/review
 * @access  Private (Admin)
 */
export const reviewLoan = async (req, res) => {
    try {
        const { status, remarks } = req.body;

        const loan = await Loan.findById(req.params.id).populate('userId');

        if (!loan) {
            return res.status(404).json({ message: 'Loan application not found' });
        }

        loan.status = status;
        loan.remarks = remarks || '';
        loan.approvedBy = req.user._id;
        loan.approvalDate = new Date();

        if (status === 'Approved') {
            loan.disbursementDate = new Date();

            // CRITICAL: Disburse loan amount to customer's account
            const Account = (await import('../models/Account.js')).default;
            const account = await Account.findOne({ userId: loan.userId._id });
            if (account) {
                account.balance += loan.loanAmount;
                await account.save();
            }
        }

        await loan.save();

        res.json({
            message: `Loan application ${status.toLowerCase()} successfully${status === 'Approved' ? ' and amount disbursed to account' : ''}`,
            loan
        });
    } catch (error) {
        console.error('Loan review error:', error);
        res.status(500).json({
            message: 'Failed to review loan',
            error: error.message
        });
    }
};
