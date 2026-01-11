import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const CreditCard = () => {
    const [applications, setApplications] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        cardType: 'Gold',
        employmentType: 'Salaried',
        monthlyIncome: '',
        companyName: '',
        designation: '',
        officeAddress: '',
        requestedLimit: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('/credit-cards/my-applications');
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post('/credit-cards/apply', formData);
            setMessage({ type: 'success', text: 'Credit card application submitted successfully!' });
            setShowForm(false);
            fetchApplications();
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
                    <h1 className="text-3xl font-bold text-scb-dark">Credit Card Applications</h1>
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
                        <h2 className="text-xl font-bold mb-6">Apply for Credit Card</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Card Type</label>
                                    <select value={formData.cardType} onChange={(e) => setFormData({ ...formData, cardType: e.target.value })} className="input-field">
                                        <option value="Gold">Gold Card</option>
                                        <option value="Platinum">Platinum Card</option>
                                        <option value="Titanium">Titanium Card</option>
                                        <option value="Infinite">Infinite Card</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Employment Type</label>
                                    <select value={formData.employmentType} onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })} className="input-field">
                                        <option value="Salaried">Salaried</option>
                                        <option value="Self-Employed">Self-Employed</option>
                                        <option value="Business Owner">Business Owner</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Monthly Income (PKR)</label>
                                    <input type="number" value={formData.monthlyIncome} onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })} className="input-field" min="25000" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Requested Credit Limit (PKR)</label>
                                    <input type="number" value={formData.requestedLimit} onChange={(e) => setFormData({ ...formData, requestedLimit: e.target.value })} className="input-field" min="50000" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
                                    <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Designation</label>
                                    <input type="text" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="input-field" required />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Office Address</label>
                                <textarea value={formData.officeAddress} onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })} className="input-field" rows="2" required />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">My Applications</h2>
                        {applications.length > 0 ? (
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div key={app._id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg">{app.cardType} Card</h3>
                                                <p className="text-sm text-gray-600">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <StatusBadge status={app.status} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <p><span className="font-semibold">Employment:</span> {app.employmentType}</p>
                                            <p><span className="font-semibold">Monthly Income:</span> PKR {app.monthlyIncome.toLocaleString()}</p>
                                            <p><span className="font-semibold">Requested Limit:</span> PKR {app.requestedLimit.toLocaleString()}</p>
                                            {app.approvedLimit && <p><span className="font-semibold">Approved Limit:</span> PKR {app.approvedLimit.toLocaleString()}</p>}
                                        </div>
                                        {app.cardNumber && (
                                            <p className="mt-2 text-sm"><span className="font-semibold">Card Number:</span> {app.cardNumber}</p>
                                        )}
                                        {app.remarks && (
                                            <p className="mt-2 text-sm text-gray-600"><span className="font-semibold">Remarks:</span> {app.remarks}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No applications yet</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreditCard;
