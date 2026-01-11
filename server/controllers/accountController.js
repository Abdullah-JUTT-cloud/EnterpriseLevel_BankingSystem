import Account from '../models/Account.js';
import { generateAccountNumber } from '../utils/generateAccount.js';

/**
 * @desc    Create a new bank account
 * @route   POST /api/accounts
 * @access  Private (Customer)
 */
export const createAccount = async (req, res) => {
    try {
        const { accountType } = req.body;

        // Check if user already has an account
        const existingAccount = await Account.findOne({ userId: req.user._id });

        if (existingAccount) {
            return res.status(400).json({
                message: 'You already have an account. Multiple accounts not allowed in this demo.'
            });
        }

        // Generate unique account number
        const accountNumber = generateAccountNumber();

        // Create account (status will be Pending until KYC is approved)
        const account = await Account.create({
            userId: req.user._id,
            accountNumber,
            accountType,
            balance: 0,
            status: 'Pending'
        });

        res.status(201).json(account);
    } catch (error) {
        console.error('Account creation error:', error);
        res.status(500).json({
            message: 'Failed to create account',
            error: error.message
        });
    }
};

/**
 * @desc    Get user's account
 * @route   GET /api/accounts/my-account
 * @access  Private
 */
export const getMyAccount = async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.user._id });

        if (!account) {
            return res.status(404).json({ message: 'No account found' });
        }

        res.json(account);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get account',
            error: error.message
        });
    }
};

/**
 * @desc    Get account by account number (for fund transfer)
 * @route   GET /api/accounts/:accountNumber
 * @access  Private
 */
export const getAccountByNumber = async (req, res) => {
    try {
        const account = await Account.findOne({
            accountNumber: req.params.accountNumber
        }).populate('userId', 'fullName email');

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Return limited info for security
        res.json({
            accountNumber: account.accountNumber,
            accountHolderName: account.userId.fullName,
            accountType: account.accountType,
            status: account.status
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get account',
            error: error.message
        });
    }
};
