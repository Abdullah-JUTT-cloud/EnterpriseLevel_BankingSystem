import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';

const LoanApprovals = () => {
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [decision, setDecision] = useState({ status: 'Approved', remarks: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const response = await axios.get('/loans/pending');
            setLoans(response.data);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const handleReview = async (loanId) => {
        setLoading(true);
        setMessage('');

        try {
            await axios.put(`/loans/${loanId}/review`, decision);
            setMessage({ type: 'success', text: `Loan ${decision.status.toLowerCase()} successfully!` });
            setSelectedLoan(null);
            setDecision({ status: 'Approved', remarks: '' });
            fetchLoans();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Review failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-50">
                <h1 className="text-3xl font-bold text-scb-dark mb-8">Loan Approvals</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 card">
                        <h2 className="text-xl font-bold mb-4">Pending Loans ({loans.length})</h2>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {loans.map((loan) => (
                                <div
                                    key={loan._id}
                                    onClick={() => setSelectedLoan(loan)}
                                    className={`p-3 border rounded cursor-pointer transition ${selectedLoan?._id === loan._id ? 'bg-scb-green text-white border-scb-green' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <p className="font-semibold text-sm">{loan.userId?.fullName}</p>
                                    <p className={`text-xs ${selectedLoan?._id === loan._id ? 'text-white' : 'text-gray-600'}`}>
                                        {loan.loanType} - PKR {loan.loanAmount.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                            {loans.length === 0 && (
                                <p className="text-gray-600 text-sm">No pending loans</p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 card">
                        {selectedLoan ? (
                            <>
                                <h2 className="text-xl font-bold mb-6">Loan Details</h2>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-600">Customer</p>
                                        <p className="font-semibold">{selectedLoan.userId?.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold">{selectedLoan.userId?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Loan Type</p>
                                        <p className="font-semibold">{selectedLoan.loanType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Loan Amount</p>
                                        <p className="font-semibold text-scb-green">PKR {selectedLoan.loanAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tenure</p>
                                        <p className="font-semibold">{selectedLoan.tenure} months</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Monthly EMI</p>
                                        <p className="font-semibold">PKR {selectedLoan.monthlyInstallment?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Interest Rate</p>
                                        <p className="font-semibold">{selectedLoan.interestRate}% per annum</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Monthly Income</p>
                                        <p className="font-semibold">PKR {selectedLoan.monthlyIncome.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Employment Type</p>
                                        <p className="font-semibold">{selectedLoan.employmentType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Company</p>
                                        <p className="font-semibold">{selectedLoan.companyName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Employment Duration</p>
                                        <p className="font-semibold">{selectedLoan.employmentDuration} years</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Purpose</p>
                                        <p className="font-semibold">{selectedLoan.purpose}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-bold mb-4">Make Decision</h3>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Decision</label>
                                        <select
                                            value={decision.status}
                                            onChange={(e) => setDecision({ ...decision, status: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="Approved">Approve</option>
                                            <option value="Rejected">Reject</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Remarks (Optional)</label>
                                        <textarea
                                            value={decision.remarks}
                                            onChange={(e) => setDecision({ ...decision, remarks: e.target.value })}
                                            className="input-field"
                                            rows="3"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleReview(selectedLoan._id)}
                                        disabled={loading}
                                        className={decision.status === 'Approved' ? 'btn-primary w-full' : 'btn-danger w-full'}
                                    >
                                        {loading ? 'Processing...' : `${decision.status === 'Approved' ? 'Approve' : 'Reject'} Loan`}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-600 py-12">
                                Select a loan application to review
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanApprovals;
