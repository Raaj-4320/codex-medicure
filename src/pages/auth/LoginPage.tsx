import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, profile } = useAuth();

  const performLogin = async (userEmail: string, userPassword: string) => {
    try {
      await login(userEmail, userPassword);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await performLogin(email, password);
    if (success) {
      // Navigation is handled in useEffect or after login
    } else {
      setError('User profile not found. Please use one of the demo accounts below.');
    }
    setLoading(false);
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    setError('');
    setLoading(true);
    
    const success = await performLogin(demoEmail, '123456');
    if (!success) {
      setError('Demo login failed.');
    }
    setLoading(false);
  };

  // Add navigation logic after login
  React.useEffect(() => {
    if (profile) {
      const role = profile?.role;
      switch (role) {
        case 'admin': navigate('/admin'); break;
        case 'seller': navigate('/seller'); break;
        case 'customer': navigate('/dashboard'); break;
        case 'delivery': navigate('/delivery'); break;
        default: navigate('/');
      }
    }
  }, [profile, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShieldCheck className="w-10 h-10" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 text-center mb-8">Login to access your MedSmart account</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500 uppercase tracking-wider font-semibold text-xs">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleDemoLogin('admin123@gmail.com')}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Admin Demo
              </button>
              <button 
                onClick={() => handleDemoLogin('seller123@gmail.com')}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Seller Demo
              </button>
              <button 
                onClick={() => handleDemoLogin('customer1@gmail.com')}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Customer Demo
              </button>
              <button 
                onClick={() => handleDemoLogin('del1@gmail.com')}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Delivery Demo
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account? <Link to="/register" className="text-emerald-600 font-semibold hover:underline">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
