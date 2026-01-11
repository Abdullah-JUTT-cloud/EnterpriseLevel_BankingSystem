import mongoose from 'mongoose';

/**
 * Complaint Schema
 * Manages customer complaints and grievances
 */
const complaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: [
            'Account Related',
            'Card Related',
            'Online Banking',
            'ATM Issue',
            'Transaction Dispute',
            'Customer Service',
            'Other'
        ],
        required: true
    },
    subject: {
        type: String,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Staff member handling the complaint
    },
    resolution: {
        type: String
    },
    resolutionDate: {
        type: Date
    },
    ticketNumber: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Generate ticket number before saving
complaintSchema.pre('save', function (next) {
    if (!this.ticketNumber) {
        this.ticketNumber = 'TKT' + Date.now() + Math.floor(Math.random() * 1000);
    }
    next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
