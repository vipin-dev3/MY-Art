import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Sparkles, Compass } from 'lucide-react';

export default function CuratedGridView({
  artworks = [],
  onInspectArtwork,
  onFocusIn3D,
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {artworks.map((artwork, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              key={artwork.id}
              className="group relative rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-amber-500/50 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[0_10px_35px_rgba(197,160,89,0.15)] flex flex-col"
            >
              {/* Artwork Image Container with Matting */}
              <div className="relative aspect-[4/5] bg-[#0f0f13] overflow-hidden flex items-center justify-center p-4">
                <div className="relative w-full h-full bg-[#f6f4ee] p-3 rounded shadow-md overflow-hidden flex items-center justify-center">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    loading="lazy"
                    className="w-full h-full object-cover rounded transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle paper grain */}
                  <div className="pointer-events-none absolute inset-0 paper-grain opacity-40 mix-blend-multiply" />
                </div>

                {/* Hover Quick Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                  <button
                    onClick={() => onInspectArtwork(artwork)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 text-black font-semibold text-xs shadow-lg hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Studio Zoom</span>
                  </button>

                  <button
                    onClick={() => onFocusIn3D(artwork)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-900/90 text-zinc-200 border border-white/10 text-xs hover:text-white hover:border-white/30 transition-colors cursor-pointer"
                    title="Examine in 3D Rotunda"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">View in 3D</span>
                  </button>
                </div>

                {/* Category Pill Tag */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest px-2.5 py-1 rounded-full bg-zinc-950/80 text-zinc-300 border border-white/10 backdrop-blur-md">
                    {artwork.categoryName}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-500">
                    <span>{artwork.year}</span>
                    <span>{artwork.dimensions}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-zinc-100 mt-1 group-hover:text-amber-300 transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-mono-tech">
                    {artwork.medium}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300 font-display">
                    {artwork.price}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono-tech">
                    {artwork.estimatedHours}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
