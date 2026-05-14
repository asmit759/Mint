// src/components/student/BandhuChat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../utils/AxiosCli';
import bandhuAvatar from '../../assets/KiitBandhu.png';

const BANDHU_ENDPOINT = '/studentFacility/studentGuide'; 

const BandhuChat = () => {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! Ask me anything about campus, rules, or academics.' },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const onSubmit = async (data) => {
    const msg = data.message?.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    reset();
    setLoading(true);

    try {
     
      const token = localStorage.getItem('token') || undefined;

      const res = await axiosClient.post(
        BANDHU_ENDPOINT,
        { message: msg },
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

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 text-text-primary">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 xl:grid-cols-12 gap-10">
        <aside className="xl:col-span-5 bg-surface/60 border border-border rounded-3xl p-10 shadow-2xl shadow-indigo-900/40 flex items-center">
          <div className="w-full flex flex-col items-center">
            <div className="relative w-[22rem] h-[22rem] max-w-full">
              <div className="absolute inset-0 rounded-full blur-3xl bg-primary/30 animate-pulse"></div>
              <div className="relative w-full h-full rounded-full border-4 border-indigo-500 overflow-hidden shadow-[0_0_55px_#4f46e5]">
                <img src={bandhuAvatar} alt="KIIT Bandhu" className="w-full h-full object-cover object-center" />
              </div>
            </div>

            <h1 className="mt-8 text-4xl font-extrabold text-indigo-300 text-center">KIIT Bandhu</h1>
            <p className="mt-4 text-base md:text-lg text-indigo-200/90 text-center leading-relaxed max-w-prose">
              Your go-to guide for campus rules, academic queries, and university information. Ask anything and Bandhu will help.
            </p>
          </div>
        </aside>

        {/* Right: Chat */}
        <main className="xl:col-span-7">
          <div className="h-[72vh] min-h-[480px] overflow-y-auto p-6 space-y-4 scroll-smooth bg-surface/60 border border-border rounded-3xl">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-5 py-4 rounded-2xl max-w-[78%] whitespace-pre-line leading-relaxed text-[15px]
                    ${m.role === 'user'
                      ? 'bg-primary text-text-primary shadow-lg shadow-indigo-700/40'
                      : 'bg-surface text-indigo-100 border border-indigo-800/40'
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-surface text-indigo-100 border border-indigo-800/40 inline-flex items-center gap-3">
<svg className="w-5 h-5 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z" />
</svg>

                  <span>Typing...</span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex items-center gap-3 p-2">
            <input
              {...register('message', { required: true, minLength: 1, maxLength: 700 })}
              className="flex-grow px-5 py-4 rounded-2xl bg-surface text-indigo-100 placeholder-indigo-300/40 border border-indigo-800/40 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Message KIIT Bandhu..."
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-primary hover:bg-indigo-700 disabled:opacity-50 text-text-primary font-semibold px-5 py-4 rounded-2xl shadow-lg shadow-indigo-700/40 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2-2-2 2m0 4l2 2 2-2" />
              </svg>
              Send
            </button>
          </form>

          {errors.message && (
            <p className="text-red-400 text-sm mt-2">
              Message must be between 1 and 700 characters.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default BandhuChat;
