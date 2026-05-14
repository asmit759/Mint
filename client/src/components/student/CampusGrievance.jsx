// src/components/student/CampusGrievance.jsx
import React, { useState } from 'react';
import axiosClient from '../../utils/AxiosCli';
import { toast, ToastContainer, Bounce } from 'react-toastify';

const MIN_LEN = 10;
const MAX_LEN = 600;

function CampusGrievance() {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const trimmedLen = text.trim().length;
  const charsLeft = Math.max(0, MAX_LEN - text.length);
  const tooShort = trimmedLen > 0 && trimmedLen < MIN_LEN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = text.trim();

    if (value.length < MIN_LEN) {
      toast.error(`Please enter at least ${MIN_LEN} characters.`, { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }

    setSubmitting(true);
    try {
      
      const res = await axiosClient.post(
        '/studentFacility/studentGrievance',
        { text: value },
        { withCredentials: true }
      );

      const id = res?.data?.grievance?._id;
      const ok = res?.status === 201;

      if (ok) {
        toast.success(`Grievance submitted${id ? ` (#${id.slice(-6)})` : ''}.`, { position: 'top-center', theme: 'dark', transition: Bounce });
        setText('');
      } else {
        toast.info(res?.data?.message || 'Submitted.', { position: 'top-center', theme: 'dark', transition: Bounce });
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to submit grievance.';
      toast.error(msg, { position: 'top-center', theme: 'dark', transition: Bounce });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 text-text-primary">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Campus Grievance
        </h1>
        <p className="mt-3 text-indigo-200">
          Describe your campus-related issue. Your mentor will be notified.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-indigo-300 mb-1">Your message</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
            rows={8}
            placeholder="Include details like place, date/time, people involved, and any reference IDs."
            className="w-full px-4 py-3 rounded-xl bg-surface text-indigo-100 placeholder-indigo-300/40 border border-indigo-800/40 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <div className="flex items-center justify-between text-sm">
            <span className={tooShort ? 'text-red-400' : 'text-text-secondary'}>
              {trimmedLen}/{MIN_LEN} min
            </span>
            <span className={`text-sm ${charsLeft < 30 ? 'text-yellow-300' : 'text-text-secondary'}`}>
              {charsLeft} characters left
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting || trimmedLen < MIN_LEN}
            className="inline-flex items-center gap-2 bg-primary hover:bg-indigo-700 disabled:opacity-50 text-text-primary font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-700/30 transition-colors"
          >
            {submitting ? (
              <>
                <svg className="w-5 h-5 animate-spin text-text-primary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"/>
                </svg>
                Submitting...
              </>
            ) : (
              <>Submit Grievance</>
            )}
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={2500} theme="dark" transition={Bounce} />
    </div>
  );
}

export default CampusGrievance;
