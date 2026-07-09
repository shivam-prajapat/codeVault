import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/password/forgot', { email });
      setSuccess(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/password/reset', { email, otp, newPassword });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="SYSTEM RECOVERY" subtitle={step === 1 ? "Initiate password reset protocol." : "Verify identity and secure new key."}>
      
      <AnimatePresence mode="wait">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 mb-6 bg-red-500/10 border-l-4 border-red-500 text-red-400 rounded text-sm font-medium">
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 mb-6 bg-green-500/10 border-l-4 border-green-500 text-green-400 rounded text-sm font-medium">
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleRequestOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 tracking-wider">RECOVERY EMAIL</label>
              <input
                type="email"
                required
                className="w-full p-4 bg-black/30 border border-white/10 rounded-xl outline-none text-white placeholder-white/30 transition-all duration-300 focus:bg-black/50 focus:border-codevault-accent focus:shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),0_0_15px_rgba(0,225,255,0.3)] transform-translate-z-30"
                placeholder="sys@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl p-[1px]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-codevault-accent to-codevault-secondary opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
              <div className="relative bg-black/50 backdrop-blur-sm px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-black/20">
                <span className="font-bold text-white tracking-wider">
                  {loading ? 'TRANSMITTING...' : 'SEND OTP'}
                </span>
              </div>
            </button>
            <div className="text-center">
              <button type="button" onClick={() => navigate('/login')} className="text-xs text-gray-500 hover:text-white transition-colors">
                ABORT SEQUENCE
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.form key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 tracking-wider">ONE TIME PASSWORD</label>
              <input
                type="text"
                required
                className="w-full p-4 bg-black/30 border border-white/10 rounded-xl outline-none text-white placeholder-white/30 transition-all duration-300 focus:bg-black/50 focus:border-codevault-accent text-center tracking-[1em] font-mono font-bold"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400 tracking-wider">NEW ENCRYPTION KEY</label>
              <input
                type="password"
                required
                className="w-full p-4 bg-black/30 border border-white/10 rounded-xl outline-none text-white placeholder-white/30 transition-all duration-300 focus:bg-black/50 focus:border-codevault-accent focus:shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),0_0_15px_rgba(0,225,255,0.3)] transform-translate-z-30"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl p-[1px]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-codevault-accent to-codevault-secondary opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
              <div className="relative bg-black/50 backdrop-blur-sm px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-black/20">
                <span className="font-bold text-white tracking-wider">
                  {loading ? 'PROCESSING...' : 'OVERRIDE PASSWORD'}
                </span>
              </div>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPassword;
