import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DICEBEAR_STYLE = "adventurer";
const DICEBEAR_BASE = `https://api.dicebear.com/9.x/${DICEBEAR_STYLE}/svg`;

export const avatarUrl = (seed) =>
  `${DICEBEAR_BASE}?seed=${encodeURIComponent(seed)}&backgroundColor=000000`;

const randomSeed = () => Math.random().toString(36).slice(2, 10);
const makeSeedBatch = () => Array.from({ length: 6 }, randomSeed);

const AvatarPicker = ({ onSelectAvatar }) => {
  const [seeds, setSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);

  useEffect(() => {
    setSeeds(makeSeedBatch());
  }, []);

  const handleSelect = (seed) => {
    setSelectedSeed(seed);
    onSelectAvatar(seed);
  };

  const handleRegenerate = () => {
    setSeeds(makeSeedBatch());
    setSelectedSeed(null);
    onSelectAvatar(null);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-indigo-300">Choose an Avatar</label>
        <button
          type="button"
          onClick={handleRegenerate}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Regenerate
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {seeds.map((seed) => (
          <motion.div
            key={seed}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(seed)}
            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              selectedSeed === seed 
                ? 'border-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                : 'border-transparent hover:border-indigo-500/50'
            }`}
          >
            <img src={avatarUrl(seed)} alt="Avatar" className="w-full h-auto aspect-square object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AvatarPicker;
