import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { issueService } from '../../api/issue.service';
import IssueCard from './IssueCard';
import CreateIssueModal from './CreateIssueModal';

const IssueList = ({ repoId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchIssues();
  }, [repoId]);

  const fetchIssues = async () => {
    try {
      const data = await issueService.getIssuesByRepo(repoId);
      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load issues:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCreated = (newIssue) => {
    fetchIssues();
  };

  const handleStatusChange = (updatedIssue) => {
    fetchIssues();
  };

  const filteredIssues = issues.filter(issue => 
    issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    issue.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-gray-500 focus:bg-white/10 focus:border-codevault-accent focus:shadow-[0_0_15px_rgba(0,225,255,0.1)] outline-none transition-all"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transform hover:-translate-y-0.5"
        >
          <Plus size={18} /> New Issue
        </button>
      </div>

      {/* List */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between text-sm font-semibold text-gray-400">
          <span>{issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}</span>
        </div>
        
        <div className="p-4 space-y-3">
          {loading ? (
            // Skeleton Loading
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 h-24 rounded-2xl border border-white/5"></div>
            ))
          ) : filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <IssueCard 
                key={issue._id} 
                issue={issue} 
                onStatusChange={handleStatusChange} 
              />
            ))
          ) : (
            <div className="p-16 text-center">
              <FileText size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {searchQuery ? "No matching issues" : "No issues yet"}
              </h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                {searchQuery 
                  ? "We couldn't find any issues matching your search query." 
                  : "Issues are used to track bugs, features, or tasks. Create one to get started."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CreateIssueModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        repoId={repoId}
        onIssueCreated={handleIssueCreated}
      />
      
    </div>
  );
};

export default IssueList;
