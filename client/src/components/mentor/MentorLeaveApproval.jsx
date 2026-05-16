import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../utils/AxiosCli';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

import LeaveSidebar from './leave/LeaveSidebar';
import LeaveList from './leave/LeaveList';
import LeaveDetails from './leave/LeaveDetails';

const MentorLeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected, all
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/leave/pending-leaves');
      // The backend returns all leaves currently. Let's ensure it's an array and sort it.
      const data = Array.isArray(response.data) ? response.data : [];
      setLeaves(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error('Failed to fetch leave requests.', { theme: 'dark' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (leaveId, decision) => {
    try {
      await axiosClient.post('/leave/approve-leave-mentor', { leaveId, decision });
      toast.success(`Leave ${decision.toLowerCase()} successfully`, { theme: 'dark' });
      // Instantly update UI
      setLeaves(prev => prev.map(l => l._id === leaveId ? { ...l, status: decision } : l));
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${decision.toLowerCase()} leave`, { theme: 'dark' });
    }
  };

  const handleDelete = async (leaveId) => {
    try {
      await axiosClient.delete(`/leave/${leaveId}`);
      toast.success('Leave record deleted', { theme: 'dark' });
      // Instantly remove from UI
      setLeaves(prev => prev.filter(l => l._id !== leaveId));
      if (selectedLeaveId === leaveId) {
        setSelectedLeaveId(null);
      }
    } catch (error) {
      toast.error('Failed to delete leave', { theme: 'dark' });
    }
  };

  // Filter Data
  const filteredLeaves = useMemo(() => {
    return leaves.filter(leave => {
      // Tab filter
      if (activeTab !== 'all' && leave.status.toLowerCase() !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          leave.studentName?.toLowerCase().includes(query) ||
          leave.rollNo?.toString().includes(query)
        );
      }
      return true;
    });
  }, [leaves, activeTab, searchQuery]);

  const selectedLeave = useMemo(() => {
    return leaves.find(l => l._id === selectedLeaveId) || null;
  }, [leaves, selectedLeaveId]);

  // Derived counts
  const counts = useMemo(() => {
    return leaves.reduce((acc, leave) => {
      const status = leave.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, { pending: 0, approved: 0, rejected: 0, all: 0 });
  }, [leaves]);

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary overflow-hidden font-poppins transition-colors duration-300">
      {/* Header */}
      <header className="flex-shrink-0 h-20 bg-surface/80 border-b border-border backdrop-blur-md px-6 flex items-center justify-between z-20 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Link to="/mentor-landing" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <FiArrowLeft className="w-5 h-5 text-text-secondary hover:text-white" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary bg-clip-text">
              Leave Approval
            </h1>
            <p className="text-xs text-text-secondary">Manage and track student leave requests</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search by name or roll..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary/50 text-sm w-64 transition-all"
            />
          </div>
          <button 
            onClick={fetchLeaves}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-text-secondary hover:text-primary"
            title="Refresh Data"
          >
            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <LeaveSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setSelectedLeaveId(null); }} 
          counts={counts} 
        />

        {/* Mobile Search (visible only on small screens) */}
        <div className="md:hidden p-4 border-b border-border bg-surface/50">
           <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary/50 text-sm w-full transition-all"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4 bg-background transition-colors duration-300 min-h-0 min-w-0">
          
          {/* List Panel */}
          <div className={`w-full md:w-5/12 lg:w-4/12 h-full overflow-hidden flex flex-col ${selectedLeaveId && 'hidden md:flex'}`}>
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <LeaveList 
                leaves={filteredLeaves} 
                selectedLeaveId={selectedLeaveId}
                onSelectLeave={setSelectedLeaveId}
              />
            )}
          </div>

          {/* Details Panel */}
          <div className={`w-full md:w-7/12 lg:w-8/12 h-full overflow-hidden flex flex-col ${!selectedLeaveId && 'hidden md:flex'}`}>
            {/* Mobile Back Button when viewing details */}
            {selectedLeaveId && (
              <button 
                className="md:hidden flex items-center gap-2 text-text-secondary hover:text-white mb-4 bg-white/5 px-4 py-2 rounded-lg"
                onClick={() => setSelectedLeaveId(null)}
              >
                <FiArrowLeft /> Back to List
              </button>
            )}
            
            <LeaveDetails 
              leave={selectedLeave} 
              onApprove={(id) => handleAction(id, 'Approved')}
              onReject={(id) => handleAction(id, 'Rejected')}
              onDelete={handleDelete}
            />
          </div>

        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" transition={Bounce} />
    </div>
  );
};

export default MentorLeaveApproval;
