import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-codevault-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-codevault-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 bg-black/40 backdrop-blur-2xl border border-white/10 p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center m-4"
      >
        <motion.div 
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20"
        >
          <AlertTriangle size={40} className="text-red-500" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Terminal Not Found
        </h2>
        
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          The quadrant you are looking for does not exist or has been deleted.
          Verify the uplink address and try again.
        </p>

        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Home size={18} /> Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
