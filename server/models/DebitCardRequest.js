import mongoose from 'mongoose';

/**
 * Debit Card Replacement Request Schema
 * Manages debit card replacement/reissue requests
 */
const debitCardRequestSchema = new mongoose.Schema({
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
    reason: {
        type: String,
        enum: ['Lost', 'Stolen', 'Damaged', 'Expired', 'Upgrade'],
        required: true
    },
    oldCardNumber: {
        type: String // Last 4 digits only for security
    },
    deliveryAddress: {
        street: String,
        city: String,
        province: String,
        postalCode: String
    },
    urgentDelivery: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    newCardNumber: {
        type: String // Generated after approval
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

const DebitCardRequest = mongoose.model('DebitCardRequest', debitCardRequestSchema);

export default DebitCardRequest;
