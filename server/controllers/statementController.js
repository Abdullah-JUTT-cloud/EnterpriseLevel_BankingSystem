import StatementRequest from '../models/StatementRequest.js';
import Account from '../models/Account.js';

/**
 * @desc    Request account statement
 * @route   POST /api/statements/request
 * @access  Private (Customer)
 */
export const requestStatement = async (req, res) => {
    try {
        const { accountId, fromDate, toDate, deliveryMethod, email, courierAddress } = req.body;

        // Check if account exists and belongs to user
        const account = await Account.findOne({
            _id: accountId,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const statement = await StatementRequest.create({
            userId: req.user._id,
            accountId,
            accountNumber: account.accountNumber,
            fromDate,
            toDate,
            deliveryMethod,
            email: deliveryMethod === 'Email' ? (email || req.user.email) : undefined,
            courierAddress: deliveryMethod === 'Courier' ? courierAddress : undefined,
            status: 'Pending'
        });

        // Simulate immediate generation for demo
        statement.status = 'Generated';
        statement.statementFileUrl = '/simulated/statement_' + Date.now() + '.pdf';
        await statement.save();

        res.status(201).json({
            message: 'Statement request processed successfully',
            statement
        });
    } catch (error) {
        console.error('Statement request error:', error);
        res.status(500).json({
            message: 'Failed to request statement',
            error: error.message
        });
    }
};

/**
 * @desc    Get user's statement requests
 * @route   GET /api/statements/my-requests
 * @access  Private
 */
export const getMyStatements = async (req, res) => {
    try {
        const statements = await StatementRequest.find({ userId: req.user._id })
            .populate('accountId')
            .sort({ createdAt: -1 });

        res.json(statements);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get statement requests',
            error: error.message
        });
    }
};
