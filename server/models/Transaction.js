import mongoose from 'mongoose';

/**
 * Transaction Schema
 * Handles fund transfers (simulated IBFT - Inter Bank Fund Transfer)
 */
const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: String,
        required: true
    },
    toAccount: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    transactionType: {
        type: String,
        enum: ['Internal Transfer', 'IBFT', 'Bill Payment'],
        default: 'IBFT'
    },
    recipientName: {
        type: String,
        required: true
    },
    recipientBank: {
        type: String,
        default: 'Standard Chartered Bank'
    },
    description: {
        type: String,
        default: ''
    },
    // OTP Verification (Simulated)
    otpVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    transactionId: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
