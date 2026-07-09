import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { authService } from '../../api/auth.service';
import AuthLayout from '../../components/layout/AuthLayout';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authService.login(email, password);
      login(data.userId, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="ACCESS TERMINAL" subtitle="Enter your credentials to enter the vault.">
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 bg-red-500/10 border-l-4 border-red-500 text-red-400 rounded text-sm font-medium">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400 tracking-wider">UPLINK EMAIL</label>
          <input
            type="email"
            required
            className="w-full p-4 bg-black/30 border border-white/10 rounded-xl outline-none text-white placeholder-white/30 transition-all duration-300 focus:bg-black/50 focus:border-codevault-accent focus:shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),0_0_15px_rgba(0,225,255,0.3)] transform-translate-z-30"
            placeholder="sys@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-400 tracking-wider">ENCRYPTION KEY</label>
            <Link to="/forgot-password" className="text-xs text-codevault-accent hover:text-codevault-secondary transition-colors">
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            required
            className="w-full p-4 bg-black/30 border border-white/10 rounded-xl outline-none text-white placeholder-white/30 transition-all duration-300 focus:bg-black/50 focus:border-codevault-accent focus:shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),0_0_15px_rgba(0,225,255,0.3)] transform-translate-z-30"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 mt-4 text-lg font-bold text-white uppercase tracking-wider bg-gradient-to-br from-codevault-accent to-codevault-secondary rounded-xl shadow-[0_10px_25px_rgba(121,40,202,0.4),inset_0_2px_2px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(0,225,255,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transform-translate-z-40"
        >
          {loading ? 'AUTHENTICATING...' : 'INITIALIZE UPLINK'}
        </button>
      </form>

      <p className="mt-8 text-center text-gray-400 text-sm">
        NEW USER? <Link to="/signup" className="text-codevault-accent font-semibold ml-1 hover:underline underline-offset-4 decoration-2">CREATE TERMINAL</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
