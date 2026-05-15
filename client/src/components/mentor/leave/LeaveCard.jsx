import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUser } from 'react-icons/fi';
import { avatarUrl } from '../../student/AvatarPicker'; // Import the avatar URL generator

const LeaveCard = ({ leave, isSelected, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Safe string length truncator
  const truncate = (str, n) => {
    return (str?.length > n) ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        cursor-pointer rounded-2xl p-4 transition-all duration-300 border backdrop-blur-sm
        ${isSelected 
          ? 'bg-primary/10 border-primary/50 shadow-lg shadow-primary/20' 
          : 'bg-surface/40 border-border/50 hover:bg-surface hover:border-black/20 dark:hover:border-white/20'
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black/10 dark:border-white/10 bg-black/10 dark:bg-black/50 shrink-0">
            {leave.avatarSeed ? (
              <img src={avatarUrl(leave.avatarSeed)} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                <FiUser />
              </div>
            )}
          </div>
          {leave.parentApproval && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-surface flex items-center justify-center" title="Parent Approved">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-text-primary truncate">{leave.studentName}</h4>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(leave.status)}`}>
              {leave.status}
            </span>
          </div>
          
          <p className="text-xs text-text-secondary mb-2 flex items-center gap-2">
            <span className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-[10px]">{leave.rollNo}</span>
          </p>

          <div className="flex flex-col gap-1.5 text-xs text-text-secondary/80">
            <div className="flex items-center gap-1.5 truncate">
              <FiCalendar className="shrink-0 text-indigo-400" />
              <span className="truncate">{formatDate(leave.fromDate)} - {formatDate(leave.toDate)}</span>
            </div>
            {leave.destination && (
               <div className="flex items-center gap-1.5 truncate">
                <FiMapPin className="shrink-0 text-rose-400" />
                <span className="truncate">{truncate(leave.destination, 30)}</span>
              </div>
            )}
          </div>
          
          <p className="text-xs text-text-secondary mt-3 italic bg-black/5 dark:bg-black/20 p-2 rounded-lg border border-black/5 dark:border-white/5 truncate">
            "{truncate(leave.reason, 60)}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaveCard;
