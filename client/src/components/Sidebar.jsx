import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Sidebar Component with Enhanced Blue Theme
 * Navigation sidebar for Customer and Admin dashboards
 */
const Sidebar = () => {
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const customerLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/account-opening', label: 'Open Account', icon: '➕' },
        { path: '/fund-transfer', label: 'Fund Transfer', icon: '💸' },
        { path: '/credit-card', label: 'Credit Card', icon: '💳' },
        { path: '/loan', label: 'Loan Application', icon: '🏦' },
        { path: '/statement', label: 'Account Statement', icon: '📄' },
        { path: '/debit-card', label: 'Debit Card', icon: '💳' },
        { path: '/cheque-book', label: 'Cheque Book', icon: '📝' },
        { path: '/complaints', label: 'Complaints', icon: '⚠️' },
    ];

    const adminLinks = [
        { path: '/admin', label: 'Dashboard', icon: '🏠' },
        { path: '/admin/kyc', label: 'KYC Approvals', icon: '✅' },
        { path: '/admin/loans', label: 'Loan Approvals', icon: '🏦' },
        { path: '/admin/credit-cards', label: 'Credit Cards', icon: '💳' },
        { path: '/admin/complaints', label: 'Complaints', icon: '⚠️' },
        { path: '/admin/customers', label: 'Customers', icon: '👥' },
    ];

    const links = isAdmin ? adminLinks : customerLinks;

    return (
        <div className="h-screen w-64 bg-gradient-to-b from-dark via-dark-light to-dark text-white flex flex-col shadow-2xl">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-primary-dark to-primary">
                <div className="flex items-center space-x-3 animate-fade-in">
                    <img
                        src="/logo.jpg"
                        alt="Bank Logo"
                        className="w-10 h-10 rounded-full bg-white p-1 shadow-lg animate-pulse-slow"
                    />
                    <div>
                        <h1 className="text-xl font-bold">SCB Pakistan</h1>
                        <p className="text-xs text-primary-light">{user?.role} Portal</p>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-700 bg-dark-light animate-slide-in">
                <p className="text-sm font-semibold truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                    {links.map((link, index) => (
                        <li key={link.path} className="animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                            <Link
                                to={link.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive(link.path)
                                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg scale-105'
                                    : 'hover:bg-dark-light hover:translate-x-1 text-gray-300'
                                    }`}
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span className="text-sm font-medium">{link.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700 bg-dark-light">
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    <span>🚪</span>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
