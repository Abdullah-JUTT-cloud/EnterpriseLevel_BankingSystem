import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const DebitCard = () => {
    const [requests, setRequests] = useState([]);
    const [account, setAccount] = useState(null);
    const [formData, setFormData] = useState({
        accountId: '',
        reason: 'Lost',
        oldCardNumber: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        urgentDelivery: false
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
                axios.get('/debit-cards/my-requests')
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
            await axios.post('/debit-cards/request', {
                ...formData,
                deliveryAddress: {
                    street: formData.street,
                    city: formData.city,
                    province: formData.province,
                    postalCode: formData.postalCode
                }
            });
            setMessage({ type: 'success', text: 'Debit card request submitted successfully!' });
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
                <h1 className="text-3xl font-bold text-scb-dark mb-8">Debit Card Replacement</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6">Request New Card</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Reason</label>
                                <select value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="input-field">
                                    <option value="Lost">Lost</option>
                                    <option value="Stolen">Stolen</option>
                                    <option value="Damaged">Damaged</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Upgrade">Upgrade</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Old Card Number (Last 4 digits)</label>
                                <input type="text" value={formData.oldCardNumber} onChange={(e) => setFormData({ ...formData, oldCardNumber: e.target.value })} className="input-field" placeholder="XXXX" maxLength="4" />
                            </div>
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
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input type="checkbox" checked={formData.urgentDelivery} onChange={(e) => setFormData({ ...formData, urgentDelivery: e.target.checked })} className="mr-2" />
                                    <span className="text-gray-700">Urgent Delivery (+PKR 500)</span>
                                </label>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Requesting...' : 'Request Card'}
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
                                            <p className="font-semibold">{req.reason}</p>
                                            <StatusBadge status={req.status} />
                                        </div>
                                        {req.newCardNumber && (
                                            <p className="text-sm font-mono text-scb-green mb-1">New Card: {req.newCardNumber}</p>
                                        )}
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

export default DebitCard;
