import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Globe, Lock, Code, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { repoService } from '../../api/repo.service';
import { useAuth } from '../../context/authContext';

const CreateRepo = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'Public' // 'Public' or 'Private'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!currentUser) throw new Error("Not authenticated");
      
      const repoPayload = {
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility === 'Public', // Convert to boolean for backend
        owner: currentUser,
        content: [],
        issues: []
      };

      const response = await repoService.createRepo(repoPayload);
      
      if (response && response.repositoryID) {
        navigate(`/repo/${response.repositoryID}`);
      } else {
        navigate('/repos');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to create repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(0,225,255,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-10 text-center md:text-left border-b border-white/10 pb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
              <Code className="text-codevault-accent" />
              Create a new repository
            </h1>
            <p className="text-gray-400 text-sm">
              A repository contains all project files, including the revision history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Repository name *</label>
              <div className="relative">
                <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:bg-white/10 focus:border-codevault-accent focus:shadow-[0_0_15px_rgba(0,225,255,0.2)] transition-all outline-none"
                  placeholder="awesome-project"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Great repository names are short and memorable.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Description <span className="text-gray-600 font-normal">(optional)</span></label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:bg-white/10 focus:border-codevault-accent focus:shadow-[0_0_15px_rgba(0,225,255,0.2)] transition-all outline-none resize-none h-24"
                placeholder="What is this repository about?"
              />
            </div>

            <div className="border-t border-white/10 pt-8">
              <label className="block text-sm font-bold text-gray-300 mb-4">Visibility</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Public Option */}
                <div 
                  onClick={() => setFormData({...formData, visibility: 'Public'})}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                    formData.visibility === 'Public' 
                    ? 'border-codevault-accent bg-codevault-accent/10 shadow-[0_0_20px_rgba(0,225,255,0.15)]' 
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Globe size={24} className={formData.visibility === 'Public' ? 'text-codevault-accent' : 'text-gray-500'} />
                    <div>
                      <h4 className={`font-bold mb-1 ${formData.visibility === 'Public' ? 'text-white' : 'text-gray-300'}`}>Public</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Anyone on the internet can see this repository. You choose who can commit.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Private Option */}
                <div 
                  onClick={() => setFormData({...formData, visibility: 'Private'})}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                    formData.visibility === 'Private' 
                    ? 'border-codevault-secondary bg-codevault-secondary/10 shadow-[0_0_20px_rgba(121,40,202,0.15)]' 
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Lock size={24} className={formData.visibility === 'Private' ? 'text-codevault-secondary' : 'text-gray-500'} />
                    <div>
                      <h4 className={`font-bold mb-1 ${formData.visibility === 'Private' ? 'text-white' : 'text-gray-300'}`}>Private</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        You choose who can see and commit to this repository.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading || !formData.name}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-codevault-accent to-codevault-secondary hover:from-codevault-accent/80 hover:to-codevault-secondary/80 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,225,255,0.3)] hover:shadow-[0_0_30px_rgba(0,225,255,0.5)] transform hover:-translate-y-1 active:translate-y-0"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Book size={18} />}
                {loading ? 'Creating...' : 'Create repository'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateRepo;
