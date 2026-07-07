import React from 'react';
import { motion } from 'framer-motion';
import { Book, Lock, Globe, CircleDot } from 'lucide-react';
import { Link } from 'react-router-dom';

const RepoCard = ({ repo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full perspective-1200"
    >
      <Link to={`/repo/${repo._id}`} className="block h-full preserve-3d">
        <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 group-hover:border-codevault-accent/50 group-hover:shadow-[0_10px_30px_rgba(0,225,255,0.15)] flex flex-col justify-between overflow-hidden relative">
          
          {/* Subtle gradient flash on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-codevault-accent/0 to-codevault-secondary/0 group-hover:from-codevault-accent/10 group-hover:to-codevault-secondary/10 transition-all duration-500 z-0"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4 transform-translate-z-30">
              <div className="flex items-center gap-3 text-codevault-accent group-hover:text-white transition-colors overflow-hidden pr-2">
                <Book size={20} className="shrink-0" />
                <h3 className="text-lg font-bold truncate tracking-wide">{repo.name}</h3>
              </div>
              
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5 shrink-0 ${
                repo.visibility === 'Private' 
                  ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                  : 'bg-green-500/10 text-green-400 border-green-500/20'
              }`}>
                {repo.visibility === 'Private' ? <Lock size={10} /> : <Globe size={10} />}
                {repo.visibility || 'Public'}
              </span>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2 mb-6 transform-translate-z-30">
              {repo.description || 'No description provided.'}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-xs font-medium text-gray-500 transform-translate-z-40 mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5 group-hover:text-codevault-accent transition-colors">
              <CircleDot size={14} />
              <span>{repo.issues?.length || 0} Issues</span>
            </div>
            
            {repo.content?.length > 0 && (
              <div className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                <span className="w-2.5 h-2.5 rounded-full bg-codevault-secondary shadow-[0_0_8px_#7928CA]"></span>
                <span>Contains Code</span>
              </div>
            )}
          </div>
          
        </div>
      </Link>
    </motion.div>
  );
};

export default RepoCard;
