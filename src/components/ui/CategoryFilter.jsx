import React from 'react';
import { motion } from 'framer-motion';
import { ARTWORK_CATEGORIES } from '../../data/artworksData';

export default function CategoryFilter({
  selectedCategory = 'all',
  onSelectCategory,
  artworkCounts = {},
}) {
  const currentCategoryObj = ARTWORK_CATEGORIES.find((c) => c.id === selectedCategory) || ARTWORK_CATEGORIES[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Category Pills Bar */}
      <div className="flex items-center justify-center flex-wrap gap-2 p-1.5 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {ARTWORK_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = artworkCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none flex items-center gap-2 ${
                isSelected ? 'text-amber-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="categoryActivePill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-amber-600/30 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
              <span
                className={`relative z-10 text-[10px] font-mono-tech px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected category editorial description */}
      <motion.p
        key={currentCategoryObj.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center text-xs sm:text-sm text-zinc-400 font-serif-elegant italic mt-3 max-w-xl mx-auto"
      >
        "{currentCategoryObj.description}"
      </motion.p>
    </div>
  );
}
