import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

const ComplaintResolution = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [update, setUpdate] = useState({ status: 'In Progress', resolution: '', priority: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get('/complaints/all');
            setComplaints(response.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const handleUpdate = async (complaintId) => {
        setLoading(true);
        setMessage('');

        try {
            await axios.put(`/complaints/${complaintId}`, update);
            setMessage({ type: 'success', text: 'Complaint updated successfully!' });
            setSelectedComplaint(null);
            setUpdate({ status: 'In Progress', resolution: '', priority: '' });
            fetchComplaints();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-50">
                <h1 className="text-3xl font-bold text-scb-dark mb-8">Complaint Resolution</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 card">
                        <h2 className="text-xl font-bold mb-4">All Complaints ({complaints.length})</h2>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {complaints.map((complaint) => (
                                <div
                                    key={complaint._id}
                                    onClick={() => setSelectedComplaint(complaint)}
                                    className={`p-3 border rounded cursor-pointer transition ${selectedComplaint?._id === complaint._id ? 'bg-scb-green text-white border-scb-green' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <p className="font-semibold text-sm mb-1">{complaint.subject}</p>
                                    <div className="flex items-center gap-2">
                                        {selectedComplaint?._id !== complaint._id && (
                                            <StatusBadge status={complaint.status} />
                                        )}
                                        <span className={`text-xs ${selectedComplaint?._id === complaint._id ? 'text-white' : 'text-gray-600'}`}>
                                            {complaint.ticketNumber}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {complaints.length === 0 && (
                                <p className="text-gray-600 text-sm">No complaints</p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 card">
                        {selectedComplaint ? (
                            <>
                                <h2 className="text-xl font-bold mb-6">Complaint Details</h2>
                                <div className="mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Ticket Number</p>
                                            <p className="font-mono font-semibold">{selectedComplaint.ticketNumber}</p>
                                        </div>
                                        <StatusBadge status={selectedComplaint.status} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Customer</p>
                                            <p className="font-semibold">{selectedComplaint.userId?.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-semibold">{selectedComplaint.userId?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Category</p>
                                            <p className="font-semibold">{selectedComplaint.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Priority</p>
                                            <p className="font-semibold">{selectedComplaint.priority}</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-1">Subject</p>
                                        <p className="font-semibold">{selectedComplaint.subject}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-1">Description</p>
                                        <p className="text-sm bg-gray-50 p-3 rounded">{selectedComplaint.description}</p>
                                    </div>
                                    {selectedComplaint.resolution && (
                                        <div className="mb-4 p-3 bg-green-50 rounded">
                                            <p className="text-sm font-semibold text-green-800 mb-1">Current Resolution:</p>
                                            <p className="text-sm text-green-700">{selectedComplaint.resolution}</p>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500">Submitted: {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-bold mb-4">Update Complaint</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Status</label>
                                            <select
                                                value={update.status}
                                                onChange={(e) => setUpdate({ ...update, status: e.target.value })}
                                                className="input-field"
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                                            <select
                                                value={update.priority}
                                                onChange={(e) => setUpdate({ ...update, priority: e.target.value })}
                                                className="input-field"
                                            >
                                                <option value="">No Change</option>
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Urgent">Urgent</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-semibold mb-2">Resolution/Notes</label>
                                        <textarea
                                            value={update.resolution}
                                            onChange={(e) => setUpdate({ ...update, resolution: e.target.value })}
                                            className="input-field"
                                            rows="4"
                                            placeholder="Describe the resolution or add notes..."
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleUpdate(selectedComplaint._id)}
                                        disabled={loading}
                                        className="btn-primary w-full"
                                    >
                                        {loading ? 'Updating...' : 'Update Complaint'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-600 py-12">
                                Select a complaint to review
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintResolution;
