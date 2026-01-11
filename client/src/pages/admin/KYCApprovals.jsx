import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const KYCApprovals = () => {
    const [kycRequests, setKYCRequests] = useState([]);
    const [selectedKYC, setSelectedKYC] = useState(null);
    const [decision, setDecision] = useState({ status: 'Approved', remarks: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchKYCRequests();
    }, []);

    const fetchKYCRequests = async () => {
        try {
            const response = await axios.get('/kyc/pending');
            setKYCRequests(response.data);
        } catch (error) {
            console.error('Error fetching KYC requests:', error);
        }
    };

    const handleReview = async (kycId) => {
        setLoading(true);
        setMessage('');

        try {
            await axios.put(`/kyc/${kycId}/verify`, decision);
            setMessage({ type: 'success', text: `KYC ${decision.status.toLowerCase()} successfully!` });
            setSelectedKYC(null);
            setDecision({ status: 'Approved', remarks: '' });
            fetchKYCRequests();
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
                <h1 className="text-3xl font-bold text-scb-dark mb-8">KYC Approvals</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* KYC List */}
                    <div className="lg:col-span-1 card">
                        <h2 className="text-xl font-bold mb-4">Pending Requests ({kycRequests.length})</h2>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {kycRequests.map((kyc) => (
                                <div
                                    key={kyc._id}
                                    onClick={() => setSelectedKYC(kyc)}
                                    className={`p-3 border rounded cursor-pointer transition ${selectedKYC?._id === kyc._id ? 'bg-scb-green text-white border-scb-green' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <p className="font-semibold text-sm">{kyc.userId?.fullName}</p>
                                    <p className={`text-xs ${selectedKYC?._id === kyc._id ? 'text-white' : 'text-gray-600'}`}>
                                        {new Date(kyc.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                            {kycRequests.length === 0 && (
                                <p className="text-gray-600 text-sm">No pending requests</p>
                            )}
                        </div>
                    </div>

                    {/* KYC Details */}
                    <div className="lg:col-span-2 card">
                        {selectedKYC ? (
                            <>
                                <h2 className="text-xl font-bold mb-6">KYC Details</h2>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-600">Customer Name</p>
                                        <p className="font-semibold">{selectedKYC.userId?.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold">{selectedKYC.userId?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">CNIC</p>
                                        <p className="font-mono font-semibold">{selectedKYC.userId?.cnic}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold">{selectedKYC.userId?.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Father's Name</p>
                                        <p className="font-semibold">{selectedKYC.fatherName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date of Birth</p>
                                        <p className="font-semibold">{new Date(selectedKYC.dateOfBirth).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Occupation</p>
                                        <p className="font-semibold">{selectedKYC.occupation}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Monthly Income</p>
                                        <p className="font-semibold">{selectedKYC.monthlyIncome}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-semibold">
                                            {selectedKYC.address?.street}, {selectedKYC.address?.city}, {selectedKYC.address?.province} - {selectedKYC.address?.postalCode}
                                        </p>
                                    </div>
                                </div>

                                {/* Decision Form */}
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
                                            placeholder="Add your comments..."
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleReview(selectedKYC._id)}
                                        disabled={loading}
                                        className={decision.status === 'Approved' ? 'btn-primary w-full' : 'btn-danger w-full'}
                                    >
                                        {loading ? 'Processing...' : `${decision.status === 'Approved' ? 'Approve' : 'Reject'} KYC`}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-600 py-12">
                                Select a KYC request to review
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KYCApprovals;
