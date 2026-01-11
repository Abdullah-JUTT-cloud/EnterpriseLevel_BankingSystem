import ChequeBookRequest from '../models/ChequeBookRequest.js';
import Account from '../models/Account.js';

/**
 * @desc    Request cheque book
 * @route   POST /api/cheque-books/request
 * @access  Private (Customer)
 */
export const requestChequeBook = async (req, res) => {
    try {
        const {
            accountId,
            numberOfLeaves,
            deliveryAddress,
            collectionMethod,
            branchName
        } = req.body;

        // Check if account exists and belongs to user
        const account = await Account.findOne({
            _id: accountId,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const chequeBookRequest = await ChequeBookRequest.create({
            userId: req.user._id,
            accountId,
            accountNumber: account.accountNumber,
            numberOfLeaves,
            deliveryAddress: collectionMethod === 'Home Delivery' ? deliveryAddress : undefined,
            collectionMethod,
            branchName: collectionMethod === 'Branch Pickup' ? branchName : undefined,
            status: 'Pending'
        });

        // Simulate immediate processing
        chequeBookRequest.status = 'Processing';
        await chequeBookRequest.save();

        res.status(201).json({
            message: 'Cheque book request submitted successfully',
            chequeBookRequest
        });
    } catch (error) {
        console.error('Cheque book request error:', error);
        res.status(500).json({
            message: 'Failed to request cheque book',
            error: error.message
        });
    }
};

/**
 * @desc    Get user's cheque book requests
 * @route   GET /api/cheque-books/my-requests
 * @access  Private
 */
export const getMyChequeBookRequests = async (req, res) => {
    try {
        const requests = await ChequeBookRequest.find({ userId: req.user._id })
            .populate('accountId')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get cheque book requests',
            error: error.message
        });
    }
};
