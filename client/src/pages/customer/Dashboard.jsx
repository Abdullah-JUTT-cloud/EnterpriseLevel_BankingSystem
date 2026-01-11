import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

/**
 * Enhanced Functional Customer Dashboard with Clickable Cards
 */
const Dashboard = () => {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loans, setLoans] = useState([]);
    const [creditCards, setCreditCards] = useState([]);
    const [debitCards, setDebitCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [accountRes, transactionsRes, loansRes, creditCardsRes, debitCardsRes] = await Promise.all([
                axios.get('/accounts/my-account'),
                axios.get('/transactions/my-transactions'),
                axios.get('/loans/my-loans'),
                axios.get('/credit-cards/my-applications'),
                axios.get('/debit-cards/my-requests'),
            ]);
            setAccount(accountRes.data);
            setTransactions(transactionsRes.data);
            setLoans(loansRes.data);
            setCreditCards(creditCardsRes.data);
            setDebitCards(debitCardsRes.data);
        } catch (error) {
            console.error('Dashboard data fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { title: 'Fund Transfer', icon: '💸', color: 'from-blue-500 to-blue-600', path: '/fund-transfer' },
        { title: 'Credit Card', icon: '💳', color: 'from-purple-500 to-purple-600', path: '/credit-card' },
        { title: 'Apply for Loan', icon: '🏦', color: 'from-green-500 to-green-600', path: '/loan' },
        { title: 'Account Statement', icon: '📄', color: 'from-orange-500 to-orange-600', path: '/statement' },
        { title: 'Debit Card', icon: '💳', color: 'from-pink-500 to-pink-600', path: '/debit-card' },
        { title: 'Cheque Book', icon: '📝', color: 'from-indigo-500 to-indigo-600', path: '/cheque-book' },
        { title: 'Complaints', icon: '⚠️', color: 'from-red-500 to-red-600', path: '/complaints' },
        { title: 'Open Account', icon: '➕', color: 'from-teal-500 to-teal-600', path: '/account-opening' },
    ];

    if (loading) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600">Welcome back! Here's your account overview</p>
                </div>

                {/* Account Balance Card */}
                <div className="mb-8 animate-scale-in">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-dark rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <p className="text-primary-light text-sm font-medium mb-2">Account Balance</p>
                            <h2 className="text-5xl font-bold mb-4">
                                PKR {account?.balance?.toLocaleString() || '0'}
                            </h2>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                    <span className="mr-2">Account:</span>
                                    <span className="font-mono font-semibold">{account?.accountNumber || 'N/A'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-2">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${account?.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                                        }`}>
                                        {account?.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <button
                                key={action.title}
                                onClick={() => navigate(action.path)}
                                className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:scale-105 animate-slide-in overflow-hidden"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                <div className="relative z-10 text-center">
                                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                        {action.icon}
                                    </div>
                                    <p className="font-semibold text-gray-800 text-sm">{action.title}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* My Cards Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Credit Cards */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="text-2xl mr-2">💳</span>
                            My Credit Cards
                        </h3>
                        {creditCards.filter(c => c.status === 'Approved').length > 0 ? (
                            <div className="space-y-3">
                                {creditCards.filter(c => c.status === 'Approved').map((card) => (
                                    <div key={card._id} className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                                        <p className="text-sm opacity-80">{card.cardType} Card</p>
                                        <p className="text-xl font-mono font-bold my-2">{card.cardNumber || '****  **** **** ****'}</p>
                                        <p className="text-sm">Limit: PKR {card.approvedLimit?.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-sm">No active credit cards</p>
                        )}
                    </div>

                    {/* Debit Cards */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="text-2xl mr-2">💳</span>
                            My Debit Cards
                        </h3>
                        {debitCards.filter(c => ['Approved', 'Processing', 'Delivered'].includes(c.status)).length > 0 ? (
                            <div className="space-y-3">
                                {debitCards.filter(c => ['Approved', 'Processing', 'Delivered'].includes(c.status)).map((card) => (
                                    <div key={card._id} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                                        <p className="text-sm opacity-80">Debit Card</p>
                                        <p className="text-xl font-mono font-bold my-2">{card.newCardNumber || '****  **** **** ****'}</p>
                                        <div className="flex justify-between items-end">
                                            <p className="text-xs opacity-75">Linked to account: {account?.accountNumber}</p>
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded">{card.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-sm">No active debit cards</p>
                        )}
                    </div>
                </div>

                {/* Active Loans */}
                {loans.filter(l => l.status === 'Approved').length > 0 && (
                    <div className="card mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="text-2xl mr-2">🏦</span>
                            Active Loans
                        </h3>
                        <div className="space-y-4">
                            {loans.filter(l => l.status === 'Approved').map((loan) => (
                                <div key={loan._id} className="border-l-4 border-green-500 bg-green-50 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{loan.loanType}</h4>
                                            <p className="text-sm text-gray-600">Approved on {new Date(loan.approvalDate).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/loan')}
                                            className="btn-primary text-sm py-2 px-4"
                                        >
                                            Pay EMI
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Loan Amount</p>
                                            <p className="font-semibold">PKR {loan.loanAmount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Monthly EMI</p>
                                            <p className="font-semibold">PKR {loan.monthlyInstallment?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Tenure</p>
                                            <p className="font-semibold">{loan.tenure} months</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Transactions */}
                <div className="card">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="text-2xl mr-2">📊</span>
                        Recent Transactions
                    </h3>
                    {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Date</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Type</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-700">To/From</th>
                                        <th className="text-right p-3 text-sm font-semibold text-gray-700">Amount</th>
                                        <th className="text-center p-3 text-sm font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {transactions.slice(0, 5).map((txn) => (
                                        <tr key={txn._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 text-sm">{new Date(txn.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3 text-sm">Transfer</td>
                                            <td className="p-3 text-sm font-mono text-xs">{txn.toAccount}</td>
                                            <td className="p-3 text-sm text-right font-semibold text-red-600">
                                                -PKR {txn.amount.toLocaleString()}
                                            </td>
                                            <td className="p-3 text-center">
                                                <StatusBadge status={txn.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm">No transactions yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
