import CreditCard from '../models/CreditCard.js';
import { generateCardNumber } from '../utils/generateAccount.js';

/**
 * @desc    Apply for credit card
 * @route   POST /api/credit-cards/apply
 * @access  Private (Customer)
 */
export const applyCreditCard = async (req, res) => {
    try {
        const {
            cardType,
            employmentType,
            monthlyIncome,
            companyName,
            designation,
            officeAddress,
            requestedLimit
        } = req.body;

        // Check if user already has a pending/approved application
        const existingApplication = await CreditCard.findOne({
            userId: req.user._id,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existingApplication) {
            return res.status(400).json({
                message: 'You already have a pending or approved credit card application'
            });
        }

        const creditCard = await CreditCard.create({
            userId: req.user._id,
            cardType,
            employmentType,
            monthlyIncome,
            companyName,
            designation,
            officeAddress,
            requestedLimit,
            status: 'Pending'
        });

        res.status(201).json({
            message: 'Credit card application submitted successfully',
            creditCard
        });
    } catch (error) {
        console.error('Credit card application error:', error);
        res.status(500).json({
            message: 'Failed to apply for credit card',
            error: error.message
        });
    }
};

/**
 * @desc    Get user's credit card applications
 * @route   GET /api/credit-cards/my-applications
 * @access  Private
 */
export const getMyCreditCards = async (req, res) => {
    try {
        const creditCards = await CreditCard.find({ userId: req.user._id })
            .populate('approvedBy', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(creditCards);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get credit card applications',
            error: error.message
        });
    }
};

/**
 * @desc    Get all pending credit card applications (Admin)
 * @route   GET /api/credit-cards/pending
 * @access  Private (Admin)
 */
export const getPendingApplications = async (req, res) => {
    try {
        const applications = await CreditCard.find({ status: 'Pending' })
            .populate('userId', 'fullName email cnic phone')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get pending applications',
            error: error.message
        });
    }
};

/**
 * @desc    Approve/Reject credit card application (Admin)
 * @route   PUT /api/credit-cards/:id/review
 * @access  Private (Admin)
 */
export const reviewApplication = async (req, res) => {
    try {
        const { status, approvedLimit, remarks } = req.body;

        const creditCard = await CreditCard.findById(req.params.id);

        if (!creditCard) {
            return res.status(404).json({ message: 'Application not found' });
        }

        creditCard.status = status;
        creditCard.remarks = remarks || '';
        creditCard.approvedBy = req.user._id;
        creditCard.approvalDate = new Date();

        if (status === 'Approved') {
            creditCard.cardNumber = generateCardNumber();
            creditCard.approvedLimit = approvedLimit || creditCard.requestedLimit;
        }

        await creditCard.save();

        res.json({
            message: `Credit card application ${status.toLowerCase()} successfully`,
            creditCard
        });
    } catch (error) {
        console.error('Credit card review error:', error);
        res.status(500).json({
            message: 'Failed to review application',
            error: error.message
        });
    }
};
