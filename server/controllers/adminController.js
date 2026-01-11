import KYC from '../models/KYC.js';
import Loan from '../models/Loan.js';
import CreditCard from '../models/CreditCard.js';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Account from '../models/Account.js';

/**
 * @desc    Get dashboard statistics for admin
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const stats = {
            pendingKYC: await KYC.countDocuments({ status: 'Pending' }),
            pendingLoans: await Loan.countDocuments({ status: 'Pending' }),
            pendingCreditCards: await CreditCard.countDocuments({ status: 'Pending' }),
            openComplaints: await Complaint.countDocuments({ status: { $in: ['Open', 'In Progress'] } })
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get dashboard stats',
            error: error.message
        });
    }
};

/**
 * @desc    Get all pending requests (Admin)
 * @route   GET /api/admin/pending-requests
 * @access  Private (Admin)
 */
export const getAllPendingRequests = async (req, res) => {
    try {
        const [kycRequests, loans, creditCards] = await Promise.all([
            KYC.find({ status: 'Pending' })
                .populate('userId', 'fullName email')
                .limit(10)
                .sort({ createdAt: -1 }),
            Loan.find({ status: 'Pending' })
                .populate('userId', 'fullName email')
                .limit(10)
                .sort({ createdAt: -1 }),
            CreditCard.find({ status: 'Pending' })
                .populate('userId', 'fullName email')
                .limit(10)
                .sort({ createdAt: -1 })
        ]);

        res.json({
            kycRequests,
            loans,
            creditCards
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get pending requests',
            error: error.message
        });
    }
};

/**
 * @desc    Get all customers with their accounts
 * @route   GET /api/admin/customers
 * @access  Private (Admin)
 */
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'Customer' })
            .select('-password')
            .sort({ createdAt: -1 });

        const customersWithAccounts = await Promise.all(
            customers.map(async (customer) => {
                const account = await Account.findOne({ userId: customer._id });
                return {
                    ...customer.toObject(),
                    account
                };
            })
        );

        res.json(customersWithAccounts);
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({
            message: 'Failed to get customers',
            error: error.message
        });
    }
};

/**
 * @desc    Adjust customer account balance
 * @route   PUT /api/admin/customers/:userId/balance
 * @access  Private (Admin)
 */
export const adjustCustomerBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const { amount, operation } = req.body;

        const account = await Account.findOne({ userId });

        if (!account) {
            return res.status(404).json({ message: 'Customer account not found' });
        }

        const previousBalance = account.balance;

        if (operation === 'add') {
            account.balance += amount;
        } else if (operation === 'deduct') {
            if (account.balance < amount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }
            account.balance -= amount;
        }

        await account.save();

        res.json({
            message: `Successfully ${operation === 'add' ? 'added' : 'deducted'} PKR ${amount.toLocaleString()}`,
            previousBalance,
            newBalance: account.balance
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to adjust balance',
            error: error.message
        });
    }
};
