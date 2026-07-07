import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-codevault-background overflow-hidden p-6">
      {/* Dynamic 3D Grid Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute w-[200vw] h-[200vh] -top-[50%] -left-[50%] bg-[linear-gradient(rgba(121,40,202,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(121,40,202,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [transform:perspective(500px)_rotateX(60deg)] animate-[gridMove_20s_linear_infinite]" />
      </div>

      {/* Animated Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(121,40,202,0.4)_0%,rgba(0,0,0,0)_70%)] blur-[100px] z-0 opacity-60 animate-[drift_15s_infinite_alternate_ease-in-out]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(0,225,255,0.3)_0%,rgba(0,0,0,0)_70%)] blur-[100px] z-0 opacity-60 animate-[drift_15s_infinite_alternate_ease-in-out] [animation-delay:-7s]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md perspective-1200"
      >
        <div className="bg-codevault-card backdrop-blur-xl border border-codevault-border rounded-3xl p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] preserve-3d group hover:[transform:rotateX(2deg)_rotateY(-2deg)] transition-transform duration-500">
          
          <div className="text-center mb-8 transform-translate-z-40">
            {/* Custom 3D SVG Logo */}
            <div className="relative w-20 h-20 mx-auto mb-6 animate-[floatLogo_6s_ease-in-out_infinite] preserve-3d">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(121,40,202,0.5)]">
                <defs>
                  <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E1FF" />
                    <stop offset="100%" stopColor="#7928CA" />
                  </linearGradient>
                </defs>
                <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" fill="none" stroke="url(#neonGradient)" strokeWidth="8" />
                <polyline points="20,60 100,100 180,60" fill="none" stroke="url(#neonGradient)" strokeWidth="8" />
                <line x1="100" y1="100" x2="100" y2="180" stroke="url(#neonGradient)" strokeWidth="8" />
                <polygon points="100,50 140,70 140,110 100,130 60,110 60,70" fill="url(#neonGradient)" opacity="0.5" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-gray-400 mt-2 text-sm">{subtitle}</p>}
          </div>

          <div className="transform-translate-z-30">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
