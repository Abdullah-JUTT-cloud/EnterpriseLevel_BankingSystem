import mongoose from 'mongoose';

/**
 * KYC (Know Your Customer) Schema
 * Manages customer verification process
 */
const kycSchema = new mongoose.Schema({
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
    // Document Information
    cnicFront: {
        type: String, // In real app, this would be file URL
        default: 'simulated_cnic_front.jpg'
    },
    cnicBack: {
        type: String,
        default: 'simulated_cnic_back.jpg'
    },
    utilityBill: {
        type: String,
        default: 'simulated_utility_bill.pdf'
    },
    // Personal Information
    fatherName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        street: String,
        city: String,
        province: String,
        postalCode: String
    },
    occupation: {
        type: String,
        required: true
    },
    monthlyIncome: {
        type: String,
        enum: ['Below 25k', '25k-50k', '50k-100k', '100k-200k', 'Above 200k'],
        required: true
    },
    // Verification Status
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin who verified
    },
    verificationDate: {
        type: Date
    },
    remarks: {
        type: String // Admin comments
    }
}, {
    timestamps: true
});

const KYC = mongoose.model('KYC', kycSchema);

export default KYC;
