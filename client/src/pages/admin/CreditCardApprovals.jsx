import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';

const CreditCardApprovals = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [decision, setDecision] = useState({ status: 'Approved', approvedLimit: '', remarks: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('/credit-cards/pending');
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const handleReview = async (appId) => {
        setLoading(true);
        setMessage('');

        try {
            await axios.put(`/credit-cards/${appId}/review`, decision);
            setMessage({ type: 'success', text: `Application ${decision.status.toLowerCase()} successfully!` });
            setSelectedApp(null);
            setDecision({ status: 'Approved', approvedLimit: '', remarks: '' });
            fetchApplications();
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
                <h1 className="text-3xl font-bold text-scb-dark mb-8">Credit Card Approvals</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 card">
                        <h2 className="text-xl font-bold mb-4">Pending ({applications.length})</h2>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {applications.map((app) => (
                                <div
                                    key={app._id}
                                    onClick={() => setSelectedApp(app)}
                                    className={`p-3 border rounded cursor-pointer transition ${selectedApp?._id === app._id ? 'bg-scb-green text-white border-scb-green' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <p className="font-semibold text-sm">{app.userId?.fullName}</p>
                                    <p className={`text-xs ${selectedApp?._id === app._id ? 'text-white' : 'text-gray-600'}`}>
                                        {app.cardType} Card
                                    </p>
                                </div>
                            ))}
                            {applications.length === 0 && (
                                <p className="text-gray-600 text-sm">No pending applications</p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 card">
                        {selectedApp ? (
                            <>
                                <h2 className="text-xl font-bold mb-6">Application Details</h2>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-600">Customer</p>
                                        <p className="font-semibold">{selectedApp.userId?.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold">{selectedApp.userId?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Card Type</p>
                                        <p className="font-semibold">{selectedApp.cardType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Employment Type</p>
                                        <p className="font-semibold">{selectedApp.employmentType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Monthly Income</p>
                                        <p className="font-semibold">PKR {selectedApp.monthlyIncome.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Requested Limit</p>
                                        <p className="font-semibold text-scb-green">PKR {selectedApp.requestedLimit.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Company</p>
                                        <p className="font-semibold">{selectedApp.companyName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Designation</p>
                                        <p className="font-semibold">{selectedApp.designation}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Office Address</p>
                                        <p className="font-semibold">{selectedApp.officeAddress}</p>
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
                                    {decision.status === 'Approved' && (
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-semibold mb-2">Approved Credit Limit (PKR)</label>
                                            <input
                                                type="number"
                                                value={decision.approvedLimit}
                                                onChange={(e) => setDecision({ ...decision, approvedLimit: e.target.value })}
                                                className="input-field"
                                                placeholder={selectedApp.requestedLimit}
                                            />
                                        </div>
                                    )}
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
                                        onClick={() => handleReview(selectedApp._id)}
                                        disabled={loading}
                                        className={decision.status === 'Approved' ? 'btn-primary w-full' : 'btn-danger w-full'}
                                    >
                                        {loading ? 'Processing...' : `${decision.status === 'Approved' ? 'Approve' : 'Reject'} Application`}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-600 py-12">
                                Select an application to review
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCardApprovals;
