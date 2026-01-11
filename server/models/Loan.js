import mongoose from 'mongoose';

/**
 * Loan Application Schema
 * Manages personal loan requests
 */
const loanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loanType: {
        type: String,
        enum: ['Personal Loan', 'Car Loan', 'Home Loan', 'Education Loan'],
        required: true
    },
    loanAmount: {
        type: Number,
        required: true,
        min: 50000
    },
    tenure: {
        type: Number, // in months
        required: true,
        min: 12,
        max: 60
    },
    purpose: {
        type: String,
        required: true
    },
    monthlyIncome: {
        type: Number,
        required: true
    },
    employmentType: {
        type: String,
        enum: ['Salaried', 'Self-Employed', 'Business Owner'],
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    employmentDuration: {
        type: Number, // in years
        required: true
    },
    // Calculated fields
    interestRate: {
        type: Number,
        default: 18.5 // Annual percentage rate
    },
    monthlyInstallment: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Disbursed'],
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
    disbursementDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Calculate monthly installment before saving
loanSchema.pre('save', function (next) {
    if (this.loanAmount && this.tenure && this.interestRate) {
        const monthlyRate = this.interestRate / 100 / 12;
        const installment = (this.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, this.tenure)) /
            (Math.pow(1 + monthlyRate, this.tenure) - 1);
        this.monthlyInstallment = Math.round(installment);
    }
    next();
});

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;
