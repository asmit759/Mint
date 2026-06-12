import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DICEBEAR_STYLE = "adventurer";
const DICEBEAR_BASE = `https://api.dicebear.com/9.x/${DICEBEAR_STYLE}/svg`;

export const avatarUrl = (seed) =>
  `${DICEBEAR_BASE}?seed=${encodeURIComponent(seed)}&backgroundColor=050505`;

const randomSeed = () => Math.random().toString(36).slice(2, 10);
const makeSeedBatch = () => Array.from({ length: 6 }, randomSeed);

const AvatarPicker = ({ onSelectAvatar }) => {
  const [seeds, setSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const batch = makeSeedBatch();
    setSeeds(batch);
  }, []);

  const handleSelect = (seed) => {
    setSelectedSeed(seed);
    onSelectAvatar(seed);
  };

  const handleRegenerate = () => {
    const batch = makeSeedBatch();
    setSeeds(batch);
    setSelectedSeed(null);
    onSelectAvatar(null);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -120 : 120;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full font-poppins">
      <div className="flex justify-between items-center mb-3">
        <label className="text-xs font-semibold tracking-wider text-[#9ca3af] uppercase">
          Choose Avatar
        </label>
        <button
          type="button"
          onClick={handleRegenerate}
          className="text-xs text-[#4fd1ff] hover:text-[#4fd1ff]/80 transition-colors duration-200 flex items-center gap-1.5 focus:outline-none font-medium cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="relative flex items-center w-full px-2">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute left-0 z-20 p-1.5 bg-black/80 border border-white/10 rounded-full text-white/70 hover:text-white transition-colors focus:outline-none -translate-x-2.5 cursor-pointer shadow-md hover:bg-black"
          title="Scroll Left"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable Avatars Wrapper */}
        <div
          ref={scrollRef}
          className="flex flex-row gap-3 overflow-x-auto scroll-smooth w-full py-1.5 px-3 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {seeds.map((seed, idx) => (
            <motion.div
              key={seed}
              whileHover={{ scale: 1.1, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(seed)}
              className={`relative cursor-pointer rounded-full overflow-hidden w-12 h-12 flex-shrink-0 border-2 transition-all duration-300 ${
                selectedSeed === seed
                  ? 'border-[#4fd1ff] shadow-[0_0_15px_rgba(79,209,255,0.6)] scale-105'
                  : 'border-white/10 hover:border-[#4fd1ff]/40 bg-white/5'
              }`}
            >
              <img
                src={avatarUrl(seed)}
                alt={`Avatar ${idx + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute right-0 z-20 p-1.5 bg-black/80 border border-white/10 rounded-full text-white/70 hover:text-white transition-colors focus:outline-none translate-x-2.5 cursor-pointer shadow-md hover:bg-black"
          title="Scroll Right"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-white/40 mt-2 text-center font-medium">
        Select an avatar to continue
      </p>
    </div>
  );
};

export default AvatarPicker;
