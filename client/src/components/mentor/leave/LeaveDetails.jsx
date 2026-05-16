import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUser, FiInfo, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import ActionButtons from './ActionButtons';
import { avatarUrl } from '../../student/AvatarPicker';

const LeaveDetails = ({ leave, onApprove, onReject, onDelete }) => {
  if (!leave) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-text-secondary/50 p-8 text-center min-h-[400px]">
        <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2 text-text-secondary">No Request Selected</h3>
        <p className="max-w-xs text-sm">Select a leave request from the list to view its complete details and take action.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <FiCheckCircle className="w-6 h-6 text-green-400" />;
      case 'Rejected': return <FiXCircle className="w-6 h-6 text-red-400" />;
      default: return <FiClock className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={leave._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col bg-surface/30 rounded-2xl border border-border/50 overflow-hidden shadow-2xl backdrop-blur-sm"
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border/50 bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent relative overflow-hidden shrink-0">
          {/* Background Decorative Blob */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Large Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-surface shadow-xl bg-black shrink-0">
                {leave.avatarSeed ? (
                  <img src={avatarUrl(leave.avatarSeed)} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                    <FiUser className="w-12 h-12" />
                  </div>
                )}
              </div>
              {leave.parentApproval && (
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-surface flex items-center justify-center shadow-lg" title="Parent Approved">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-2">{leave.studentName}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-text-secondary">
                <span className="bg-black/10 dark:bg-white/10 px-3 py-1 rounded-md border border-black/5 dark:border-white/5 font-mono">{leave.rollNo}</span>
                <span className="flex items-center gap-1.5 opacity-80"><FiInfo /> {leave.studentEmail}</span>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 mt-4 sm:mt-0">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-inner">
                {getStatusIcon(leave.status)}
                <span className="font-bold tracking-wide uppercase text-sm">{leave.status}</span>
              </div>
              <span className="text-xs text-text-secondary/60">
                Applied: {new Date(leave.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-5 border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 text-primary mb-3">
                <FiCalendar className="w-5 h-5" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Leave Duration</h3>
              </div>
              <div className="space-y-3 pl-8">
                <div>
                  <p className="text-xs text-text-secondary/60 uppercase">From</p>
                  <p className="text-sm font-medium">{formatDate(leave.fromDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary/60 uppercase">To</p>
                  <p className="text-sm font-medium">{formatDate(leave.toDate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-5 border border-black/5 dark:border-white/5">
               <div className="flex items-center gap-3 text-rose-400 mb-3">
                <FiMapPin className="w-5 h-5" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Destination</h3>
              </div>
              <div className="pl-8">
                <p className="text-sm font-medium text-text-primary/90 leading-relaxed">
                  {leave.destination || "Not specified by student"}
                </p>
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 border border-black/5 dark:border-white/5 relative">
            <div className="absolute top-6 left-6 text-black/5 dark:text-white/5">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary mb-4 relative z-10">Reason for Leave</h3>
            <p className="text-base text-text-primary/90 leading-relaxed relative z-10 indent-6">
              {leave.reason}
            </p>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-3 md:p-4 border-t border-border/50 bg-surface/50 shrink-0">
          <div className="flex flex-col items-center justify-center">
            {/* Always show action buttons, but their state changes internally based on leave.status */}
            <ActionButtons 
              status={leave.status}
              onApprove={() => onApprove(leave._id)}
              onReject={() => onReject(leave._id)}
              onDelete={() => onDelete(leave._id)}
            />
            <p className="text-xs text-text-secondary mt-3 text-center max-w-sm">
              {leave.status === 'Pending' 
                ? "Click to approve or reject. This action is irreversible."
                : "This request has been processed. You can delete this record."
              }
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeaveDetails;
