import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiXCircle, FiList } from 'react-icons/fi';

const LeaveSidebar = ({ activeTab, setActiveTab, counts }) => {
  const tabs = [
    { id: 'pending', label: 'Pending Leaves', icon: FiClock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { id: 'approved', label: 'Approved Leaves', icon: FiCheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 'rejected', label: 'Rejected Leaves', icon: FiXCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
    { id: 'all', label: 'All Leaves', icon: FiList, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  ];

  return (
    <div className="w-full md:w-20 lg:w-24 flex-shrink-0 flex flex-row md:flex-col justify-center items-center gap-4 p-2 md:p-4 bg-surface/20 backdrop-blur-xl border-r md:border-r-0 md:border-r-transparent border-border/50 md:shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)] relative z-10 h-auto md:h-full overflow-x-auto md:overflow-visible overflow-y-visible">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={`
              relative flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl transition-all duration-300 min-w-[64px] md:min-w-full
              ${isActive ? 'bg-primary/20 border-primary/40 border shadow-lg shadow-primary/20 backdrop-blur-md' : 'bg-transparent border border-transparent hover:bg-black/5 dark:hover:bg-white/5'}
            `}
          >
            <div className={`p-2 rounded-xl transition-colors duration-300 ${isActive ? tab.bg : 'bg-black/5 dark:bg-white/5'}`}>
              <Icon className={`w-6 h-6 md:w-7 md:h-7 ${isActive ? tab.color : 'text-text-secondary group-hover:text-text-primary'}`} />
            </div>
            
            {/* Number Badge */}
            <div className={`absolute -top-2 -right-2 md:top-2 md:right-2 min-w-[24px] h-6 px-1.5 flex items-center justify-center rounded-full text-xs font-bold border-2 border-surface shadow-sm ${isActive ? 'bg-primary text-white' : 'bg-surface text-text-secondary border-border'}`}>
              {counts[tab.id] || 0}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default LeaveSidebar;
