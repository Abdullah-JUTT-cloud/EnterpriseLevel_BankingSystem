import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
import { generateTransactionId } from '../utils/generateAccount.js';

/**
 * @desc    Initiate fund transfer
 * @route   POST /api/transactions/transfer
 * @access  Private (Customer)
 */
export const initiateTransfer = async (req, res) => {
    try {
        const {
            toAccount,
            amount,
            recipientName,
            recipientBank,
            description
        } = req.body;

        // Get sender's account
        const fromAccountData = await Account.findOne({ userId: req.user._id });

        if (!fromAccountData) {
            return res.status(404).json({ message: 'Your account not found' });
        }

        if (fromAccountData.status !== 'Active') {
            return res.status(400).json({
                message: 'Your account is not active. Please complete KYC verification.'
            });
        }

        // Check balance
        if (fromAccountData.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // CRITICAL FIX: Validate recipient account exists
        const recipientAccount = await Account.findOne({ accountNumber: toAccount });
        if (!recipientAccount) {
            return res.status(404).json({
                message: 'Recipient account not found. Please verify the account number.'
            });
        }

        if (recipientAccount.status !== 'Active') {
            return res.status(400).json({
                message: 'Recipient account is not active. Cannot transfer funds.'
            });
        }

        // Create transaction (Pending status, waiting for OTP)
        const transaction = await Transaction.create({
            fromAccount: fromAccountData.accountNumber,
            toAccount,
            amount,
            recipientName,
            recipientBank: recipientBank || 'Standard Chartered Bank',
            description,
            userId: req.user._id,
            transactionId: generateTransactionId(),
            status: 'Pending',
            otpVerified: false
        });

        res.status(201).json({
            message: 'Transaction initiated. Please verify with OTP.',
            transaction,
            simulatedOTP: process.env.SIMULATED_OTP || '123456' // For demo purposes
        });
    } catch (error) {
        console.error('Transfer initiation error:', error);
        res.status(500).json({
            message: 'Failed to initiate transfer',
            error: error.message
        });
    }
};

/**
 * @desc    Verify OTP and complete transfer
 * @route   POST /api/transactions/:id/verify-otp
 * @access  Private (Customer)
 */
export const verifyOTPAndTransfer = async (req, res) => {
    try {
        const { otp } = req.body;
        const transactionId = req.params.id;

        // Simulated OTP verification
        const validOTP = process.env.SIMULATED_OTP || '123456';

        if (otp !== validOTP) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (transaction.status !== 'Pending') {
            return res.status(400).json({ message: 'Transaction already processed' });
        }

        // Process the transfer
        const fromAccountData = await Account.findOne({
            accountNumber: transaction.fromAccount
        });

        // Deduct from sender
        fromAccountData.balance -= transaction.amount;
        await fromAccountData.save();

        // If recipient account exists in our system, credit it
        const toAccountData = await Account.findOne({
            accountNumber: transaction.toAccount
        });

        if (toAccountData) {
            toAccountData.balance += transaction.amount;
            await toAccountData.save();
        }

        // Update transaction
        transaction.otpVerified = true;
        transaction.status = 'Completed';
        await transaction.save();

        res.json({
            message: 'Transaction completed successfully',
            transaction
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            message: 'Failed to complete transaction',
            error: error.message
        });
    }
};

/**
 * @desc    Get user's transaction history
 * @route   GET /api/transactions/my-transactions
 * @access  Private
 */
export const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get transactions',
            error: error.message
        });
    }
};
