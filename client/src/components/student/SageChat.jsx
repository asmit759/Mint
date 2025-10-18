// src/components/student/SageChat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../utils/AxiosCli';
import sageAvatar from '../../assets/SageChatbot.png';

const SageChat = () => {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! How are you feeling today?' },
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
        '/studentFacility/studentMentalHealth',
        { message: msg },
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const reply = res?.data?.message ?? String(res?.data ?? 'No response');
      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      console.error('Sage API error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Sorry, I ran into an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950 text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left: Bigger avatar + paragraph */}
        <aside className="xl:col-span-5 bg-gray-900/60 border border-indigo-800/30 rounded-3xl p-10 shadow-2xl shadow-indigo-900/40 flex items-center">
          <div className="w-full flex flex-col items-center">
            <div className="relative w-[22rem] h-[22rem] max-w-full">
              {/* Bigger glow */}
              <div className="absolute inset-0 rounded-full blur-3xl bg-indigo-600/30 animate-pulse"></div>
              {/* Bigger circular avatar */}
              <div className="relative w-full h-full rounded-full border-4 border-indigo-500 overflow-hidden shadow-[0_0_55px_#4f46e5]">
                <img src={sageAvatar} alt="KIIT Sage" className="w-full h-full object-cover object-center" />
              </div>
            </div>

            <h1 className="mt-8 text-4xl font-extrabold text-indigo-300 text-center">KIIT Sage</h1>
            <p className="mt-4 text-base md:text-lg text-indigo-200/90 text-center leading-relaxed max-w-prose">
              A compassionate companion for mental wellness and confidential support. Share how you feel, and Sage will guide you gently.
            </p>
          </div>
        </aside>

        {/* Right: Chat */}
        <main className="xl:col-span-7">
          <div className="h-[72vh] min-h-[480px] overflow-y-auto p-6 space-y-4 scroll-smooth bg-gray-900/60 border border-indigo-800/30 rounded-3xl">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-5 py-4 rounded-2xl max-w-[78%] whitespace-pre-line leading-relaxed text-[15px]
                    ${m.role === 'user'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-700/40'
                      : 'bg-gray-800 text-indigo-100 border border-indigo-800/40'
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-gray-800 text-indigo-100 border border-indigo-800/40 inline-flex items-center gap-3">
                  <svg className="w-5 h-5 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"/>
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
              className="flex-grow px-5 py-4 rounded-2xl bg-gray-900 text-indigo-100 placeholder-indigo-300/40 border border-indigo-800/40 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Message KIIT Sage..."
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-4 rounded-2xl shadow-lg shadow-indigo-700/40 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-6 9 6-9 6-9-6z" />
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

export default SageChat;
