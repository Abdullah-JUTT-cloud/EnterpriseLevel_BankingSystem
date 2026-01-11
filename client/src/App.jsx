import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import Dashboard from './pages/customer/Dashboard';
import AccountOpening from './pages/customer/AccountOpening';
import FundTransfer from './pages/customer/FundTransfer';
import CreditCard from './pages/customer/CreditCard';
import Loan from './pages/customer/Loan';
import Statement from './pages/customer/Statement';
import DebitCard from './pages/customer/DebitCard';
import ChequeBook from './pages/customer/ChequeBook';
import Complaints from './pages/customer/Complaints';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import KYCApprovals from './pages/admin/KYCApprovals';
import LoanApprovals from './pages/admin/LoanApprovals';
import CreditCardApprovals from './pages/admin/CreditCardApprovals';
import ComplaintResolution from './pages/admin/ComplaintResolution';
import CustomerManagement from './pages/admin/CustomerManagement';
import Unauthorized from './pages/Unauthorized';

/**
 * Main App Component
 * Handles routing for the entire application
 */
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Customer Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute requiredRole="Customer">
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/account-opening" element={
                        <ProtectedRoute requiredRole="Customer">
                            <AccountOpening />
                        </ProtectedRoute>
                    } />
                    <Route path="/fund-transfer" element={
                        <ProtectedRoute requiredRole="Customer">
                            <FundTransfer />
                        </ProtectedRoute>
                    } />
                    <Route path="/credit-card" element={
                        <ProtectedRoute requiredRole="Customer">
                            <CreditCard />
                        </ProtectedRoute>
                    } />
                    <Route path="/loan" element={
                        <ProtectedRoute requiredRole="Customer">
                            <Loan />
                        </ProtectedRoute>
                    } />
                    <Route path="/statement" element={
                        <ProtectedRoute requiredRole="Customer">
                            <Statement />
                        </ProtectedRoute>
                    } />
                    <Route path="/debit-card" element={
                        <ProtectedRoute requiredRole="Customer">
                            <DebitCard />
                        </ProtectedRoute>
                    } />
                    <Route path="/cheque-book" element={
                        <ProtectedRoute requiredRole="Customer">
                            <ChequeBook />
                        </ProtectedRoute>
                    } />
                    <Route path="/complaints" element={
                        <ProtectedRoute requiredRole="Customer">
                            <Complaints />
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/kyc" element={
                        <ProtectedRoute requiredRole="Admin">
                            <KYCApprovals />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/loans" element={
                        <ProtectedRoute requiredRole="Admin">
                            <LoanApprovals />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/credit-cards" element={
                        <ProtectedRoute requiredRole="Admin">
                            <CreditCardApprovals />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/complaints" element={
                        <ProtectedRoute requiredRole="Admin">
                            <ComplaintResolution />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/customers" element={
                        <ProtectedRoute requiredRole="Admin">
                            <CustomerManagement />
                        </ProtectedRoute>
                    } />

                    {/* Default Route */}
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
