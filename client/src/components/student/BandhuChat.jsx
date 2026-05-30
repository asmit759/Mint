// src/components/student/BandhuChat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiRefreshCw, FiSend, FiMinimize2 } from 'react-icons/fi';
import styled, { keyframes } from 'styled-components';
import axiosClient from '../../utils/AxiosCli';
import bandhuAvatar from '../../assets/KiitBandhu.png';

const BANDHU_ENDPOINT = '/studentFacility/studentGuide'; 

const displayName = (user) =>
  user?.name ||
  user?.fullName ||
  [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
  user?.email ||
  user?.email_id ||
  'Student';

// Keyframes for the navy blue hover glow (hue 225deg, navy blue)
const buttonGlow = keyframes`
  0%, 100% {
    box-shadow:
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      0px 0px 20px hsla(225, 100%, 70%, 0.1);
    border-color: hsla(225, 100%, 80%, 0.2);
  }
  50% {
    box-shadow:
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      0px 0px 30px hsla(225, 100%, 70%, 0.25);
    border-color: hsla(225, 100%, 80%, 0.35);
  }
`;

// GlowingChatbox container styled exactly like the GlowingButton with navy blue glow
const GlowingChatbox = styled(motion.div)`
  --border-radius: 20px;
  --button-color: rgba(20, 20, 20, 0.4);

  position: relative;
  background-color: var(--button-color);
  border: solid 1px rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius);
  box-shadow:
    inset 0px 1px 1px rgba(255, 255, 255, 0.2),
    inset 0px 2px 2px rgba(255, 255, 255, 0.15),
    inset 0px 4px 4px rgba(255, 255, 255, 0.1),
    inset 0px 8px 8px rgba(255, 255, 255, 0.05),
    0px 12px 32px rgba(0, 0, 0, 0.5);
  transition:
    box-shadow 0.4s ease,
    border-color 0.4s ease;

  &:hover, &:focus-within {
    border-color: hsla(225, 100%, 80%, 0.3);
    animation: ${buttonGlow} 2.5s ease-in-out infinite;
  }
`;

const BandhuChat = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // State for expanded vs compact chat
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Load conversation history from localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mint_bandhu_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'model', text: 'Hello! Ask me anything about campus, rules, or academics.' }
    ];
  });

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isExpanded) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isExpanded]);

  // Persist conversation history
  useEffect(() => {
    localStorage.setItem('mint_bandhu_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const userMessage = { role: 'user', text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token') || undefined;

      // Filter out the initial welcome message from the history sent to the API
      const historyToSend = messages.filter(
        (m) => m.text !== 'Hello! Ask me anything about campus, rules, or academics.'
      );

      const res = await axiosClient.post(
        BANDHU_ENDPOINT,
        { 
          message: text,
          history: historyToSend
        },
        { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
      );

      const raw = res?.data;
      const reply =
        typeof raw?.reply === 'string' ? raw.reply :
        typeof raw?.message === 'string' ? raw.message :
        JSON.stringify(raw ?? 'No response', null, 2);

      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      console.error('Bandhu API error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Sorry, I ran into an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to reset the conversation with Bandhu?")) {
      const defaultMsg = [{ role: 'model', text: 'Hello! Ask me anything about campus, rules, or academics.' }];
      setMessages(defaultMsg);
      localStorage.removeItem('mint_bandhu_chat_history');
      setIsExpanded(false);
    }
  };

  const handleContainerClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col md:flex-row font-poppins relative overflow-hidden select-none">
      
      {/* Left Panel (30-35%): Holds logo and loop AI image avatar independently directly on bg-black */}
      <aside className="md:w-[35%] w-full p-8 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-white/10 bg-black h-screen relative z-10">
        
        {/* Top-left Brand Link */}
        <div className="w-full flex justify-start">
          <button
            onClick={() => navigate('/student/landing')}
            className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-xs text-white uppercase tracking-widest hover:bg-white/10 transition-colors font-mono font-semibold"
          >
            <FiArrowLeft size={14} />
            MINT // BANDHU
          </button>
        </div>

        {/* Circular Avatar Player playing independently (no outer cards) */}
        <div className="my-auto flex flex-col items-center translate-x-2 md:translate-x-4">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border border-white/15 bg-black shadow-[0_0_15px_rgba(255,255,255,0.02)] relative flex items-center justify-center">
            <img
              src={bandhuAvatar}
              alt="KIIT Bandhu"
              className="w-full h-full object-cover scale-105"
            />
          </div>
          
          {/* Neutral blue pulse indicator */}
          <div className="mt-5 flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase font-semibold">Bandhu // Active</span>
          </div>
        </div>

        {/* Branding Footer info */}
        <div className="text-[9px] font-mono text-zinc-700 tracking-wider">
          MINT STUDENT COMPLIANCE & HANDBOOK ASSISTANT
        </div>
      </aside>

      {/* Right Panel (65-70%): Chat Workspace rendered directly on fullscreen black background */}
      <main className="md:w-[65%] w-full p-6 md:p-12 flex flex-col justify-between bg-black h-screen relative z-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-1.5 text-left">
            <h1 className="text-xl md:text-2xl font-light tracking-wider text-white">
              Your School of Computer Engineering Support
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              Hi <span className="text-white font-medium">{displayName(user)}</span>,
            </p>
          </div>

          {/* Reset & Minimize Controls in header when expanded */}
          {isExpanded && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 transition-colors"
                title="Reset conversation"
              >
                <FiRefreshCw size={11} className={loading ? "animate-spin" : ""} />
                Reset
              </button>
              
              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 transition-colors"
                title="Minimize chat"
              >
                <FiMinimize2 size={11} />
                Minimize
              </button>
            </div>
          )}
        </div>

        {/* Chat area confined in GlowingChatbox styled after GlowingButton.jsx */}
        <div className="flex-grow flex items-center justify-center my-8 relative overflow-hidden w-full">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              /* COMPACT STATE */
              <GlowingChatbox
                key="collapsed"
                layoutId="chatCard"
                onClick={handleContainerClick}
                className="w-full max-w-md p-6 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all select-none flex flex-col gap-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Welcome. Ask me anything about campus rules, academic courses, specializations, or grades, and I will assist you based on the student handbook.
                </p>
                
                <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-xl p-2.5">
                  <span className="text-zinc-500 font-light text-sm pl-2">
                    Type your problem here...
                  </span>
                  <button className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
                    <FiSend size={14} />
                  </button>
                </div>
              </GlowingChatbox>
            ) : (
              /* EXPANDED STATE */
              <GlowingChatbox
                key="expanded"
                layoutId="chatCard"
                className="w-full h-full rounded-2xl flex flex-col justify-between overflow-hidden relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Scrollable Message Box */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`px-5 py-3.5 rounded-2xl max-w-[80%] whitespace-pre-line text-sm leading-relaxed border
                          ${m.role === 'user'
                            ? 'bg-white/10 border-white/10 text-white rounded-tr-none'
                            : 'bg-white/5 border-white/5 text-zinc-300 rounded-tl-none'
                          }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 rounded-tl-none flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Send Message Input Form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-5 border-t border-white/5 bg-black/20 flex items-center gap-3"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your problem here..."
                    className="flex-grow bg-black/40 text-white placeholder-zinc-500 text-sm px-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/20 transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputText.trim()}
                    className="p-3.5 bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all"
                  >
                    <FiSend size={14} />
                  </button>
                </form>
              </GlowingChatbox>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Notice Disclaimer */}
        <div className="w-full text-center text-[10px] text-zinc-700 tracking-wide font-mono select-none">
          DISCLAIMER: Bandhu is an AI support representative. When in doubt, verify rules with your department or academic coordinators.
        </div>
      </main>
    </div>
  );
};

export default BandhuChat;
