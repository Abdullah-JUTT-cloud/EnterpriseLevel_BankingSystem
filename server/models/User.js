import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema
 * Represents all users in the system: Customer, Staff, Admin
 */
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    cnic: {
        type: String,
        required: [true, 'CNIC is required'],
        unique: true,
        match: [/^\d{5}-\d{7}-\d{1}$/, 'CNIC format should be XXXXX-XXXXXXX-X']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^03\d{9}$/, 'Phone format should be 03XXXXXXXXX']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['Customer', 'Staff', 'Admin'],
        default: 'Customer'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
