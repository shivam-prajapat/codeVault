import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Globe, Lock, Code, FileText, Terminal, Settings, GitCommit, Search, Plus } from 'lucide-react';
import { repoService } from '../../api/repo.service';
import IssueList from '../../components/issue/IssueList';

const RepoDetail = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('code');

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const data = await repoService.getRepoById(id);
        setRepo(data);
      } catch (err) {
        console.error("Failed to load repo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 animate-pulse">
        <div className="h-12 w-1/3 bg-white/5 rounded-xl mb-8"></div>
        <div className="h-10 w-full bg-white/5 rounded-xl mb-6"></div>
        <div className="h-96 w-full bg-white/5 rounded-2xl"></div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Repository not found</h2>
        <p className="text-gray-400">The repository you are looking for does not exist or you don't have access.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Book size={28} className="text-codevault-accent" />
            <h1 className="text-3xl font-bold text-white tracking-tight">{repo.name}</h1>
            <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5 ml-2 ${
              repo.visibility === 'Private' 
                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                : 'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
              {repo.visibility === 'Private' ? <Lock size={10} /> : <Globe size={10} />}
              {repo.visibility || 'Public'}
            </span>
          </div>
          <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
            {repo.description || "No description provided."}
          </p>
        </div>

        {/* Git Actions Bar */}
        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors text-white">
            <Plus size={16} /> Init
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors text-gray-300">
            <Terminal size={16} /> Commit
          </button>
          <div className="w-px h-6 bg-white/10 mx-1"></div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-codevault-accent/20 to-codevault-secondary/20 hover:from-codevault-accent/40 hover:to-codevault-secondary/40 border border-codevault-accent/30 rounded-xl text-sm font-semibold transition-all text-codevault-accent shadow-[0_0_10px_rgba(0,225,255,0.1)]">
            <Code size={16} /> Code
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'code', label: 'Code', icon: Code },
          { id: 'issues', label: 'Issues', icon: FileText, badge: repo.issues?.length },
          { id: 'commits', label: 'Commits', icon: GitCommit },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-t-lg'
            }`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? 'text-codevault-accent' : ''} />
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-1 bg-white/10 text-white px-2 py-0.5 rounded-full text-xs">
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-codevault-accent to-codevault-secondary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'code' && (
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-codevault-accent to-codevault-secondary flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                    {repo.owner?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-white hover:text-codevault-accent cursor-pointer transition-colors">
                    {repo.owner?.username}
                  </span>
                  <span className="text-gray-500">Initial commit</span>
                </div>
                <span className="text-gray-500 text-xs">just now</span>
              </div>
              
              <div className="divide-y divide-white/5">
                {repo.content?.length > 0 ? (
                  repo.content.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-colors cursor-pointer group">
                      <FileText size={18} className="text-gray-500 group-hover:text-codevault-accent" />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                        {item}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-16 text-center flex flex-col items-center justify-center">
                    <Code size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">This repository is empty.</h3>
                    <p className="text-gray-400 mb-8">Get started by creating a new file or uploading an existing project.</p>
                    
                    <div className="bg-black/50 border border-white/10 rounded-xl p-6 w-full max-w-2xl text-left font-mono text-sm">
                      <p className="text-gray-400 mb-2"># Quick setup</p>
                      <div className="text-codevault-accent mb-4">
                        <span className="text-purple-400">echo</span> "console.log('hello world')" <span className="text-purple-400">{'>'}</span> index.js<br/>
                        node index.js init {repo._id}<br/>
                        node index.js add index.js<br/>
                        node index.js commit -m "first commit"<br/>
                        node index.js push
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <IssueList repoId={repo._id} />
          )}

          {activeTab === 'commits' && (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
              <GitCommit size={32} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Commit History</h3>
              <p className="text-gray-400 text-sm">Repository history viewer coming soon.</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
              <Settings size={32} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Repository Settings</h3>
              <p className="text-gray-400 text-sm">Configuration options coming soon.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default RepoDetail;
