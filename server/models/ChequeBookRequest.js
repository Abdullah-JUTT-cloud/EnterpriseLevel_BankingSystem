import mongoose from 'mongoose';

/**
 * Cheque Book Request Schema
 * Manages cheque book issuance requests
 */
const chequeBookRequestSchema = new mongoose.Schema({
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
    numberOfLeaves: {
        type: Number,
        enum: [10, 25, 50],
        required: true
    },
    deliveryAddress: {
        street: String,
        city: String,
        province: String,
        postalCode: String
    },
    collectionMethod: {
        type: String,
        enum: ['Home Delivery', 'Branch Pickup'],
        default: 'Home Delivery'
    },
    branchName: {
        type: String,
        default: 'Karachi Main Branch'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Ready for Pickup', 'Dispatched', 'Delivered'],
        default: 'Pending'
    },
    dispatchDate: {
        type: Date
    },
    trackingNumber: {
        type: String
    }
}, {
    timestamps: true
});

const ChequeBookRequest = mongoose.model('ChequeBookRequest', chequeBookRequestSchema);

export default ChequeBookRequest;
