import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const ChequeBook = () => {
    const [requests, setRequests] = useState([]);
    const [account, setAccount] = useState(null);
    const [formData, setFormData] = useState({
        accountId: '',
        numberOfLeaves: '25',
        collectionMethod: 'Home Delivery',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        branchName: 'Karachi Main Branch'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [accountRes, requestsRes] = await Promise.all([
                axios.get('/accounts/my-account'),
                axios.get('/cheque-books/my-requests')
            ]);
            setAccount(accountRes.data);
            setRequests(requestsRes.data);
            if (accountRes.data) {
                setFormData({ ...formData, accountId: accountRes.data._id });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post('/cheque-books/request', {
                ...formData,
                deliveryAddress: formData.collectionMethod === 'Home Delivery' ? {
                    street: formData.street,
                    city: formData.city,
                    province: formData.province,
                    postalCode: formData.postalCode
                } : undefined
            });
            setMessage({ type: 'success', text: 'Cheque book request submitted successfully!' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Request failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-50">
                <h1 className="text-3xl font-bold text-scb-dark mb-8">Cheque Book Request</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6">Request Cheque Book</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Number of Leaves</label>
                                <select value={formData.numberOfLeaves} onChange={(e) => setFormData({ ...formData, numberOfLeaves: e.target.value })} className="input-field">
                                    <option value="10">10 Leaves</option>
                                    <option value="25">25 Leaves</option>
                                    <option value="50">50 Leaves</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Collection Method</label>
                                <select value={formData.collectionMethod} onChange={(e) => setFormData({ ...formData, collectionMethod: e.target.value })} className="input-field">
                                    <option value="Home Delivery">Home Delivery</option>
                                    <option value="Branch Pickup">Branch Pickup</option>
                                </select>
                            </div>
                            {formData.collectionMethod === 'Home Delivery' ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
                                        <input type="text" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} className="input-field" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">City</label>
                                            <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="input-field" required />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Province</label>
                                            <select value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="input-field" required>
                                                <option value="">Select</option>
                                                <option value="Punjab">Punjab</option>
                                                <option value="Sindh">Sindh</option>
                                                <option value="KPK">KPK</option>
                                                <option value="Balochistan">Balochistan</option>
                                                <option value="Islamabad">Islamabad</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Branch</label>
                                    <select value={formData.branchName} onChange={(e) => setFormData({ ...formData, branchName: e.target.value })} className="input-field">
                                        <option value="Karachi Main Branch">Karachi Main Branch</option>
                                        <option value="Lahore Branch">Lahore Branch</option>
                                        <option value="Islamabad Branch">Islamabad Branch</option>
                                    </select>
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Requesting...' : 'Request Cheque Book'}
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">My Requests</h2>
                        {requests.length > 0 ? (
                            <div className="space-y-3">
                                {requests.map((req) => (
                                    <div key={req._id} className="border rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-semibold">{req.numberOfLeaves} Leaves</p>
                                            <StatusBadge status={req.status} />
                                        </div>
                                        <p className="text-sm text-gray-600">Collection: {req.collectionMethod}</p>
                                        <p className="text-xs text-gray-500">Requested: {new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No requests yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChequeBook;
