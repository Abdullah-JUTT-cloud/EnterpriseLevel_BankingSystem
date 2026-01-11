import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Beautiful Animated Register Page
 */
const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        cnic: '',
        role: 'Customer'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-12 text-center animate-scale-in border border-white/20">
                    <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Registration Successful!</h2>
                    <p className="text-white/80">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-0 -left-4"></div>
                <div className="absolute w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 -right-4"></div>
                <div className="absolute w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-0 left-20"></div>
            </div>

            <div className="max-w-2xl w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-white rounded-full p-3 shadow-2xl animate-scale-in">
                            <img src="/logo.jpg" alt="Bank Logo" className="w-full h-full" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-primary-light">Join SCB Pakistan Banking Portal</p>
                </div>

                {/* Registration Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 animate-slide-in">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-sm animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-white font-medium text-sm">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-light transition-all duration-300 backdrop-blur-sm mt-1"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-white font-medium text-sm">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-light transition-all duration-300 backdrop-blur-sm mt-1"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-white font-medium text-sm">CNIC</label>
                                <input
                                    type="text"
                                    value={formData.cnic}
                                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-light transition-all duration-300 backdrop-blur-sm mt-1"
                                    placeholder="12345-1234567-1"
                                    pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-white font-medium text-sm">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-light transition-all duration-300 backdrop-blur-sm mt-1"
                                    placeholder="03001234567"
                                    pattern="03[0-9]{9}"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-white font-medium text-sm">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-light transition-all duration-300 backdrop-blur-sm mt-1"
                                    placeholder="••••••••"
                                    minLength="6"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-white font-medium text-sm">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-light transition-all duration-300 backdrop-blur-sm mt-1"
                                >
                                    <option value="Customer" className="bg-dark text-white">Customer</option>
                                    <option value="Admin" className="bg-dark text-white">Admin</option>
                                    <option value="Staff" className="bg-dark text-white">Staff</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-light to-secondary hover:from-primary hover:to-primary-light text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/80 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-light hover:text-white font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-white/60 text-sm mt-6">
                    © 2024 SCB Pakistan. Secure Banking Portal
                </p>
            </div>
        </div>
    );
};

export default Register;
