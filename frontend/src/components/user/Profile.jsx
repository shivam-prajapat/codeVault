import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Calendar, Book, Star, Activity, GitCommit, GitPullRequest, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import { userService } from '../../api/user.service';
import { repoService } from '../../api/repo.service';
import RepoCard from '../repo/RepoCard';

const Profile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser) return;
      try {
        const [profileRes, reposRes] = await Promise.all([
          userService.getUserProfile(currentUser),
          repoService.fetchUserRepos(currentUser)
        ]);
        
        setProfileData(profileRes.user);
        
        // Ensure reposRes is an array. Depending on backend it might be directly the array.
        setRepos(Array.isArray(reposRes) ? reposRes : (reposRes.repositories || []));
        
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 animate-pulse flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 bg-white/5 h-96 rounded-3xl"></div>
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="h-40 bg-white/5 rounded-3xl"></div>
          <div className="h-64 bg-white/5 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return <div className="text-center py-20 text-white">Failed to load profile.</div>;
  }

  const generateHeatmap = () => {
    const weeks = Array.from({ length: 52 }, () => Array(7).fill(0));
    
    if (!profileData?.contributions || !Array.isArray(profileData.contributions)) {
      return weeks;
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const oneDay = 24 * 60 * 60 * 1000;

    profileData.contributions.forEach(dateStr => {
      const d = new Date(dateStr);
      const diffTime = Math.abs(today - d);
      const diffDays = Math.floor(diffTime / oneDay);
      
      if (diffDays < 364) {
        const currentDayOfWeek = today.getDay();
        const totalDaysFromStart = (51 * 7) + currentDayOfWeek;
        const targetDaysFromStart = totalDaysFromStart - diffDays;
        
        if (targetDaysFromStart >= 0) {
          const wIdx = Math.floor(targetDaysFromStart / 7);
          const dIdx = targetDaysFromStart % 7;
          
          if (wIdx >= 0 && wIdx < 52 && dIdx >= 0 && dIdx < 7) {
            weeks[wIdx][dIdx] += 1;
          }
        }
      }
    });

    return weeks.map(week => 
      week.map(count => {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 5) return 2;
        return 3;
      })
    );
  };
  const heatmapData = generateHeatmap();

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: User Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/3 shrink-0"
        >
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-24 shadow-2xl">
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto rounded-full p-1 bg-gradient-to-tr from-codevault-accent to-codevault-secondary shadow-[0_0_30px_rgba(121,40,202,0.3)]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <span className="text-6xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-tr from-white to-gray-400">
                    {profileData.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-4 right-1/2 translate-x-20 w-8 h-8 bg-black rounded-full flex items-center justify-center border border-white/20">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight">{profileData.username}</h1>
              <p className="text-gray-400 text-sm mt-1">{profileData.email}</p>
            </div>

            <button className="w-full py-3 mb-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all">
              <Edit2 size={16} /> Edit Profile
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-gray-500" />
                <span className="truncate">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-gray-500" />
                <span>Earth</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Calendar size={16} className="text-gray-500" />
                <span>Joined CodeVault</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full lg:w-2/3 space-y-8"
        >
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center shadow-lg hover:shadow-[0_0_20px_rgba(0,225,255,0.1)] transition-all">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Book size={18} className="text-codevault-accent" />
                <span className="font-semibold text-sm">Repositories</span>
              </div>
              <span className="text-3xl font-bold text-white">{repos.length}</span>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center shadow-lg hover:shadow-[0_0_20px_rgba(121,40,202,0.1)] transition-all">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <GitCommit size={18} className="text-codevault-secondary" />
                <span className="font-semibold text-sm">Total Commits</span>
              </div>
              <span className="text-3xl font-bold text-white">{repos.length * 12}</span>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Activity size={18} className="text-green-500" />
                <span className="font-semibold text-sm">Activity Rank</span>
              </div>
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Top 5%</span>
            </div>
          </div>

          {/* Heatmap Simulation */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-codevault-accent" /> Contribution Activity
            </h2>
            <div className="flex gap-1 overflow-x-auto pb-4 no-scrollbar">
              {heatmapData.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1 shrink-0">
                  {week.map((day, dIdx) => {
                    const colors = [
                      'bg-white/5 border border-white/5',
                      'bg-codevault-accent/20 border border-codevault-accent/30',
                      'bg-codevault-accent/50 border border-codevault-accent/60',
                      'bg-codevault-accent border border-codevault-accent',
                    ];
                    return (
                      <div 
                        key={dIdx} 
                        className={`w-3 h-3 rounded-sm ${colors[day]} hover:scale-125 transition-transform cursor-pointer`}
                        title={`${day} contributions`}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex justify-end items-center gap-2 mt-4 text-xs text-gray-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5"></div>
                <div className="w-3 h-3 rounded-sm bg-codevault-accent/20 border border-codevault-accent/30"></div>
                <div className="w-3 h-3 rounded-sm bg-codevault-accent/50 border border-codevault-accent/60"></div>
                <div className="w-3 h-3 rounded-sm bg-codevault-accent border border-codevault-accent"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Repositories Grid */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Book className="text-codevault-secondary" /> Popular Repositories
              </h2>
            </div>
            
            {repos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map(repo => (
                  <RepoCard key={repo._id} repo={repo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <Book size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 font-semibold">No repositories yet.</p>
              </div>
            )}
          </div>
          
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;