import { useState, useMemo } from "react";
import axiosClient from "../../utils/AxiosCli";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GlowingButton from '../smallComp/GlowingButton';
// Helper for initials
const getInitials = (name) => {
  if (!name || name === "Unknown") return "?";
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
};

const getStatusColor = (pct) => {
  if (pct >= 75) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (pct >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-red-500 bg-red-500/10 border-red-500/20";
};

const overallAvg = (data) =>
  data.length ? (data.reduce((s, x) => s + parseFloat(x.percentage), 0) / data.length).toFixed(1) : "—";

/* ─── sub-components ──────────────────────────────────────────────────────── */

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
        autoComplete="off"
      />
    </div> 
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-400">{label}</label>
      <select 
        value={value} 
        onChange={onChange} 
        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23525252'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function CircularProgress({ pct }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  
  const colorClass = pct >= 75 ? "text-emerald-500" : pct >= 60 ? "text-amber-500" : "text-red-500";

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width="60" height="60" viewBox="0 0 60 60" className="transform -rotate-90">
        <circle cx="30" cy="30" r={r} fill="none" stroke="currentColor" className="text-neutral-800" strokeWidth="4" />
        <motion.circle
          cx="30" cy="30" r={r}
          fill="none"
          stroke="currentColor"
          className={colorClass}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <span className={`absolute text-[11px] font-semibold ${colorClass}`}>{pct}%</span>
    </div>
  );
}

function SubjectCard({ item, index }) {
  const pct = parseFloat(item.percentage);
  const statusColor = getStatusColor(pct);
  const needMore = pct < 75 ? Math.ceil((0.75 * parseFloat(item.totalClasses) - parseFloat(item.present)) / 0.25) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-5 rounded-xl border border-neutral-800/60 bg-neutral-900/40 hover:bg-neutral-800/40 transition-colors flex flex-col gap-5"
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

      <div className="flex items-center gap-5">
        <CircularProgress pct={pct} />
        <div className="flex-1 grid grid-cols-3 gap-2">
           <div className="flex flex-col gap-0.5">
             <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Present</span>
             <span className="font-medium text-emerald-500 text-sm">{item.present}</span>
           </div>
           <div className="flex flex-col gap-0.5">
             <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Absent</span>
             <span className="font-medium text-red-500 text-sm">{item.absent}</span>
           </div>
           <div className="flex flex-col gap-0.5">
             <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Total</span>
             <span className="font-medium text-neutral-300 text-sm">{item.totalClasses}</span>
           </div>
        </div>
      </div>
      
      {needMore > 0 && (
         <div className="mt-auto text-[11px] text-amber-500/90 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
           Attend {needMore} more consecutive classes to reach 75%
         </div>
      )}
    </motion.div>
  );
}

