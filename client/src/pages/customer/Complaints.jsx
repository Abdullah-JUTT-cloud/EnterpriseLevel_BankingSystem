import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Account Related',
        subject: '',
        description: '',
        priority: 'Medium'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get('/complaints/my-complaints');
            setComplaints(response.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post('/complaints', formData);
            setMessage({ type: 'success', text: 'Complaint submitted successfully!' });
            setShowForm(false);
            setFormData({ category: 'Account Related', subject: '', description: '', priority: 'Medium' });
            fetchComplaints();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Submission failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-50">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-scb-dark">Complaints</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'View Complaints' : 'New Complaint'}
                    </button>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                {showForm ? (
                    <div className="card max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold mb-6">Submit Complaint</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field">
                                        <option value="Account Related">Account Related</option>
                                        <option value="Card Related">Card Related</option>
                                        <option value="Online Banking">Online Banking</option>
                                        <option value="ATM Issue">ATM Issue</option>
                                        <option value="Transaction Dispute">Transaction Dispute</option>
                                        <option value="Customer Service">Customer Service</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="input-field">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input-field" maxLength="200" required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="5" maxLength="1000" required />
                                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">My Complaints</h2>
                        {complaints.length > 0 ? (
                            <div className="space-y-4">
                                {complaints.map((complaint) => (
                                    <div key={complaint._id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold">{complaint.subject}</h3>
                                                <p className="text-xs text-gray-500">Ticket: {complaint.ticketNumber}</p>
                                            </div>
                                            <StatusBadge status={complaint.status} />
                                        </div>
                                        <div className="flex gap-4 text-sm mb-2">
                                            <span className="badge-active">{complaint.category}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${complaint.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                                                    complaint.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>{complaint.priority}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">{complaint.description}</p>
                                        {complaint.resolution && (
                                            <div className="mt-3 p-3 bg-green-50 rounded">
                                                <p className="text-sm font-semibold text-green-800 mb-1">Resolution:</p>
                                                <p className="text-sm text-green-700">{complaint.resolution}</p>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2">Submitted: {new Date(complaint.createdAt).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No complaints yet</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complaints;
