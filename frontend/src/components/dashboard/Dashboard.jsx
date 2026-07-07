import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Book, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { userService } from '../../api/user.service';
import { repoService } from '../../api/repo.service';
import RepoCard from '../repo/RepoCard';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity ${colorClass}`}></div>
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
        <h4 className="text-3xl font-bold text-white">{value}</h4>
      </div>
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorClass.replace('bg-', 'text-')}`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);
  const [totalReposCount, setTotalReposCount] = useState(0);
  const [activeIssuesCount, setActiveIssuesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (currentUser) {
          const userRes = await userService.getUserProfile(currentUser);
          setUserData(userRes.user);

          const reposRes = await repoService.fetchUserRepos(currentUser);
          const allRepos = reposRes.repositories || [];
          setTotalReposCount(allRepos.length);
          // Get only the 3 most recent repositories (simulated by slicing)
          setRecentRepos(allRepos.slice(0, 3));

          try {
            const importIssueService = await import('../../api/issue.service');
            const userIssues = await importIssueService.issueService.getUserIssues(currentUser);
            if (Array.isArray(userIssues)) {
              setActiveIssuesCount(userIssues.filter(i => i.status === 'open').length);
            }
          } catch (e) {
            // Ignore if endpoint is not hit
          }
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
          <div>
            <div className="h-10 w-64 bg-white/10 rounded-xl mb-3"></div>
            <div className="h-4 w-48 bg-white/5 rounded-full"></div>
          </div>
          <div className="h-10 w-36 bg-white/5 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-32 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-white/10 rounded-full"></div>
                <div className="h-10 w-10 bg-white/5 rounded-xl"></div>
              </div>
              <div className="h-8 w-16 bg-white/10 rounded-xl mt-4"></div>
            </div>
          ))}
        </div>

        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-white/10 rounded-md"></div>
            <div className="h-6 w-40 bg-white/10 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => (
               <div key={i} className="h-48 bg-white/5 border border-white/10 rounded-3xl"></div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-codevault-accent to-codevault-primary">{userData?.username || 'Commander'}</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Here is what's happening in your workspace today.</p>
        </div>
        <Link 
          to="/repos"
          className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
        >
          View All Repos <ArrowRight size={16} />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard icon={Book} label="Total Repositories" value={totalReposCount} colorClass="bg-codevault-accent" />
        <StatCard icon={Activity} label="Active Issues" value={activeIssuesCount} colorClass="bg-red-500" />
        <StatCard icon={Star} label="Stars Received" value="0" colorClass="bg-yellow-500" />
        <StatCard icon={Users} label="Followers" value="0" colorClass="bg-codevault-primary" />
      </motion.div>

      {/* Recent Repositories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Book size={20} className="text-codevault-accent" /> Recent Repositories
          </h2>
        </div>

        {recentRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRepos.map((repo) => (
              <RepoCard key={repo._id} repo={repo} />
            ))}
          </div>
        ) : (
          <div className="p-10 border border-dashed border-white/10 rounded-3xl bg-white/5 text-center flex flex-col items-center">
            <Book size={32} className="text-gray-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No active projects</h3>
            <p className="text-gray-400 mb-6 max-w-sm">You haven't pushed any code recently. Create a new repository to get started.</p>
            <Link to="/repo/create" className="px-6 py-2.5 bg-gradient-to-r from-codevault-accent to-codevault-secondary rounded-full font-bold text-sm shadow-[0_0_20px_rgba(121,40,202,0.3)] hover:scale-105 transition-all">
              Create Repository
            </Link>
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default Dashboard;