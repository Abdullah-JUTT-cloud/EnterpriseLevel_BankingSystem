import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Account from './models/Account.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Account.deleteMany({});

        console.log('Data cleared...');

        // Create Admin
        const admin = await User.create({
            fullName: 'Admin User',
            email: 'admin@test.com',
            password: 'admin123',
            cnic: '00000-0000000-0',
            phone: '03000000000',
            role: 'Admin',
            status: 'Approved'
        });

        console.log('Admin user created');

        // Create Customer
        const customer = await User.create({
            fullName: 'Test Customer',
            email: 'customer@test.com',
            password: 'password123',
            cnic: '12345-1234567-1',
            phone: '03001234567',
            role: 'Customer',
            status: 'Approved'
        });

        console.log('Customer user created');

        // Create Account for Customer
        const account = await Account.create({
            userId: customer._id,
            accountNumber: 'SCB1001',
            accountType: 'Current',
            balance: 200000,
            status: 'Active'
        });

        console.log('Customer account created');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
