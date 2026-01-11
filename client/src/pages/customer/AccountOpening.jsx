import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';

/**
 * Account Opening & KYC Submission Page
 */
const AccountOpening = () => {
    const [step, setStep] = useState(1);
    const [accountData, setAccountData] = useState({ accountType: 'Savings' });
    const [kycData, setKycData] = useState({
        fatherName: '',
        dateOfBirth: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        occupation: '',
        monthlyIncome: 'Below 25k'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleAccountSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/accounts', accountData);
            setMessage({ type: 'success', text: 'Account created successfully! Please complete KYC verification.' });
            setAccountData(response.data);
            setStep(2);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create account' });
        } finally {
            setLoading(false);
        }
    };

    const handleKYCSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post('/kyc', {
                accountId: accountData._id,
                fatherName: kycData.fatherName,
                dateOfBirth: kycData.dateOfBirth,
                address: {
                    street: kycData.street,
                    city: kycData.city,
                    province: kycData.province,
                    postalCode: kycData.postalCode
                },
                occupation: kycData.occupation,
                monthlyIncome: kycData.monthlyIncome
            });

            setMessage({ type: 'success', text: 'KYC submitted successfully! Please wait for admin approval.' });
            setStep(3);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit KYC' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-50">
                <h1 className="text-3xl font-bold text-scb-dark mb-8">Account Opening & KYC</h1>

                {/* Progress Indicator */}
                <div className="flex mb-8">
                    <div className={`flex-1 text-center pb-2 border-b-4 ${step >= 1 ? 'border-scb-green' : 'border-gray-300'}`}>
                        <span className="font-semibold">1. Create Account</span>
                    </div>
                    <div className={`flex-1 text-center pb-2 border-b-4 ${step >= 2 ? 'border-scb-green' : 'border-gray-300'}`}>
                        <span className="font-semibold">2. KYC Verification</span>
                    </div>
                    <div className={`flex-1 text-center pb-2 border-b-4 ${step >= 3 ? 'border-scb-green' : 'border-gray-300'}`}>
                        <span className="font-semibold">3. Complete</span>
                    </div>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                {/* Step 1: Create Account */}
                {step === 1 && (
                    <div className="card max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold mb-6">Create Bank Account</h2>
                        <form onSubmit={handleAccountSubmit}>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Account Type</label>
                                <select
                                    value={accountData.accountType}
                                    onChange={(e) => setAccountData({ ...accountData, accountType: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="Savings">Savings Account</option>
                                    <option value="Current">Current Account</option>
                                    <option value="Asaan">Asaan Account</option>
                                </select>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Creating...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: KYC Verification */}
                {step === 2 && (
                    <div className="card max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold mb-6">KYC Verification</h2>
                        <form onSubmit={handleKYCSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Father's Name</label>
                                    <input
                                        type="text"
                                        value={kycData.fatherName}
                                        onChange={(e) => setKycData({ ...kycData, fatherName: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={kycData.dateOfBirth}
                                        onChange={(e) => setKycData({ ...kycData, dateOfBirth: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
                                <input
                                    type="text"
                                    value={kycData.street}
                                    onChange={(e) => setKycData({ ...kycData, street: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">City</label>
                                    <input
                                        type="text"
                                        value={kycData.city}
                                        onChange={(e) => setKycData({ ...kycData, city: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Province</label>
                                    <select
                                        value={kycData.province}
                                        onChange={(e) => setKycData({ ...kycData, province: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Sindh">Sindh</option>
                                        <option value="KPK">KPK</option>
                                        <option value="Balochistan">Balochistan</option>
                                        <option value="Islamabad">Islamabad</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Postal Code</label>
                                    <input
                                        type="text"
                                        value={kycData.postalCode}
                                        onChange={(e) => setKycData({ ...kycData, postalCode: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Occupation</label>
                                    <input
                                        type="text"
                                        value={kycData.occupation}
                                        onChange={(e) => setKycData({ ...kycData, occupation: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Monthly Income</label>
                                    <select
                                        value={kycData.monthlyIncome}
                                        onChange={(e) => setKycData({ ...kycData, monthlyIncome: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Below 25k">Below 25k</option>
                                        <option value="25k-50k">25k-50k</option>
                                        <option value="50k-100k">50k-100k</option>
                                        <option value="100k-200k">100k-200k</option>
                                        <option value="Above 200k">Above 200k</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Submitting...' : 'Submit KYC'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 3: Complete */}
                {step === 3 && (
                    <div className="card max-w-2xl mx-auto text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold mb-4">Application Complete!</h2>
                        <p className="text-gray-600 mb-6">
                            Your account has been created and KYC submitted. Please wait for admin approval.
                            You will be notified once your account is activated.
                        </p>
                        <button onClick={() => window.location.href = '/dashboard'} className="btn-primary">
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountOpening;
