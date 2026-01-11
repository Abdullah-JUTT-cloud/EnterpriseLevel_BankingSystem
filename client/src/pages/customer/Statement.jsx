import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const Statement = () => {
    const [statements, setStatements] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({
        accountId: '',
        fromDate: '',
        toDate: '',
        deliveryMethod: 'Email',
        email: '',
        courierAddress: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [accountRes, statementsRes] = await Promise.all([
                axios.get('/accounts/my-account'),
                axios.get('/statements/my-requests')
            ]);
            setAccounts([accountRes.data]);
            setStatements(statementsRes.data);
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
            await axios.post('/statements/request', formData);
            setMessage({ type: 'success', text: 'Statement request submitted successfully!' });
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
                <h1 className="text-3xl font-bold text-scb-dark mb-8">Account Statement</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6">Request Statement</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">From Date</label>
                                <input type="date" value={formData.fromDate} onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })} className="input-field" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">To Date</label>
                                <input type="date" value={formData.toDate} onChange={(e) => setFormData({ ...formData, toDate: e.target.value })} className="input-field" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Delivery Method</label>
                                <select value={formData.deliveryMethod} onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })} className="input-field">
                                    <option value="Email">Email</option>
                                    <option value="Download">Download</option>
                                    <option value="Courier">Courier</option>
                                </select>
                            </div>
                            {formData.deliveryMethod === 'Email' && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="your.email@example.com" />
                                </div>
                            )}
                            {formData.deliveryMethod === 'Courier' && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Courier Address</label>
                                    <textarea value={formData.courierAddress} onChange={(e) => setFormData({ ...formData, courierAddress: e.target.value })} className="input-field" rows="2" required />
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Requesting...' : 'Request Statement'}
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">My Requests</h2>
                        {statements.length > 0 ? (
                            <div className="space-y-3">
                                {statements.map((stmt) => (
                                    <div key={stmt._id} className="border rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm font-semibold">{new Date(stmt.fromDate).toLocaleDateString()} - {new Date(stmt.toDate).toLocaleDateString()}</p>
                                            <StatusBadge status={stmt.status} />
                                        </div>
                                        <p className="text-sm text-gray-600">Delivery: {stmt.deliveryMethod}</p>
                                        <p className="text-xs text-gray-500">Requested: {new Date(stmt.createdAt).toLocaleDateString()}</p>
                                        {stmt.statementFileUrl && (
                                            <p className="mt-2 text-xs text-scb-green font-semibold">✓ Statement generated</p>
                                        )}
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

export default Statement;
