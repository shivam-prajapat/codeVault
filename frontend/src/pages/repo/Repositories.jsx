import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FolderGit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { repoService } from '../../api/repo.service';
import { useAuth } from '../../context/authContext';
import RepoCard from '../../components/repo/RepoCard';

const Repositories = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        if (currentUser) {
          const data = await repoService.fetchUserRepos(currentUser);
          setRepos(data.repositories || []);
        }
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [currentUser]);

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
            Repositories
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Manage and organize your codebase.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Find a repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-black/40 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white outline-none placeholder-gray-500 transition-all focus:bg-black/60 focus:border-codevault-accent focus:shadow-[0_0_15px_rgba(0,225,255,0.15)]"
            />
          </div>
          
          <Link to="/repo/create" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-codevault-accent to-codevault-secondary text-white text-sm font-bold rounded-full shadow-[0_0_20px_rgba(121,40,202,0.4)] hover:shadow-[0_0_30px_rgba(0,225,255,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 shrink-0">
            <Plus size={18} />
            <span className="hidden sm:block">New Repository</span>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 rounded-2xl bg-white/5 border border-white/5 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredRepos.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredRepos.map((repo) => (
                <RepoCard key={repo._id} repo={repo} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-white/10 rounded-3xl bg-black/20 backdrop-blur-sm"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FolderGit2 size={32} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No repositories found</h3>
              <p className="text-gray-400 max-w-sm mx-auto mb-8">
                {searchQuery 
                  ? `We couldn't find anything matching "${searchQuery}".` 
                  : "You haven't created any repositories yet. Get started by initializing a new one."}
              </p>
              {!searchQuery && (
                <Link to="/repo/create" className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10">
                  <Plus size={18} /> Create Your First Repo
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Repositories;
