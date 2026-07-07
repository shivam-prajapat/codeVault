import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, AlertCircle, Star, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={22} /> },
    { name: 'Repositories', path: '/repos', icon: <FolderGit2 size={22} /> },
    { name: 'Issues', path: '/issues', icon: <AlertCircle size={22} /> },
    { name: 'Starred', path: '/starred', icon: <Star size={22} /> },
    { name: 'Settings', path: '/profile', icon: <Settings size={22} /> },
  ];

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: collapsed ? 84 : 260 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 z-20 flex-shrink-0"
    >
      <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 overflow-hidden"
          >
            {/* Tiny Logo */}
            <svg viewBox="0 0 200 200" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(0,225,255,0.8)] shrink-0">
              <defs>
                <linearGradient id="neonGradientMini" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E1FF" />
                  <stop offset="100%" stopColor="#7928CA" />
                </linearGradient>
              </defs>
              <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" fill="none" stroke="url(#neonGradientMini)" strokeWidth="12" />
              <polyline points="20,60 100,100 180,60" fill="none" stroke="url(#neonGradientMini)" strokeWidth="12" />
              <line x1="100" y1="100" x2="100" y2="180" stroke="url(#neonGradientMini)" strokeWidth="12" />
            </svg>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              CodeVault
            </span>
          </motion.div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <ChevronRight size={20} className="text-gray-400" /> : <ChevronLeft size={20} className="text-gray-400" />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-codevault-accent/20 to-codevault-secondary/20 border border-codevault-accent/30 text-white shadow-[0_0_15px_rgba(0,225,255,0.15)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            <div className="flex-shrink-0 group-hover:text-codevault-accent transition-colors">
              {item.icon}
            </div>
            
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-medium tracking-wide whitespace-nowrap"
              >
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
