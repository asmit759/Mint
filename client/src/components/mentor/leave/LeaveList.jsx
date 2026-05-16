import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeaveCard from './LeaveCard';
import { FiInbox } from 'react-icons/fi';

const LeaveList = ({ leaves, selectedLeaveId, onSelectLeave }) => {
  if (!leaves || leaves.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-surface/20 rounded-2xl border border-border/50">
        <FiInbox className="w-16 h-16 text-text-secondary/30 mb-4" />
        <h3 className="text-xl font-medium text-text-secondary mb-2">No leaves found</h3>
        <p className="text-sm text-text-secondary/60">There are no leave requests matching this filter.</p>
      </div>
    );
  }

  return (
    <div data-lenis-prevent className="h-full overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
      <AnimatePresence>
        {leaves.map((leave, index) => (
          <motion.div
            key={leave._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <LeaveCard 
              leave={leave} 
              isSelected={selectedLeaveId === leave._id}
              onClick={() => onSelectLeave(leave._id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LeaveList;
