import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiRefreshCw, FiArrowLeft, FiClock, FiCheckCircle, FiList } from 'react-icons/fi';
import { MdDelete } from "react-icons/md";
import { BiUser } from 'react-icons/bi';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';

import { mentorLogout } from '../../store/authSlice';
import axiosClient from '../../utils/AxiosCli';
import ThemeToggle from '../ThemeToggle';

// --- Subcomponents ---

const SidebarTabs = ({ activeTab, setActiveTab, counts }) => {
  const tabs = [
    { id: 'unresolved', label: 'Pending', icon: FiClock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 'resolved', label: 'Resolved', icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'all', label: 'All Grievances', icon: FiList, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  ];

  return (
    <div data-lenis-prevent className="w-full md:w-20 lg:w-24 flex-shrink-0 flex flex-row md:flex-col justify-center items-center gap-4 p-2 md:p-4 bg-surface/20 backdrop-blur-xl border-b md:border-b-0 md:border-r border-border/50 md:shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)] relative z-10 h-auto md:h-full overflow-x-auto md:overflow-visible overflow-y-visible">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={`
              relative flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl transition-all duration-300 min-w-[64px] md:min-w-full
              ${isActive ? 'bg-primary/20 border-primary/40 border shadow-lg shadow-primary/20 backdrop-blur-md' : 'bg-transparent border border-transparent hover:bg-black/5 dark:hover:bg-white/5'}
            `}
          >
            <div className={`p-2 rounded-xl transition-colors duration-300 ${isActive ? tab.bg : 'bg-black/5 dark:bg-white/5'}`}>
              <Icon className={`w-6 h-6 md:w-7 md:h-7 ${isActive ? tab.color : 'text-text-secondary hover:text-text-primary'}`} />
            </div>
            <div className={`absolute -top-2 -right-2 md:top-2 md:right-2 min-w-[24px] h-6 px-1.5 flex items-center justify-center rounded-full text-xs font-bold border-2 border-surface shadow-sm ${isActive ? 'bg-primary text-white' : 'bg-surface text-text-secondary border-border'}`}>
              {counts[tab.id] || 0}
            </div>
          </button>
        );
      })}
    </div>
  );
};

