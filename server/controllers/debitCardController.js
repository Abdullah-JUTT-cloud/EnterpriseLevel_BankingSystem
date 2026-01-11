import DebitCardRequest from '../models/DebitCardRequest.js';
import Account from '../models/Account.js';
import { generateCardNumber } from '../utils/generateAccount.js';

/**
 * @desc    Request debit card replacement
 * @route   POST /api/debit-cards/request
 * @access  Private (Customer)
 */
export const requestDebitCard = async (req, res) => {
    try {
        const {
            accountId,
            reason,
            oldCardNumber,
            deliveryAddress,
            urgentDelivery
        } = req.body;

        // Check if account exists and belongs to user
        const account = await Account.findOne({
            _id: accountId,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const debitCardRequest = await DebitCardRequest.create({
            userId: req.user._id,
            accountId,
            accountNumber: account.accountNumber,
            reason,
            oldCardNumber,
            deliveryAddress,
            urgentDelivery,
            status: 'Pending'
        });

        // Simulate immediate processing
        debitCardRequest.status = 'Processing';
        debitCardRequest.newCardNumber = generateCardNumber();
        await debitCardRequest.save();

        res.status(201).json({
            message: 'Debit card request submitted successfully',
            debitCardRequest
        });
    } catch (error) {
        console.error('Debit card request error:', error);
        res.status(500).json({
            message: 'Failed to request debit card',
            error: error.message
        });
    }
};

/**
 * @desc    Get user's debit card requests
 * @route   GET /api/debit-cards/my-requests
 * @access  Private
 */
export const getMyDebitCardRequests = async (req, res) => {
    try {
        const requests = await DebitCardRequest.find({ userId: req.user._id })
            .populate('accountId')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get debit card requests',
            error: error.message
        });
    }
};
