import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const Loan = () => {
    const [loans, setLoans] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        loanType: 'Personal Loan',
        loanAmount: '',
        tenure: '12',
        purpose: '',
        monthlyIncome: '',
        employmentType: 'Salaried',
        companyName: '',
        employmentDuration: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const response = await axios.get('/loans/my-loans');
            setLoans(response.data);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/loans/apply', formData);
            setMessage({ type: 'success', text: `Loan application submitted! Monthly EMI: PKR ${response.data.monthlyInstallment}` });
            setShowForm(false);
            fetchLoans();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Application failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-50">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-scb-dark">Loan Applications</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'View Applications' : 'New Application'}
                    </button>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                {showForm ? (
                    <div className="card max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold mb-6">Apply for Loan</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Loan Type</label>
                                    <select value={formData.loanType} onChange={(e) => setFormData({ ...formData, loanType: e.target.value })} className="input-field">
                                        <option value="Personal Loan">Personal Loan</option>
                                        <option value="Car Loan">Car Loan</option>
                                        <option value="Home Loan">Home Loan</option>
                                        <option value="Education Loan">Education Loan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Loan Amount (PKR)</label>
                                    <input type="number" value={formData.loanAmount} onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })} className="input-field" min="50000" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Tenure (Months)</label>
                                    <select value={formData.tenure} onChange={(e) => setFormData({ ...formData, tenure: e.target.value })} className="input-field">
                                        <option value="12">12 Months</option>
                                        <option value="24">24 Months</option>
                                        <option value="36">36 Months</option>
                                        <option value="48">48 Months</option>
                                        <option value="60">60 Months</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Monthly Income (PKR)</label>
                                    <input type="number" value={formData.monthlyIncome} onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })} className="input-field" min="25000" required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Purpose</label>
                                <textarea value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} className="input-field" rows="2" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Employment Type</label>
                                    <select value={formData.employmentType} onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })} className="input-field">
                                        <option value="Salaried">Salaried</option>
                                        <option value="Self-Employed">Self-Employed</option>
                                        <option value="Business Owner">Business Owner</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
                                    <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Employment Duration (Years)</label>
                                    <input type="number" value={formData.employmentDuration} onChange={(e) => setFormData({ ...formData, employmentDuration: e.target.value })} className="input-field" min="1" step="0.5" required />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">My Loan Applications</h2>
                        {loans.length > 0 ? (
                            <div className="space-y-4">
                                {loans.map((loan) => (
                                    <div key={loan._id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg">{loan.loanType}</h3>
                                                <p className="text-sm text-gray-600">Applied: {new Date(loan.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <StatusBadge status={loan.status} />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <p><span className="font-semibold">Amount:</span> PKR {loan.loanAmount.toLocaleString()}</p>
                                            <p><span className="font-semibold">Tenure:</span> {loan.tenure} months</p>
                                            <p><span className="font-semibold">Monthly EMI:</span> PKR {loan.monthlyInstallment?.toLocaleString()}</p>
                                            <p><span className="font-semibold">Interest Rate:</span> {loan.interestRate}%</p>
                                        </div>
                                        <p className="mt-2 text-sm"><span className="font-semibold">Purpose:</span> {loan.purpose}</p>
                                        {loan.remarks && (
                                            <p className="mt-2 text-sm text-gray-600"><span className="font-semibold">Remarks:</span> {loan.remarks}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No loan applications yet</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Loan;