const GrievanceList = ({ grievances, selectedId, onSelect }) => {
  if (grievances.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface/30 rounded-2xl border border-border">
        <FiList className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">No grievances found</p>
      </div>
    );
  }

  return (
    <div data-lenis-prevent className="h-full overflow-y-auto pr-2 pb-2 space-y-3 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
      {grievances.map(g => (
        <button
          key={g._id}
          onClick={() => onSelect(g._id)}
          className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
            selectedId === g._id
              ? 'bg-primary/20 border-primary/50 shadow-md '
              : 'bg-surface border-border hover:border-primary/20 hover:bg-surface/80'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-text-primary text-sm truncate pr-2">
              {g.student?.name || 'Unknown'}
            </h3>
            <span className={`text-[10px] px-2 py-1 rounded-full whitespace-nowrap ${
              g.resolved ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}>
              {g.resolved ? 'Resolved' : 'Pending'}
            </span>
          </div>
          <p className="text-xs text-text-secondary truncate mb-2">
            {g.message}
          </p>
          <div className="flex items-center justify-between text-[10px] text-text-secondary">
            <span>Roll: {g.student?.roll_no || 'N/A'}</span>
            <span>{new Date(g.createdAt).toLocaleDateString()}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

const GrievanceDetails = ({ grievance, onResolve, resolving, onDelete, deleting }) => {
  const [response, setResponse] = useState('');

  useEffect(() => {
    setResponse('');
  }, [grievance]);

  if (!grievance) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-text-secondary bg-surface/30 rounded-2xl border border-border">
        <FiList className="w-16 h-16 mb-4 opacity-10" />
        <p>Select a grievance to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface/50 rounded-2xl border border-border overflow-hidden">
      {/* Header Info */}
      <div className="p-6 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
              <BiUser className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{grievance.student?.name || 'Unknown'}</h2>
              <p className="text-sm text-text-secondary">{grievance.student?.email_id || 'N/A'}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
            grievance.resolved 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
          }`}>
            {grievance.resolved ? 'Resolved' : 'Pending'}
          </span>
        </div>
        <div className="flex gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <BiUser /> Roll: {grievance.student?.roll_no || 'N/A'}
          </span>
          <span className="flex items-center gap-1">
            <FiClock /> {new Date(grievance.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div>
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Student Grievance
          </h3>
          <div className="bg-surface border border-border rounded-xl p-4 text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
            {grievance.message}
          </div>
        </div>

        {grievance.resolved ? (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-3">
                Your Response
              </h3>
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                {grievance.response}
              </div>
            </div>
            <div className="flex justify-center pt-4 border-t border-border mt-4">
              <div className="group relative">
                <button 
                  onClick={() => onDelete(grievance._id)}
                  disabled={deleting}
                  className="p-3 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm border border-red-500/20 disabled:opacity-50 disabled:hover:bg-red-500/10 disabled:hover:text-red-500 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {deleting ? <FaSpinner className="w-6 h-6 animate-spin" /> : <MdDelete className="w-6 h-6" />}
                </button>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 origin-bottom scale-0 px-3 rounded-lg border border-border bg-surface py-1.5 text-xs font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100 text-text-primary whitespace-nowrap pointer-events-none">
                  Delete Record
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              Reply
            </h3>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
              rows={5}
              className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl p-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none transition-all"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onResolve(grievance._id, response)}
                disabled={!response.trim() || resolving}
                className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resolving ? (
                  <><FaSpinner className="animate-spin" /> Resolving...</>
                ) : (
                  <><FaPaperPlane /> Send Response</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---

const StudentGrievances = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('unresolved'); // 'all', 'unresolved', 'resolved'
  const [searchQuery, setSearchQuery] = useState('');

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    if (!isAuthenticated || role !== 'mentor') {
      toast.error('Unauthorized access. Please login as mentor.', { theme: 'dark' });
      navigate('/login');
      return;
    }
    fetchGrievances();
  }, [isAuthenticated, role]);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/mentorRoutes/viewAll', getAuthConfig());
      
      if (res.data && Array.isArray(res.data.grievances)) {
        const sorted = res.data.grievances.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setGrievances(sorted);
      } else {
        setGrievances([]);
      }
    } catch (err) {
      console.error('Error fetching grievances:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.', { theme: 'dark' });
        dispatch(mentorLogout());
        navigate('/login');
      } else {
        toast.error('Failed to fetch grievances', { theme: 'dark' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id, responseText) => {
    try {
      setResolving(true);
      await axiosClient.post(
        '/mentorRoutes/resolve',
        {
          grievanceId: id,
          response: responseText,
        },
        getAuthConfig()
      );
      
      setGrievances(prev =>
        prev.map(g =>
          g._id === id
            ? { ...g, resolved: true, response: responseText }
            : g
        )
      );
      
      toast.success('Grievance resolved successfully!', { theme: 'dark' });
    } catch (err) {
      console.error('Error resolving grievance:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.', { theme: 'dark' });
        dispatch(mentorLogout());
        navigate('/login');
      } else {
        toast.error('Failed to resolve grievance', { theme: 'dark' });
      }
    } finally {
      setResolving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await axiosClient.delete(`/mentorRoutes/delete/${id}`, getAuthConfig());
      
      setGrievances(prev => prev.filter(g => g._id !== id));
      setSelectedGrievanceId(null);
      toast.success('Grievance deleted successfully!', { theme: 'dark' });
    } catch (err) {
      console.error('Error deleting grievance:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.', { theme: 'dark' });
        dispatch(mentorLogout());
        navigate('/login');
      } else {
        toast.error('Failed to delete grievance', { theme: 'dark' });
      }
    } finally {
      setDeleting(false);
    }
  };

  const filteredGrievances = useMemo(() => {
    return grievances.filter(g => {
      if (activeTab === 'resolved' && !g.resolved) return false;
      if (activeTab === 'unresolved' && g.resolved) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          g.student?.name?.toLowerCase().includes(query) ||
          g.student?.roll_no?.toString().includes(query) ||
          g.message?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [grievances, activeTab, searchQuery]);

  const selectedGrievance = useMemo(() => {
    return grievances.find(g => g._id === selectedGrievanceId) || null;
  }, [grievances, selectedGrievanceId]);

  const counts = useMemo(() => {
    return grievances.reduce((acc, g) => {
      if (g.resolved) acc.resolved++;
      else acc.unresolved++;
      acc.all++;
      return acc;
    }, { unresolved: 0, resolved: 0, all: 0 });
  }, [grievances]);

  if (!isAuthenticated || role !== 'mentor') {
    return null;
  }

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
              Student Grievances
            </h1>
            <p className="text-xs text-text-secondary hidden sm:block">Manage and resolve student concerns</p>
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
              className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary/50 text-sm w-64 transition-all text-text-primary"
            />
          </div>
          <button 
            onClick={fetchGrievances}
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
        <SidebarTabs 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setSelectedGrievanceId(null); }} 
          counts={counts} 
        />

        {/* Mobile Search */}
        <div className="md:hidden p-4 border-b border-border bg-surface/50">
           <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary/50 text-sm w-full transition-all text-text-primary"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4 bg-background transition-colors duration-300 min-h-0 min-w-0">
          
          {/* List Panel */}
          <div className={`w-full md:w-5/12 lg:w-4/12 flex-1 overflow-hidden flex flex-col ${selectedGrievanceId && 'hidden md:flex'}`}>
            {loading && grievances.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <GrievanceList 
                grievances={filteredGrievances} 
                selectedId={selectedGrievanceId}
                onSelect={setSelectedGrievanceId}
              />
            )}
          </div>

          {/* Details Panel */}
          <div className={`w-full md:w-7/12 lg:w-8/12 flex-1 overflow-hidden flex flex-col ${!selectedGrievanceId && 'hidden md:flex'}`}>
            {selectedGrievanceId && (
              <button 
                className="md:hidden flex items-center gap-2 text-text-secondary hover:text-white mb-4 bg-white/5 px-4 py-2 rounded-lg"
                onClick={() => setSelectedGrievanceId(null)}
              >
                <FiArrowLeft /> Back to List
              </button>
            )}
            
            <GrievanceDetails 
              grievance={selectedGrievance} 
              onResolve={handleResolve}
              resolving={resolving}
              onDelete={handleDelete}
              deleting={deleting}
            />
          </div>

        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" transition={Bounce} />
    </div>
  );
};

export default StudentGrievances;
