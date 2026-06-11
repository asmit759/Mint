// src/components/student/leave/StudentLeaveApply.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import { FiArrowLeft, FiSend, FiCalendar } from 'react-icons/fi';
import axiosClient from '../../utils/AxiosCli';
import styled, { keyframes } from 'styled-components';
import mintLogo from '../../assets/mintLogo.png';
import 'react-toastify/dist/ReactToastify.css';

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

// Keyframes for a premium Gold/Amber glow matching GlowingButton.jsx
const leaveGlow = keyframes`
  0%, 100% {
    box-shadow:
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      0px 0px 20px hsla(38, 100%, 65%, 0.08);
    border-color: hsla(38, 100%, 75%, 0.15);
  }
  50% {
    box-shadow:
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      0px 0px 30px hsla(38, 100%, 65%, 0.22);
    border-color: hsla(38, 100%, 75%, 0.3);
  }
`;

const GlowingLeaveCard = styled.div`
  background-color: rgba(20, 20, 20, 0.4);
  border: solid 1px rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow:
    inset 0px 1px 1px rgba(255, 255, 255, 0.2),
    inset 0px 2px 2px rgba(255, 255, 255, 0.15),
    inset 0px 4px 4px rgba(255, 255, 255, 0.1),
    inset 0px 8px 8px rgba(255, 255, 255, 0.05),
    0px 12px 32px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.4s, border-color 0.4s;

  &:hover, &:focus-within {
    border-color: hsla(38, 100%, 75%, 0.25);
    animation: ${leaveGlow} 2.5s ease-in-out infinite;
  }
`;

export default function StudentLeaveApply() {
  const navigate = useNavigate();
  const minDate = useMemo(() => todayISO(), []);
  
  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState(minDate);
  const [toDate, setToDate] = useState(minDate);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  const invalidRange = useMemo(() => {
    if (!fromDate || !toDate) return true;
    return new Date(fromDate) > new Date(toDate);
  }, [fromDate, toDate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason.', { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }
    if (invalidRange) {
      toast.error('From date must be on or before To date.', { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }
    setSubmitting(true);
    setCreatedId(null);
    try {
      const { data } = await axiosClient.post(
        '/leave/createLeave',
        { reason: reason.trim(), fromDate, toDate },
        { withCredentials: true }
      );
      setCreatedId(data?.leaveId || null);
      toast.success(data?.message || 'Leave request created.', { position: 'top-center', theme: 'dark', transition: Bounce });
      setReason('');
      setFromDate(minDate);
      setToDate(minDate);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Failed to create leave request.';
      toast.error(msg, { position: 'top-center', theme: 'dark', transition: Bounce });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col items-center justify-center font-poppins relative overflow-hidden select-none">
      
      {/* Clickable MINT header shortcut absolute positioned at top center */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => navigate('/student/landing')}
          className="focus:outline-none flex items-center gap-3 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Go to Landing Page"
        >
          <img src={mintLogo} alt="MINT Logo" className="w-12 h-12 object-contain" />
          <span className="text-2xl font-bold tracking-widest text-white font-mono">MINT</span>
        </button>
      </div>

      {/* Main Single Page Centered Content container */}
      <main className="w-full max-w-lg px-6 flex flex-col gap-6 relative z-10 pt-20">
        
        {/* Header descriptions */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-light tracking-wider text-white flex items-center justify-center gap-2">
            <FiCalendar style={{ color: '#FCD34D' }} size={28} />
            Apply for Leave
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1.5 leading-relaxed">
            Submit leave requests easily. A parent validation link will be dispatched automatically.
          </p>
        </div>

        {/* Confined Glowing Card container styled after GlowingButton.jsx */}
        <GlowingLeaveCard className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            
            {/* Reason Textarea */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                Reason for Leave
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Describe why you need leave..."
                className="w-full px-4 py-3 bg-black/40 text-white placeholder-zinc-500 text-sm rounded-xl border border-white/10 focus:outline-none focus:border-white/20 transition-colors resize-none"
              />
            </div>

            {/* Date Pickers Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  min={minDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4.5 py-3 bg-black/40 text-white text-sm rounded-xl border border-white/10 focus:outline-none focus:border-white/20 transition-colors font-mono"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate || minDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4.5 py-3 bg-black/40 text-white text-sm rounded-xl border border-white/10 focus:outline-none focus:border-white/20 transition-colors font-mono"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {invalidRange && (
              <p className="text-xs text-red-400 font-semibold mt-1 ml-1 animate-pulse">
                * From date must not be after To date.
              </p>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting || invalidRange || !reason.trim()}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl border border-white/10 hover:border-white/20 transition-all disabled:opacity-45 disabled:cursor-not-allowed shadow-md"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z" />
                  </svg>
                  Submitting Request...
                </>
              ) : (
                <>
                  <FiSend size={14} />
                  Submit Request
                </>
              )}
            </button>

            {createdId && (
              <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-mono text-center text-green-400">
                Leave created successfully! ID: {createdId}
              </div>
            )}
          </form>
        </GlowingLeaveCard>

        {/* Bottom footer guidelines */}
        <div className="w-full text-center text-[10px] text-zinc-700 tracking-wide font-mono mt-2">
          MINT LEAVE TRACKING & COMPLIANCE
        </div>
      </main>

      <ToastContainer position="top-center" autoClose={2500} theme="dark" transition={Bounce} />
    </div>
  );
}
