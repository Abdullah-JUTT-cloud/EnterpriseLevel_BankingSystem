import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from '../../api/axios';

/**
 * Admin Customer Management Page
 */
const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [balanceForm, setBalanceForm] = useState({ amount: '', operation: 'add' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/admin/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleBalanceAdjustment = async () => {
        if (!selectedCustomer || !balanceForm.amount) return;

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.put(`/admin/customers/${selectedCustomer._id}/balance`, {
                amount: parseFloat(balanceForm.amount),
                operation: balanceForm.operation
            });

            setMessage({ type: 'success', text: response.data.message });
            setBalanceForm({ amount: '', operation: 'add' });
            fetchCustomers();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to adjust balance' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-8">
                    Customer Management
                </h1>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl animate-slide-in ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer List */}
                    <div className="lg:col-span-1 card max-h-[700px] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">All Customers ({customers.length})</h2>
                        <div className="space-y-2">
                            {customers.map((customer) => (
                                <div
                                    key={customer._id}
                                    onClick={() => setSelectedCustomer(customer)}
                                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedCustomer?._id === customer._id
                                            ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg scale-105'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <p className="font-semibold">{customer.fullName}</p>
                                    <p className={`text-sm ${selectedCustomer?._id === customer._id ? 'text-white/80' : 'text-gray-600'}`}>
                                        {customer.email}
                                    </p>
                                    {customer.account && (
                                        <p className={`text-xs font-mono mt-1 ${selectedCustomer?._id === customer._id ? 'text-white/90' : 'text-gray-500'}`}>
                                            A/C: {customer.account.accountNumber}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="lg:col-span-2 card">
                        {selectedCustomer ? (
                            <>
                                <h2 className="text-xl font-bold mb-6">Customer Details</h2>

                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-gradient-to-br from-blue-50 to-primary/5 rounded-xl">
                                    <div>
                                        <p className="text-sm text-gray-600">Full Name</p>
                                        <p className="font-semibold text-lg">{selectedCustomer.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold">{selectedCustomer.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">CNIC</p>
                                        <p className="font-mono font-semibold">{selectedCustomer.cnic}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold">{selectedCustomer.phone}</p>
                                    </div>
                                    {selectedCustomer.account && (
                                        <>
                                            <div>
                                                <p className="text-sm text-gray-600">Account Number</p>
                                                <p className="font-mono font-semibold">{selectedCustomer.account.accountNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Account Status</p>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedCustomer.account.status === 'Active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                                    }`}>
                                                    {selectedCustomer.account.status}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-600">Current Balance</p>
                                                <p className="text-3xl font-bold text-primary">
                                                    PKR {selectedCustomer.account.balance?.toLocaleString()}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Balance Adjustment */}
                                {selectedCustomer.account && (
                                    <div className="border-t pt-6">
                                        <h3 className="font-bold text-lg mb-4">Adjust Account Balance</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">Operation</label>
                                                <select
                                                    value={balanceForm.operation}
                                                    onChange={(e) => setBalanceForm({ ...balanceForm, operation: e.target.value })}
                                                    className="input-field"
                                                >
                                                    <option value="add">Add Balance</option>
                                                    <option value="deduct">Deduct Balance</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 font-semibold mb-2">Amount (PKR)</label>
                                                <input
                                                    type="number"
                                                    value={balanceForm.amount}
                                                    onChange={(e) => setBalanceForm({ ...balanceForm, amount: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Enter amount"
                                                    min="1"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleBalanceAdjustment}
                                            disabled={loading || !balanceForm.amount}
                                            className={`w-full ${balanceForm.operation === 'add' ? 'btn-primary' : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300'
                                                } disabled:opacity-50`}
                                        >
                                            {loading ? 'Processing...' : `${balanceForm.operation === 'add' ? 'Add' : 'Deduct'} PKR ${balanceForm.amount || '0'}`}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                <p className="text-xl">Select a customer to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerManagement;
