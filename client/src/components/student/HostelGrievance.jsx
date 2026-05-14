// src/components/student/HostelGrievance.jsx
import React, { useState, useCallback } from 'react';
import axiosClient from '../../utils/AxiosCli';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MIN_LEN = 10;
const MAX_LEN = 600;

export default function HostelGrievance() {
  const [text, setText] = useState('');
  const [coords, setCoords] = useState({ lat: null, long: null });
  const [gettingLoc, setGettingLoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const trimmed = text.trim();
  const len = trimmed.length;
  const left = Math.max(0, MAX_LEN - text.length);
  const hasCoords = coords.lat != null && coords.long != null;

  const getLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation not supported by this browser.', { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }
    setGettingLoc(true);
    const options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords || {};
        setCoords({ lat: latitude, long: longitude });
        toast.success('Location captured.', { position: 'top-center', theme: 'dark', transition: Bounce });
        setGettingLoc(false);
      },
      (error) => {
        const map = {
          1: 'Permission denied. Please allow location access.',
          2: 'Position unavailable. Try again outdoors or check GPS.',
          3: 'Location request timed out. Please try again.',
        };
        toast.error(map[error?.code] || error?.message || 'Unable to get location.', { position: 'top-center', theme: 'dark', transition: Bounce });
        setGettingLoc(false);
      },
      options
    );
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (len < MIN_LEN) {
      toast.error(`Please enter at least ${MIN_LEN} characters.`, { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }
    if (!hasCoords) {
      toast.info('Please capture your current location first.', { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosClient.post(
        '/studentFacility/studentHostelGrievance',
        { message: trimmed, currentLat: coords.lat, currentLong: coords.long },
        { withCredentials: true }
      );
      const ok = res?.status === 201;
      if (ok) {
        toast.success('Grievance submitted successfully.', { position: 'top-center', theme: 'dark', transition: Bounce });
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
          Hostel/Mess Grievance
        </h1>
        <p className="mt-2 text-indigo-200">Submit issues related to hostel, mess, or nearby facilities while on campus.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 bg-white/8 border border-white/20 backdrop-blur-xl rounded-2xl p-6">
          <div>
            <label className="block text-sm text-indigo-300 mb-2">Your message</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
              rows={8}
              placeholder="Describe the issue, exact location (block/room/mess), date/time, and any staff references."
              className="w-full px-4 py-3 rounded-xl bg-surface/60 text-indigo-100 placeholder-indigo-300/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className={len > 0 && len < MIN_LEN ? 'text-red-400' : 'text-text-secondary'}>
                {len}/{MIN_LEN} min
              </span>
              <span className={`text-sm ${left < 30 ? 'text-yellow-300' : 'text-text-secondary'}`}>
                {left} characters left
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-black/30 border border-white/15 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="text-indigo-300 font-medium">Current location</div>
                <div className="text-text-secondary">
                  {hasCoords ? `Lat ${coords.lat.toFixed(6)}, Long ${coords.long.toFixed(6)}` : 'Not captured'}
                </div>
              </div>
              <button
                type="button"
                onClick={getLocation}
                disabled={gettingLoc}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-indigo-700 disabled:opacity-50"
              >
                {gettingLoc ? 'Getting...' : 'Use current location'}
              </button>
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              Location is required so the system can verify you are near your assigned hostel. 
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || len < MIN_LEN || !hasCoords}
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
              <>Submit Grievance</>
            )}
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={2500} theme="dark" transition={Bounce} />
    </div>
  );
}
