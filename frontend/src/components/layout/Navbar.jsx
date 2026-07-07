import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { userService } from '../../api/user.service';
import { useSocket } from '../../context/socketContext';

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const { currentUser, logout } = useAuth();
  const { isConnected } = useSocket();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (currentUser) {
          const res = await userService.getUserProfile(currentUser);
          setUserData(res.user);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUser();
  }, [currentUser]);

  return (
    <header className="h-20 px-6 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md z-10 shrink-0">
      {/* Left side: Search */}
      <div className="flex-1 max-w-xl">
        <motion.div 
          animate={{ width: isSearchFocused ? '100%' : '70%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search repositories, issues, or users..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white outline-none placeholder-gray-500 transition-all focus:bg-white/10 focus:border-codevault-accent focus:shadow-[0_0_15px_rgba(0,225,255,0.15)]"
          />
        </motion.div>
      </div>

      {/* Right side: Notifications & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Connection Status */}
        <div 
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 bg-white/5 cursor-default"
          title={isConnected ? "Real-time active" : "Connecting..."}
        >
          <Wifi size={14} className={isConnected ? "text-green-500" : "text-gray-500 animate-pulse"} />
          <span className="hidden sm:inline">{isConnected ? 'Live' : 'Offline'}</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          {isConnected && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-codevault-primary rounded-full animate-pulse border border-black"></span>
          )}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-codevault-accent to-codevault-secondary flex items-center justify-center text-sm font-bold shadow-inner">
              {userData?.username ? userData.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-sm font-medium hidden md:block">
              {userData?.username || 'User'}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-48 bg-codevault-background border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
              >
                <div className="px-4 py-3 border-b border-white/10 mb-1 bg-white/5">
                  <p className="text-sm font-semibold truncate">{userData?.username}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{userData?.email}</p>
                </div>
                
                <Link 
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User size={16} /> Profile
                </Link>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-1"
                >
                  <LogOut size={16} /> Disconnect
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
