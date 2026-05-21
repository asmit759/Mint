// src/components/student/leave/StudentLeaveApply.jsx
import React, { useMemo, useState } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import axiosClient from '../../utils/AxiosCli';
import 'react-toastify/dist/ReactToastify.css';

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export default function StudentLeaveApply() {
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
    <div className="min-h-screen bg-background transition-colors duration-300 text-text-primary">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Apply for Leave
        </h1>
        <p className="mt-2 text-indigo-200">Fill the form below to request leave; an email with the parent approval link will be sent automatically. </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6 bg-white/8 border border-white/20 backdrop-blur-xl rounded-2xl p-6">
          <div>
            <label className="block text-sm text-indigo-300 mb-2">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              placeholder="Describe why you need leave..."
              className="w-full px-4 py-3 bg-surface/60 border border-white/20 rounded-xl text-indigo-100 placeholder-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-indigo-300 mb-2">From date</label>
              <input
                type="date"
                value={fromDate}
                min={minDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-3 bg-surface/60 border border-white/20 rounded-xl text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm text-indigo-300 mb-2">To date</label>
              <input
                type="date"
                value={toDate}
                min={fromDate || minDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-3 bg-surface/60 border border-white/20 rounded-xl text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {invalidRange && (
            <p className="text-sm text-red-300">From date must not be after To date.</p>
          )}

          <button
            type="submit"
            disabled={submitting || invalidRange || !reason.trim()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-indigo-700 disabled:opacity-50 text-text-primary font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-700/30 transition-colors"
          >
            {submitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>Submit Request</>
            )}
          </button>

          {createdId && (
            <div className="text-sm text-green-300">
              Leave created with ID: <span className="font-mono">{createdId}</span>
            </div>
          )}
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={2500} theme="dark" transition={Bounce} />
    </div>
  );
}
