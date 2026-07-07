import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Bot, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../../api/axios';

const AIReviewModal = ({ isOpen, onClose, repoId, repoName }) => {
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      // Fetch AI review
      const generateReview = async () => {
        try {
          const res = await api.post(`/ai/review/${repoId}`);
          setReview(res.data.review);
        } catch (err) {
          setError(err.response?.data?.error || "An error occurred while generating the review.");
        } finally {
          setLoading(false);
        }
      };
      generateReview();
    }
  }, [isOpen, repoId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-[#0f0f11] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                <Bot className="text-purple-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Code Reviewer
                  <Sparkles size={16} className="text-yellow-400" />
                </h2>
                <p className="text-sm text-gray-400">Reviewing {repoName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                  <Bot className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Analyzing Repository...</h3>
                <p className="text-gray-400">Our AI is reading your code to find bugs and optimizations.</p>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <AlertTriangle className="mx-auto text-red-400 mb-4" size={32} />
                <h3 className="text-lg font-bold text-red-400 mb-2">Analysis Failed</h3>
                <p className="text-red-300/80">{error}</p>
                <p className="text-sm text-gray-500 mt-4">Make sure you have pushed code files using the CLI before generating a review!</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none 
                prose-headings:text-white prose-headings:font-bold 
                prose-h2:text-2xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h2:mt-8
                prose-h3:text-xl prose-h3:mt-6
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                prose-code:text-purple-300 prose-code:bg-purple-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#0a0a0c] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                prose-li:text-gray-300"
              >
                <ReactMarkdown>{review}</ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-between items-center text-xs text-gray-500">
            <span>Powered by Google Gemini</span>
            <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium">
              Close Review
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIReviewModal;
