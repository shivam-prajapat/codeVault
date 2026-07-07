import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/30 text-green-400',
          icon: <CheckCircle2 size={18} className="text-green-500" />
        };
      case 'error':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          icon: <XCircle size={18} className="text-red-500" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
          icon: <AlertCircle size={18} className="text-yellow-500" />
        };
      default:
        return {
          bg: 'bg-codevault-accent/10 border-codevault-accent/30 text-codevault-accent',
          icon: <Info size={18} className="text-codevault-accent" />
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg min-w-[300px] max-w-md ${styles.bg}`}
    >
      <div className="flex-shrink-0">{styles.icon}</div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button 
        onClick={onClose}
        className="text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export default Toast;
