import mongoose from 'mongoose';

/**
 * Account Schema
 * Represents bank accounts linked to users
 */
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    accountType: {
        type: String,
        enum: ['Savings', 'Current', 'Asaan'],
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    currency: {
        type: String,
        default: 'PKR'
    },
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Suspended', 'Closed'],
        default: 'Pending' // Becomes Active after KYC approval
    },
    branch: {
        type: String,
        default: 'Karachi Main Branch'
    }
}, {
    timestamps: true
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
