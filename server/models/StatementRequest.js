import mongoose from 'mongoose';

/**
 * Statement Request Schema
 * Manages account statement generation requests
 */
const statementRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    deliveryMethod: {
        type: String,
        enum: ['Email', 'Download', 'Courier'],
        default: 'Email'
    },
    email: {
        type: String
    },
    courierAddress: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Generated', 'Sent', 'Failed'],
        default: 'Pending'
    },
    statementFileUrl: {
        type: String // Simulated PDF URL
    }
}, {
    timestamps: true
});

const StatementRequest = mongoose.model('StatementRequest', statementRequestSchema);

export default StatementRequest;
