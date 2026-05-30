import { useState, useEffect, useMemo } from "react";
import axiosClient from "../../utils/AxiosCli";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiX, FiCheckCircle, FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GlowingButton from '../smallComp/GlowingButton';

const getStatusColor = (pct) => {
  if (pct >= 75) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (pct >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-red-500 bg-red-500/10 border-red-500/20";
};

const formatTimeLeft = (expiresAt) => {
  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
  }
  return `${hours}h ${mins}m`;
};

const formatTimeAgo = (sharedAt) => {
  const diff = new Date() - new Date(sharedAt);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours === 0) {
      const mins = Math.floor(diff / (1000 * 60));
      return `${mins} mins ago`;
  }
  return `${hours} hours ago`;
};

function SubjectCard({ item, index }) {
  const pct = parseFloat(item.percentage);
  const statusColor = getStatusColor(pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-4 rounded-xl border border-neutral-800/60 bg-neutral-900/40 flex flex-col gap-3"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-neutral-200 text-sm leading-snug mb-1">{item.subject}</h3>
          <p className="text-xs text-neutral-500 line-clamp-1">{item.faculty}</p>
        </div>
        <div className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide border ${statusColor}`}>
          {pct >= 75 ? "Safe" : pct >= 60 ? "Watch" : "Risk"}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
         <span className={`text-lg font-bold ${pct >= 75 ? "text-emerald-500" : pct >= 60 ? "text-amber-500" : "text-red-500"}`}>{pct}%</span>
         <div className="flex gap-4 text-xs">
            <div className="flex flex-col items-center"><span className="text-neutral-500 text-[10px]">Present</span><span className="text-emerald-500">{item.present}</span></div>
            <div className="flex flex-col items-center"><span className="text-neutral-500 text-[10px]">Absent</span><span className="text-red-500">{item.absent}</span></div>
            <div className="flex flex-col items-center"><span className="text-neutral-500 text-[10px]">Total</span><span className="text-neutral-300">{item.totalClasses}</span></div>
         </div>
      </div>
    </motion.div>
  );
}

export default function StudentAttendanceReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/mentorRoutes/sharedAttendance");
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch shared attendance", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      const res = await axiosClient.delete(`/mentorRoutes/sharedAttendance/${id}`);
      if (res.data.success) {
        toast.success("Report deleted successfully");
        setReports(reports.filter((r) => r._id !== id));
        if (selectedReport?._id === id) {
          setSelectedReport(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete report");
      console.error("Failed to delete shared attendance", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px bg-neutral-800 flex-1"></div>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">Mentor Portal</span>
            <div className="h-px bg-neutral-800 flex-1"></div>
          </div>
          <div className="flex justify-between items-center">
             <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
               Student Attendance Reports
             </h1>
             <div className="w-32">
                <GlowingButton text="Refresh" onClick={fetchReports} />
             </div>
          </div>
        </motion.div>

        {loading ? (
           <div className="flex justify-center items-center py-20">
              <div className="flex gap-2">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              </div>
           </div>
        ) : reports.length === 0 ? (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center border border-neutral-800 border-dashed rounded-2xl bg-neutral-900/20">
              <p className="text-sm text-neutral-400 font-medium">No active shared attendance reports.</p>
              <p className="text-xs text-neutral-500 mt-2">Reports shared by students will appear here for 48 hours.</p>
           </motion.div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, i) => (
                 <motion.div
                    key={report._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedReport(report)}
                    className="p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 hover:bg-neutral-800/50 cursor-pointer transition-colors group relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-[40px] group-hover:bg-indigo-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h3 className="text-lg font-semibold text-neutral-100">{report.studentName}</h3>
                          <p className="text-xs text-neutral-500 font-medium">{report.rollNumber}</p>
                       </div>
                       <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800">
                          <FiClock className="text-neutral-500 w-3 h-3" />
                          <span className="text-[10px] font-medium text-neutral-400">{formatTimeLeft(report.expiresAt)} left</span>
                       </div>
                    </div>
                    
                    <div className="flex items-end justify-between mt-6">
                       <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Overall Avg</p>
                          <p className={`text-2xl font-bold ${parseFloat(report.overallAttendance) >= 75 ? 'text-emerald-500' : 'text-red-500'}`}>{report.overallAttendance}</p>
                       </div>
                       <p className="text-[10px] text-neutral-500">Shared {formatTimeAgo(report.sharedAt)}</p>
                    </div>
                 </motion.div>
              ))}
           </div>
        )}

         <AnimatePresence>
            {selectedReport && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setSelectedReport(null)}
                     className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  />
                  <motion.div
                     initial={{ opacity: 0, y: 40, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 20, scale: 0.95 }}
                     className="relative w-full max-w-3xl max-h-full bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                  >
                    <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 shrink-0">
                       <div>
                          <h2 className="text-xl font-bold text-neutral-100">{selectedReport.studentName}'s Report</h2>
                          <p className="text-xs text-neutral-500">{selectedReport.rollNumber} • Shared {formatTimeAgo(selectedReport.sharedAt)}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <button onClick={() => handleDeleteReport(selectedReport._id)} className="p-2 rounded-full hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition-colors" title="Delete Report">
                             <FiTrash2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => setSelectedReport(null)} className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors" title="Close">
                             <FiX className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                       <div className="flex gap-4 mb-6">
                          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center">
                             <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Overall Attendance</p>
                             <p className={`text-3xl font-bold ${parseFloat(selectedReport.overallAttendance) >= 75 ? 'text-emerald-500' : 'text-red-500'}`}>{selectedReport.overallAttendance}</p>
                          </div>
                          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center">
                             <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Total Subjects</p>
                             <p className="text-3xl font-bold text-neutral-200">{selectedReport.attendanceDetails.length}</p>
                          </div>
                       </div>
                       
                       <h3 className="text-sm font-semibold text-neutral-300 mb-4 uppercase tracking-wider">Subject Breakdown</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedReport.attendanceDetails.map((item, idx) => (
                             <SubjectCard key={idx} item={item} index={idx} />
                          ))}
                       </div>
                    </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
        <ToastContainer position="top-center" autoClose={3000} theme="dark" />
      </div>
    </div>
  );
}