function SummaryStrip({ data }) {
  const avg = overallAvg(data);
  const safe = data.filter((x) => parseFloat(x.percentage) >= 75).length;
  const risk = data.filter((x) => parseFloat(x.percentage) < 75).length;

  const cards = [
    { label: "Overall Average", value: avg + "%", color: parseFloat(avg) >= 75 ? "text-emerald-500" : "text-amber-500" },
    { label: "Total Subjects", value: data.length, color: "text-neutral-200" },
    { label: "On Track", value: safe, color: "text-emerald-500" },
    { label: "At Risk", value: risk, color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-4 flex flex-col gap-1"
        >
          <span className={`text-2xl font-semibold tracking-tight ${c.color}`}>{c.value}</span>
          <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">{c.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function StudentProfile({ student }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 flex items-center gap-5"
    >
      <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xl font-medium text-neutral-300 shrink-0">
        {getInitials(student.name)}
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-neutral-100 tracking-tight">{student.name}</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-400 text-[11px] font-medium border border-neutral-700/50">
            {student.rollNo}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-400 text-[11px] font-medium border border-neutral-700/50">
            {student.semester}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[11px] font-medium border border-blue-500/20">
            {student.program}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function TableView({ data }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full overflow-x-auto border border-neutral-800/60 rounded-xl bg-neutral-900/40"
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-neutral-500">Subject</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-neutral-500">Faculty</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-neutral-500">Total</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-neutral-500">Present</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-neutral-500">Absent</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-neutral-500">%</th>
            <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-medium text-neutral-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50">
          {data.map((item, i) => {
            const pct = parseFloat(item.percentage);
            const statusColor = getStatusColor(pct);
            
            return (
              <motion.tr 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="hover:bg-neutral-800/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-neutral-300">{item.subject}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">{item.faculty}</td>
                <td className="px-4 py-3 text-sm text-neutral-400">{item.totalClasses}</td>
                <td className="px-4 py-3 text-sm text-emerald-500">{item.present}</td>
                <td className="px-4 py-3 text-sm text-red-500">{item.absent}</td>
                <td className="px-4 py-3 text-sm font-semibold text-neutral-200">{item.percentage}%</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${statusColor}`}>
                    {pct >= 75 ? "Safe" : pct >= 60 ? "Watch" : "Risk"}
                  </span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}

/* ─── main component ──────────────────────────────────────────────────────── */

function LoadingGame() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="py-12 flex flex-col items-center justify-center border border-neutral-800 border-dashed rounded-2xl bg-neutral-900/20 w-full"
    >
      <div className="flex flex-col items-center w-full max-w-2xl px-4">
        <div className="flex justify-between w-full mb-4 px-2">
           <h3 className="text-sm font-medium tracking-wide text-neutral-400 animate-pulse">
             Fetching your attendance... Play while you wait!
           </h3>
           <div className="flex gap-1.5 items-center h-5">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
           </div>
        </div>
        <div className="w-full bg-[#f7f7f7] rounded-xl shadow-2xl border border-neutral-800 overflow-hidden relative" style={{ height: "250px" }}>
          <iframe 
            src="https://chromedino.com/" 
            frameBorder="0" 
            scrolling="no" 
            width="100%" 
            height="100%" 
            loading="lazy"
            style={{ position: "absolute", width: "100%", height: "100%", zIndex: 999 }}
            title="Chrome Dino Game"
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
}

export default function StudentAttendance() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    year: "2025-2026",
    session: "Spring",
  });
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  // Controls state
  const [sortMode, setSortMode] = useState("default"); // default, highest, lowest
  const [filterMode, setFilterMode] = useState("all"); // all, low
  const [viewMode, setViewMode] = useState("grid"); // grid, table

  const set = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));

  const handleFetch = async () => {
    if (!formData.userId || !formData.password) {
      setError("Roll number and password are required.");
      return;
    }
    setError("");
    setLoading(true);
    setFetched(false);
    try {
      const res = await axiosClient.post("/studentFacility/attendance", formData);
      if (res.data && res.data.data) {
         setStudentProfile(res.data.data.student);
         setAttendanceData(res.data.data.attendance || []);
      } else {
         setAttendanceData([]);
         setStudentProfile(null);
      }
      setFetched(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch attendance. Check your credentials or server.");
      setAttendanceData([]);
      setStudentProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      const avg = overallAvg(attendanceData);
      await axiosClient.post("/studentFacility/shareAttendance", {
        overallAttendance: avg + "%",
        attendanceDetails: attendanceData
      }, { withCredentials: true });
      toast.success("Attendance shared with mentor!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to share attendance");
    } finally {
      setSharing(false);
    }
  };

  // Memoized sorted and filtered data
  const processedData = useMemo(() => {
    let result = [...attendanceData];

    if (filterMode === "low") {
      result = result.filter(item => parseFloat(item.percentage) < 75);
    }

    if (sortMode === "highest") {
      result.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
    } else if (sortMode === "lowest") {
      result.sort((a, b) => parseFloat(a.percentage) - parseFloat(b.percentage));
    }

    return result;
  }, [attendanceData, sortMode, filterMode]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-blue-500/30 selection:text-blue-200 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px bg-neutral-800 flex-1"></div>
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">Student Portal</span>
            <div className="h-px bg-neutral-800 flex-1"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center text-text-primary">
            Attendance Dashboard
          </h1>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-5 sm:p-6 mb-10 shadow-xl shadow-black/50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <InputField label="Roll No." placeholder="e.g. 23052231" value={formData.userId} onChange={set("userId")} />
            <InputField label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={set("password")} />
            <SelectField label="Academic Year" value={formData.year} onChange={set("year")} options={["2025-2026", "2024-2025", "2023-2024"]} />
            <SelectField label="Session" value={formData.session} onChange={set("session")} options={["Spring", "Autumn"]} />
          </div>

          <div className="w-full mt-2 flex justify-center pointer-events-auto">
             <div className={`w-full flex justify-center ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
               <GlowingButton onClick={handleFetch} text={loading ? 'Syncing...' : 'Sync Attendance'} />
             </div>
          </div>

          {error && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg text-center">
               {error}
             </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading && <LoadingGame key="loading" />}

          {!loading && fetched && processedData && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              
              {studentProfile && (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                  <div className="flex-1">
                    <StudentProfile student={studentProfile} />
                  </div>
                  {attendanceData.length > 0 && (
                    <div className="shrink-0 w-full sm:w-auto self-start">
                      <div className={`w-full sm:w-56 ${sharing ? 'opacity-70 pointer-events-none' : ''}`}>
                        <GlowingButton onClick={handleShare} text={sharing ? 'Sharing...' : 'Share with Mentor'} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <SummaryStrip data={attendanceData} />

              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex gap-3 w-full sm:w-auto">
                  <select 
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-300 focus:outline-none focus:border-neutral-600 transition-colors appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23525252'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '12px', paddingRight: '28px' }}
                  >
                    <option value="default">Default Order</option>
                    <option value="highest">Highest % First</option>
                    <option value="lowest">Lowest % First</option>
                  </select>

                  <select 
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-300 focus:outline-none focus:border-neutral-600 transition-colors appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23525252'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '12px', paddingRight: '28px' }}
                  >
                    <option value="all">All Subjects</option>
                    <option value="low">Needs Attention ({'<'}75%)</option>
                  </select>
                </div>

                <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1 shrink-0 self-end sm:self-auto">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'grid' ? 'bg-neutral-800 text-text-primary' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    Grid
                  </button>
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'table' ? 'bg-neutral-800 text-text-primary' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    Table
                  </button>
                </div>
              </div>

              {/* Data Presentation */}
              {processedData.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {processedData.map((item, i) => (
                      <SubjectCard key={item.subject + i} item={item} index={i} />
                    ))}
                  </div>
                ) : (
                  <TableView data={processedData} />
                )
              ) : (
                 <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center border border-neutral-800 border-dashed rounded-2xl bg-neutral-900/20"
                >
                  <div className="text-neutral-600 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-neutral-400 font-medium">No subjects match your filter.</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {!loading && fetched && attendanceData.length === 0 && !studentProfile && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center border border-neutral-800 border-dashed rounded-2xl bg-neutral-900/20"
            >
              <div className="text-neutral-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm text-neutral-400 font-medium">No data found. Check credentials or try another session.</p>
            </motion.div>
          )}

          {!fetched && !loading && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-500 mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-sm text-neutral-400 font-medium tracking-wide">Enter your credentials to load attendance.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </div>
  );
}