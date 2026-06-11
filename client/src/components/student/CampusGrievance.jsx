// src/components/student/CampusGrievance.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/AxiosCli';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import { FiSend } from 'react-icons/fi';
import styled, { keyframes } from 'styled-components';
import mintLogo from '../../assets/mintLogo.png';
import 'react-toastify/dist/ReactToastify.css';

const MIN_LEN = 10;
const MAX_LEN = 600;

// Keyframes for the violet glow (Campus Grievance)
const campusGlow = keyframes`
  0%, 100% {
    box-shadow:
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      0px 0px 20px hsla(270, 100%, 70%, 0.1);
    border-color: hsla(270, 100%, 80%, 0.2);
  }
  50% {
    box-shadow:
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      0px 0px 30px hsla(270, 100%, 70%, 0.25);
    border-color: hsla(270, 100%, 80%, 0.35);
  }
`;

// Keyframes for the blue glow (Hostel Grievance)
const hostelGlow = keyframes`
  0%, 100% {
    box-shadow:
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      0px 0px 20px hsla(220, 100%, 70%, 0.1);
    border-color: hsla(220, 100%, 80%, 0.2);
  }
  50% {
    box-shadow:
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      0px 0px 30px hsla(220, 100%, 70%, 0.25);
    border-color: hsla(220, 100%, 80%, 0.35);
  }
`;

const CampusGlowCard = styled.div`
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
    border-color: hsla(270, 100%, 80%, 0.3);
    animation: ${campusGlow} 2.5s ease-in-out infinite;
  }
`;

const HostelGlowCard = styled.div`
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
    border-color: hsla(220, 100%, 80%, 0.3);
    animation: ${hostelGlow} 2.5s ease-in-out infinite;
  }
`;

