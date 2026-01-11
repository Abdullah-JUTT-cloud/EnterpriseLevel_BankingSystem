import mongoose from 'mongoose';

/**
 * Credit Card Application Schema
 * Manages credit card requests from customers
 */
const creditCardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardType: {
        type: String,
        enum: ['Gold', 'Platinum', 'Titanium', 'Infinite'],
        required: true
    },
    employmentType: {
        type: String,
        enum: ['Salaried', 'Self-Employed', 'Business Owner'],
        required: true
    },
    monthlyIncome: {
        type: Number,
        required: true,
        min: 25000 // Minimum income requirement
    },
    companyName: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    officeAddress: {
        type: String,
        required: true
    },
    requestedLimit: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: {
        type: Date
    },
    remarks: {
        type: String
    },
    // Generated after approval
    cardNumber: {
        type: String
    },
    approvedLimit: {
        type: Number
    }
}, {
    timestamps: true
});

const CreditCard = mongoose.model('CreditCard', creditCardSchema);

export default CreditCard;
