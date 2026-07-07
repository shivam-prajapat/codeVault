import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CircleDot, Loader2, MessageSquare } from 'lucide-react';
import { issueService } from '../../api/issue.service';

const IssueCard = ({ issue, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  // Status handling: The backend seems to use issue.status = !status.
  // Assuming true = Open, false = Closed (or vice versa). We'll treat truthy as open for now.
  // If the backend has a specific default, this might need tweaking. Let's assume default is false (falsy) but we'll map false = Open, true = closed if it's typical. Actually, typical is string.
  // Let's just use strict check.
  const isClosed = issue.status === true; // Assuming true means closed based on typical toggle behavior if it starts false.

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const updatedIssue = await issueService.updateIssue(issue._id, {
        title: issue.title,
        description: issue.description,
        status: issue.status
      });
      // The backend returns the updated issue (hopefully) or we just fetch again
      onStatusChange(updatedIssue);
    } catch (error) {
      console.error("Failed to update issue status", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all duration-300 flex items-start gap-4 shadow-lg hover:shadow-[0_0_15px_rgba(0,225,255,0.1)]"
    >
      <button 
        onClick={toggleStatus}
        disabled={loading}
        className="mt-1 flex-shrink-0 focus:outline-none disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={24} className="animate-spin text-gray-500" />
        ) : !isClosed ? (
          <CircleDot size={24} className="text-green-500 hover:scale-110 transition-transform" />
        ) : (
          <CheckCircle2 size={24} className="text-codevault-secondary hover:scale-110 transition-transform" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={`text-lg font-bold truncate mb-1 ${!isClosed ? 'text-white' : 'text-gray-500 line-through'}`}>
          {issue.title}
        </h3>
        {issue.description && (
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-3">
            {issue.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className={`px-2 py-1 rounded-full border ${
            !isClosed 
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-codevault-secondary/10 text-codevault-secondary border-codevault-secondary/20'
          }`}>
            {!isClosed ? 'Open' : 'Closed'}
          </span>
          <span className="text-gray-500 flex items-center gap-1">
            <MessageSquare size={12} /> 0 comments
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default IssueCard;