function UnifiedGrievance() {
  const navigate = useNavigate();

  // Campus Grievance State
  const [campusText, setCampusText] = useState('');
  const [campusSubmitting, setCampusSubmitting] = useState(false);

  // Hostel Grievance State
  const [hostelText, setHostelText] = useState('');
  const [coords, setCoords] = useState({ lat: null, long: null });
  const [gettingLoc, setGettingLoc] = useState(false);
  const [hostelSubmitting, setHostelSubmitting] = useState(false);

  // Campus calculations
  const campusTrimmedLen = campusText.trim().length;
  const campusCharsLeft = Math.max(0, MAX_LEN - campusText.length);
  const campusTooShort = campusTrimmedLen > 0 && campusTrimmedLen < MIN_LEN;

  // Hostel calculations
  const hostelTrimmed = hostelText.trim();
  const hostelLen = hostelTrimmed.length;
  const hostelCharsLeft = Math.max(0, MAX_LEN - hostelText.length);
  const hasCoords = coords.lat != null && coords.long != null;

  // Location Fetching Callback
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

  // Submit Campus Grievance
  const handleCampusSubmit = async (e) => {
    e.preventDefault();
    const value = campusText.trim();

    if (value.length < MIN_LEN) {
      toast.error(`Please enter at least ${MIN_LEN} characters for Campus Grievance.`, { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }

    setCampusSubmitting(true);
    try {
      const res = await axiosClient.post(
        '/studentFacility/studentGrievance',
        { text: value },
        { withCredentials: true }
      );

      const id = res?.data?.grievance?._id;
      const ok = res?.status === 201;

      if (ok) {
        toast.success(`Campus grievance submitted${id ? ` (#${id.slice(-6)})` : ''}.`, { position: 'top-center', theme: 'dark', transition: Bounce });
        setCampusText('');
      } else {
        toast.info(res?.data?.message || 'Submitted.', { position: 'top-center', theme: 'dark', transition: Bounce });
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to submit campus grievance.';
      toast.error(msg, { position: 'top-center', theme: 'dark', transition: Bounce });
    } finally {
      setCampusSubmitting(false);
    }
  };

  // Submit Hostel Grievance
  const handleHostelSubmit = async (e) => {
    e.preventDefault();
    if (hostelLen < MIN_LEN) {
      toast.error(`Please enter at least ${MIN_LEN} characters for Hostel Grievance.`, { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }
    if (!hasCoords) {
      toast.info('Please capture your current location first.', { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }

    setHostelSubmitting(true);
    try {
      const res = await axiosClient.post(
        '/studentFacility/studentHostelGrievance',
        { message: hostelTrimmed, currentLat: coords.lat, currentLong: coords.long },
        { withCredentials: true }
      );
      const ok = res?.status === 201;
      if (ok) {
        toast.success('Hostel grievance submitted successfully.', { position: 'top-center', theme: 'dark', transition: Bounce });
        setHostelText('');
        setCoords({ lat: null, long: null });
      } else {
        toast.info(res?.data?.message || 'Submitted.', { position: 'top-center', theme: 'dark', transition: Bounce });
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to submit hostel grievance.';
      toast.error(msg, { position: 'top-center', theme: 'dark', transition: Bounce });
    } finally {
      setHostelSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col md:flex-row font-poppins relative overflow-hidden select-none">
      
      {/* Absolute top-center MINT brand shortcut featuring both image & text logo shifted slightly to the left */}
      <div className="absolute top-6 left-1/2 -translate-x-[65%] z-50 flex flex-col items-center">
        <button 
          onClick={() => navigate('/student/landing')}
          className="focus:outline-none flex items-center gap-3 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Go to Landing Page"
        >
          <img src={mintLogo} alt="MINT Logo" className="w-12 h-12 object-contain" />
          <span className="text-2xl font-bold tracking-widest text-white font-mono">MINT</span>
        </button>
      </div>

      {/* Main Split Section - Fixed height (No scrolling) without physical dividing containers */}
      {/* Left Column Section: Campus Grievance (no border right) */}
      <section className="md:w-1/2 w-full p-8 md:p-16 flex flex-col justify-center items-center bg-black h-screen relative z-10">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center md:text-left mt-10 md:mt-0">
            <h2 className="text-2xl font-light tracking-wider text-white">Campus Grievance</h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Submit issues regarding university premises, classes, or general facilities.</p>
          </div>

          <CampusGlowCard className="p-6 flex flex-col gap-4">
            <form onSubmit={handleCampusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Grievance Description</label>
                <textarea
                  value={campusText}
                  onChange={(e) => setCampusText(e.target.value.slice(0, MAX_LEN))}
                  rows={5}
                  placeholder="Include details like place, date/time, people involved, and any reference IDs."
                  className="w-full px-4 py-3 bg-black/40 text-white placeholder-zinc-500 text-sm rounded-xl border border-white/10 focus:outline-none focus:border-white/20 transition-colors resize-none"
                />
                <div className="flex items-center justify-between text-xs mt-2 text-zinc-500 font-mono">
                  <span className={campusTooShort ? 'text-red-400 font-semibold' : ''}>
                    {campusTrimmedLen}/{MIN_LEN} min
                  </span>
                  <span className={campusCharsLeft < 30 ? 'text-yellow-400' : ''}>
                    {campusCharsLeft} chars left
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={campusSubmitting || campusTrimmedLen < MIN_LEN}
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl border border-white/10 hover:border-white/20 transition-all disabled:opacity-45 disabled:cursor-not-allowed shadow-md"
              >
                {campusSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"/>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend size={14} />
                    Submit Campus Grievance
                  </>
                )}
              </button>
            </form>
          </CampusGlowCard>
        </div>
      </section>

      {/* Artistic Dividing element down most of the screen, fading out at both ends */}
      <div className="hidden md:block absolute left-1/2 top-28 bottom-12 w-[1.5px] -translate-x-1/2 pointer-events-none z-20 bg-gradient-to-b from-transparent via-white/25 to-transparent" />

      {/* Right Column Section: Hostel Grievance */}
      <section className="md:w-1/2 w-full p-8 md:p-16 flex flex-col justify-center items-center bg-black h-screen relative z-10">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center md:text-left mt-10 md:mt-0">
            <h2 className="text-2xl font-light tracking-wider text-white">Hostel Grievance</h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Submit issues regarding hostels, mess, or rooms. GPS location required.</p>
          </div>

          <HostelGlowCard className="p-6 flex flex-col gap-4">
            <form onSubmit={handleHostelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Grievance Description</label>
                <textarea
                  value={hostelText}
                  onChange={(e) => setHostelText(e.target.value.slice(0, MAX_LEN))}
                  rows={3}
                  placeholder="Describe the issue, exact hostel block/room, date/time, and staff involved."
                  className="w-full px-4 py-3 bg-black/40 text-white placeholder-zinc-500 text-sm rounded-xl border border-white/10 focus:outline-none focus:border-white/20 transition-colors resize-none"
                />
                <div className="flex items-center justify-between text-xs mt-2 text-zinc-500 font-mono">
                  <span className={hostelLen > 0 && hostelLen < MIN_LEN ? 'text-red-400 font-semibold' : ''}>
                    {hostelLen}/{MIN_LEN} min
                  </span>
                  <span className={hostelCharsLeft < 30 ? 'text-yellow-400' : ''}>
                    {hostelCharsLeft} chars left
                  </span>
                </div>
              </div>

              {/* Location Fetcher Box */}
              <div className="rounded-xl bg-black/50 border border-white/10 p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-left">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Geolocation Verification</div>
                    <div className="text-xs font-medium text-white mt-1">
                      {hasCoords ? `Lat ${coords.lat.toFixed(6)}, Long ${coords.long.toFixed(6)}` : 'Location Not Captured'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={gettingLoc}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-[10px] font-mono text-white font-semibold transition-all active:scale-95 disabled:opacity-50"
                  >
                    {gettingLoc ? 'Fetching...' : 'Capture GPS'}
                  </button>
                </div>
                <p className="text-[9px] text-zinc-650 font-mono leading-relaxed">
                  * You must capture your location to prove presence at your assigned hostel for compliance validation.
                </p>
              </div>

              <button
                type="submit"
                disabled={hostelSubmitting || hostelLen < MIN_LEN || !hasCoords}
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl border border-white/10 hover:border-white/20 transition-all disabled:opacity-45 disabled:cursor-not-allowed shadow-md"
              >
                {hostelSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend size={14} />
                    Submit Hostel Grievance
                  </>
                )}
              </button>
            </form>
          </HostelGlowCard>
        </div>
      </section>

      <ToastContainer position="top-center" autoClose={2500} theme="dark" transition={Bounce} />
    </div>
  );
}

export default UnifiedGrievance;
