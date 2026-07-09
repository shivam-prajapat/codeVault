import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Database, Activity, GitCommit, ChevronRight, Lock, Code } from 'lucide-react';

const Landing = () => {
  const [terminalStep, setTerminalStep] = useState(0);

  // Simple terminal typing simulator
  useEffect(() => {
    const timer1 = setTimeout(() => setTerminalStep(1), 1000); // codevault init
    const timer2 = setTimeout(() => setTerminalStep(2), 2500); // output
    const timer3 = setTimeout(() => setTerminalStep(3), 4000); // codevault add .
    const timer4 = setTimeout(() => setTerminalStep(4), 5500); // codevault commit
    const timer5 = setTimeout(() => setTerminalStep(5), 7000); // output
    const timer6 = setTimeout(() => setTerminalStep(6), 8500); // codevault push
    const timer7 = setTimeout(() => setTerminalStep(7), 10000); // output
    const timer8 = setTimeout(() => setTerminalStep(0), 14000); // loop
    
    return () => {
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); 
      clearTimeout(timer4); clearTimeout(timer5); clearTimeout(timer6); 
      clearTimeout(timer7); clearTimeout(timer8);
    };
  }, [terminalStep === 0]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-codevault-accent/30 relative">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-codevault-accent/20 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-codevault-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-codevault-accent to-codevault-primary flex items-center justify-center">
            <GitCommit size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">CodeVault</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">
            Log In
          </Link>
          <Link to="/signup" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-bold transition-all hover:scale-105 active:scale-95">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-codevault-accent/10 border border-codevault-accent/20 text-codevault-accent text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-codevault-accent animate-pulse"></span>
            Version 1.0 is Live
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Your Git,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-codevault-accent via-purple-400 to-codevault-primary">
              Reimagined.
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed">
            A custom version control system built from the ground up. Track your projects locally with our powerful CLI and sync seamlessly to the CodeVault cloud.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/signup" className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-codevault-accent to-codevault-primary text-white font-bold rounded-xl shadow-[0_0_30px_rgba(121,40,202,0.3)] hover:shadow-[0_0_40px_rgba(121,40,202,0.5)] transition-all hover:-translate-y-1 group">
              Start Building <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-colors">
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* Right: Terminal Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-[4/3] max-w-[600px] mx-auto lg:mx-0"
        >
          {/* Decorative elements behind terminal */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-codevault-accent via-codevault-secondary to-codevault-primary rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
          
          <div className="relative h-full bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-sm">
            {/* Terminal Header */}
            <div className="h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto text-xs text-gray-500 flex items-center gap-2">
                <Terminal size={12} /> bash ~ shiva@codevault
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 flex-1 text-gray-300 flex flex-col gap-3 overflow-hidden">
              
              {/* Step 1: Init */}
              {terminalStep >= 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-codevault-accent font-bold">~</span> $ <span className="text-white">codevault init</span>
                </motion.div>
              )}
              {terminalStep >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400">
                  Initialized empty CodeVault repository in .gitVault/
                </motion.div>
              )}

              {/* Step 2: Add */}
              {terminalStep >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-codevault-accent font-bold">~</span> $ <span className="text-white">codevault add index.js</span>
                </motion.div>
              )}

              {/* Step 3: Commit */}
              {terminalStep >= 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-codevault-accent font-bold">~</span> $ <span className="text-white">codevault commit "Initial launch"</span>
                </motion.div>
              )}
              {terminalStep >= 5 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400">
                  Commit 1b252e76 created with message: "Initial launch"
                </motion.div>
              )}

              {/* Step 4: Push */}
              {terminalStep >= 6 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-codevault-accent font-bold">~</span> $ <span className="text-white">codevault push</span>
                </motion.div>
              )}
              {terminalStep >= 7 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 flex flex-col gap-1">
                  <span>Uploading index.js to CodeVault Cloud...</span>
                  <span>Syncing to MongoDB...</span>
                  <span className="text-blue-400 font-bold mt-1">Push completed successfully!</span>
                </motion.div>
              )}

              {/* Blinking Cursor */}
              {terminalStep < 7 && (
                <motion.div 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2.5 h-4 bg-white/70 inline-block align-middle ml-1"
                ></motion.div>
              )}

            </div>
          </div>
        </motion.div>

      </main>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 border-t border-white/5 bg-white/[0.02] py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Modern Workflows</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need to manage your code, seamlessly integrated between your local terminal and the cloud.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Terminal className="text-codevault-accent" size={24} />}
              title="Custom CLI Tool"
              description="Interact with your repositories entirely from your terminal. Init, add, commit, and push exactly like Git."
            />
            <FeatureCard 
              icon={<Database className="text-blue-400" size={24} />}
              title="Cloud Synchronization"
              description="Your code is securely uploaded to Supabase storage and indexed in MongoDB for lightning-fast retrieval."
            />
            <FeatureCard 
              icon={<Activity className="text-green-400" size={24} />}
              title="Real Heatmap Tracking"
              description="Visualize your productivity. Every repo created and commit pushed dynamically lights up your profile's heatmap."
            />
          </div>
        </div>
      </section>

    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/5 transition-colors"
  >
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/5">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default Landing;
