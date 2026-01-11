import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';

/**
 * Fund Transfer Page
 * Allows money transfer with simulated OTP verification
 */
const FundTransfer = () => {
    const [step, setStep] = useState(1);
    const [myAccount, setMyAccount] = useState(null);
    const [formData, setFormData] = useState({
        toAccount: '',
        amount: '',
        recipientName: '',
        recipientBank: 'Standard Chartered Bank',
        description: ''
    });
    const [transaction, setTransaction] = useState(null);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchMyAccount();
    }, []);

    const fetchMyAccount = async () => {
        try {
            const response = await axios.get('/accounts/my-account');
            setMyAccount(response.data);
        } catch (error) {
            console.error('Error fetching account:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTransferSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/transactions/transfer', formData);
            setTransaction(response.data.transaction);
            setMessage({
                type: 'success',
                text: `OTP sent! Use: ${response.data.simulatedOTP}`
            });
            setStep(2);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Transfer failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleOTPVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post(`/transactions/${transaction._id}/verify-otp`, { otp });
            setMessage({ type: 'success', text: 'Transfer completed successfully!' });
            setStep(3);
            fetchMyAccount(); // Refresh balance
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Invalid OTP' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-50">
                <h1 className="text-3xl font-bold text-scb-dark mb-8">Fund Transfer</h1>

                {/* Account Balance */}
                {myAccount && (
                    <div className="card mb-6 max-w-2xl mx-auto">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm">Available Balance</p>
                                <p className="text-2xl font-bold text-scb-green">PKR {myAccount.balance.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Account Number</p>
                                <p className="font-mono font-semibold">{myAccount.accountNumber}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Message Display */}
                {message && (
                    <div className={`mb-6 max-w-2xl mx-auto p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                {/* Step 1: Transfer Details */}
                {step === 1 && (
                    <div className="card max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold mb-6">Transfer Details</h2>
                        <form onSubmit={handleTransferSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Recipient Account Number</label>
                                <input
                                    type="text"
                                    name="toAccount"
                                    value={formData.toAccount}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="SCBPK-XXXXXXXXXX"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Recipient Name</label>
                                <input
                                    type="text"
                                    name="recipientName"
                                    value={formData.recipientName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter recipient name"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Recipient Bank</label>
                                <input
                                    type="text"
                                    name="recipientBank"
                                    value={formData.recipientBank}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Amount (PKR)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="0"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input-field"
                                    rows="3"
                                    placeholder="Payment purpose"
                                />
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Processing...' : 'Proceed to OTP'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && transaction && (
                    <div className="card max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold mb-6">OTP Verification</h2>

                        <div className="bg-blue-50 p-4 rounded mb-6">
                            <p className="text-sm text-gray-700 mb-2">Transaction Details:</p>
                            <p className="font-semibold">Amount: PKR {transaction.amount.toLocaleString()}</p>
                            <p className="text-sm">To: {transaction.recipientName} ({transaction.toAccount})</p>
                            <p className="text-xs text-gray-600 mt-2">Transaction ID: {transaction.transactionId}</p>
                        </div>

                        <form onSubmit={handleOTPVerify}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="input-field text-center text-2xl tracking-widest"
                                    placeholder="123456"
                                    maxLength="6"
                                    required
                                />
                                <p className="text-xs text-gray-600 mt-2">For demo: Use 123456</p>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Verifying...' : 'Confirm Transfer'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="card max-w-2xl mx-auto text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold mb-4">Transfer Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your money has been transferred successfully.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => { setStep(1); setFormData({ ...formData, amount: '', toAccount: '', recipientName: '', description: '' }); }} className="btn-secondary">
                                New Transfer
                            </button>
                            <button onClick={() => window.location.href = '/dashboard'} className="btn-primary">
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FundTransfer;
