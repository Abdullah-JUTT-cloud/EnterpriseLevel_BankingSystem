import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [pending, setPending] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                axios.get('/admin/dashboard'),
                axios.get('/admin/pending-requests')
            ]);
            setStats(statsRes.data);
            setPending(pendingRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-8">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8 bg-gray-50">
                <h1 className="text-3xl font-bold text-scb-dark mb-8">Admin Dashboard</h1>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending KYC</h3>
                        <p className="text-3xl font-bold text-yellow-600">{stats?.pendingKYC || 0}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Loans</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats?.pendingLoans || 0}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Credit Cards</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats?.pendingCreditCards || 0}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-600 text-sm font-semibold mb-2">Open Complaints</h3>
                        <p className="text-3xl font-bold text-red-600">{stats?.openComplaints || 0}</p>
                    </div>
                </div>

                {/* Recent KYC Requests */}
                <div className="card mb-6">
                    <h2 className="text-xl font-bold mb-4">Recent KYC Requests</h2>
                    {pending?.kycRequests && pending.kycRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left p-3">Customer</th>
                                        <th className="text-left p-3">Email</th>
                                        <th className="text-left p-3">CNIC</th>
                                        <th className="text-left p-3">Date</th>
                                        <th className="text-left p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pending.kycRequests.slice(0, 5).map((kyc) => (
                                        <tr key={kyc._id} className="border-b">
                                            <td className="p-3">{kyc.userId?.fullName}</td>
                                            <td className="p-3 text-sm">{kyc.userId?.email}</td>
                                            <td className="p-3 font-mono text-sm">{kyc.userId?.cnic}</td>
                                            <td className="p-3 text-sm">{new Date(kyc.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <button onClick={() => window.location.href = '/admin/kyc'} className="text-scb-green font-semibold text-sm">
                                                    Review →
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600">No pending KYC requests</p>
                    )}
                </div>

                {/* Recent Loan Applications */}
                <div className="card mb-6">
                    <h2 className="text-xl font-bold mb-4">Recent Loan Applications</h2>
                    {pending?.loans && pending.loans.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left p-3">Customer</th>
                                        <th className="text-left p-3">Loan Type</th>
                                        <th className="text-left p-3">Amount</th>
                                        <th className="text-left p-3">Tenure</th>
                                        <th className="text-left p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pending.loans.slice(0, 5).map((loan) => (
                                        <tr key={loan._id} className="border-b">
                                            <td className="p-3">{loan.userId?.fullName}</td>
                                            <td className="p-3">{loan.loanType}</td>
                                            <td className="p-3 font-semibold">PKR {loan.loanAmount.toLocaleString()}</td>
                                            <td className="p-3">{loan.tenure} months</td>
                                            <td className="p-3">
                                                <button onClick={() => window.location.href = '/admin/loans'} className="text-scb-green font-semibold text-sm">
                                                    Review →
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600">No pending loan applications</p>
                    )}
                </div>

                {/* Recent Credit Card Applications */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Recent Credit Card Applications</h2>
                    {pending?.creditCards && pending.creditCards.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left p-3">Customer</th>
                                        <th className="text-left p-3">Card Type</th>
                                        <th className="text-left p-3">Income</th>
                                        <th className="text-left p-3">Requested Limit</th>
                                        <th className="text-left p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pending.creditCards.slice(0, 5).map((card) => (
                                        <tr key={card._id} className="border-b">
                                            <td className="p-3">{card.userId?.fullName}</td>
                                            <td className="p-3">{card.cardType}</td>
                                            <td className="p-3">PKR {card.monthlyIncome.toLocaleString()}</td>
                                            <td className="p-3 font-semibold">PKR {card.requestedLimit.toLocaleString()}</td>
                                            <td className="p-3">
                                                <button onClick={() => window.location.href = '/admin/credit-cards'} className="text-scb-green font-semibold text-sm">
                                                    Review →
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600">No pending credit card applications</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
