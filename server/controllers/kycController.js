import KYC from '../models/KYC.js';
import Account from '../models/Account.js';

/**
 * @desc    Submit KYC verification
 * @route   POST /api/kyc
 * @access  Private (Customer)
 */
export const submitKYC = async (req, res) => {
    try {
        const {
            accountId,
            fatherName,
            dateOfBirth,
            address,
            occupation,
            monthlyIncome
        } = req.body;

        // Check if account exists and belongs to user
        const account = await Account.findOne({
            _id: accountId,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Check if KYC already exists for this account
        const existingKYC = await KYC.findOne({ accountId });
        if (existingKYC) {
            return res.status(400).json({
                message: 'KYC already submitted for this account'
            });
        }

        // Create KYC record (documents are simulated)
        const kyc = await KYC.create({
            userId: req.user._id,
            accountId,
            fatherName,
            dateOfBirth,
            address,
            occupation,
            monthlyIncome,
            status: 'Pending'
        });

        res.status(201).json({
            message: 'KYC submitted successfully. Please wait for admin approval.',
            kyc
        });
    } catch (error) {
        console.error('KYC submission error:', error);
        res.status(500).json({
            message: 'Failed to submit KYC',
            error: error.message
        });
    }
};

/**
 * @desc    Get user's KYC status
 * @route   GET /api/kyc/my-kyc
 * @access  Private
 */
export const getMyKYC = async (req, res) => {
    try {
        const kyc = await KYC.findOne({ userId: req.user._id })
            .populate('accountId')
            .populate('verifiedBy', 'fullName email');

        if (!kyc) {
            return res.status(404).json({ message: 'No KYC record found' });
        }

        res.json(kyc);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get KYC',
            error: error.message
        });
    }
};

/**
 * @desc    Get all pending KYC requests (Admin)
 * @route   GET /api/kyc/pending
 * @access  Private (Admin)
 */
export const getPendingKYC = async (req, res) => {
    try {
        const kycRequests = await KYC.find({ status: 'Pending' })
            .populate('userId', 'fullName email cnic phone')
            .populate('accountId')
            .sort({ createdAt: -1 });

        res.json(kycRequests);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get pending KYC requests',
            error: error.message
        });
    }
};

/**
 * @desc    Approve/Reject KYC (Admin)
 * @route   PUT /api/kyc/:id/verify
 * @access  Private (Admin)
 */
export const verifyKYC = async (req, res) => {
    try {
        const { status, remarks } = req.body; // status: 'Approved' or 'Rejected'

        const kyc = await KYC.findById(req.params.id);

        if (!kyc) {
            return res.status(404).json({ message: 'KYC record not found' });
        }

        kyc.status = status;
        kyc.remarks = remarks || '';
        kyc.verifiedBy = req.user._id;
        kyc.verificationDate = new Date();

        await kyc.save();

        // If approved, activate the account with initial balance
        if (status === 'Approved') {
            await Account.findByIdAndUpdate(kyc.accountId, {
                status: 'Active',
                balance: 200000 // Give initial balance of 200,000 PKR
            });
        }

        res.json({
            message: `KYC ${status.toLowerCase()} successfully`,
            kyc
        });
    } catch (error) {
        console.error('KYC verification error:', error);
        res.status(500).json({
            message: 'Failed to verify KYC',
            error: error.message
        });
    }
};
