import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Download, Check, Sparkles, Eye } from 'lucide-react';
import { downloadArtwork } from '../../utils/downloadHelper';

// Single Artwork Card with dynamic Spotlight Follow Effect
function ArtworkCard({
  artwork,
  idx,
  isDarkroomMode,
  onInspectArtwork,
}) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Dynamic Spotlight Follow Effect: moves ambient illumination towards cursor
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--spot-x', `${x}px`);
    cardRef.current.style.setProperty('--spot-y', `${y}px`);
    cardRef.current.style.setProperty('--spot-opacity', '1');
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--spot-opacity', '0');
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    const targetUrl = artwork.highResImage || artwork.image;
    await downloadArtwork(targetUrl, artwork.title, artwork.originalFilename);
    setIsDownloading(false);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
      className={`group relative rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col cursor-pointer border ${
        isDarkroomMode
          ? 'bg-black border-red-950/40 hover:border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]'
          : 'bg-zinc-950/80 border-white/10 hover:border-amber-500/40'
      }`}
      onClick={() => onInspectArtwork(artwork)}
    >
      {/* Artwork Canvas Frame with Passe-Partout Matting & Spotlight Follow */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`spotlight-artwork-container relative aspect-[3/4] p-3 overflow-hidden flex items-center justify-center transition-colors ${
          isDarkroomMode ? 'bg-[#050506]' : 'bg-[#0c0d10]'
        }`}
      >
        <div
          className={`relative w-full h-full p-2 rounded shadow-md overflow-hidden flex items-center justify-center transition-colors ${
            isDarkroomMode ? 'bg-[#f0ede6]' : 'bg-[#f4f2ea]'
          }`}
        >
          <img
            src={artwork.image}
            alt={artwork.title}
            loading="lazy"
            className="artwork-image-el w-full h-full object-contain select-none transition-transform duration-500 group-hover:scale-[1.03]"
            draggable={false}
          />
          {/* Subtle paper grain */}
          <div className="pointer-events-none absolute inset-0 paper-grain opacity-25 mix-blend-multiply" />
        </div>

        {/* Category & Darkroom Badge */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-1.5">
          <span
            className={`text-[10px] font-mono-tech uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md ${
              isDarkroomMode
                ? 'bg-black/90 text-red-300 border-red-500/30'
                : 'bg-zinc-950/85 text-zinc-300 border-white/10'
            }`}
          >
            {artwork.categoryName}
          </span>
          {isDarkroomMode && (
            <span className="text-[9px] font-mono-tech uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/40">
              B&W
            </span>
          )}
        </div>

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspectArtwork(artwork);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900/90 text-zinc-100 border border-white/20 text-xs font-medium hover:bg-zinc-800 transition-colors shadow-lg cursor-pointer"
            title="Inspect with 3.0x Texture Loupe"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Inspect</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold shadow-lg transition-all cursor-pointer ${
              isDownloaded
                ? 'bg-emerald-500 text-black'
                : isDarkroomMode
                ? 'bg-red-500 hover:bg-red-400 text-black'
                : 'bg-amber-500 hover:bg-amber-400 text-black'
            }`}
            title="Download Full Resolution Artwork"
          >
            {isDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                <span>Saved!</span>
              </>
            ) : isDownloading ? (
              <>
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Details & Download Bar */}
      <div
        className={`p-4 flex-1 flex flex-col justify-between space-y-3 transition-colors ${
          isDarkroomMode ? 'bg-[#070709]' : 'bg-[#0a0a0d]'
        }`}
      >
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-500">
            <span>{artwork.year}</span>
            <span>{artwork.dimensions}</span>
          </div>
          <h3
            className={`font-display text-base font-bold transition-colors truncate mt-1 ${
              isDarkroomMode
                ? 'text-zinc-100 group-hover:text-red-400'
                : 'text-zinc-100 group-hover:text-amber-300'
            }`}
          >
            {artwork.title}
          </h3>
          <p className="text-xs text-zinc-400 font-mono-tech truncate mt-0.5">
            {artwork.medium}
          </p>
        </div>

        {/* Card Footer with Quick Download Trigger */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <span
            className={`text-[11px] font-mono-tech flex items-center gap-1 ${
              isDarkroomMode ? 'text-red-400/90' : 'text-emerald-400/90'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDarkroomMode ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            {isDarkroomMode ? 'Silver Gelatin B&W' : 'Master Quality Scan'}
          </span>

          <button
            onClick={handleDownload}
            className={`p-1.5 rounded-lg text-zinc-400 transition-colors ${
              isDarkroomMode ? 'hover:text-red-400 hover:bg-red-950/40' : 'hover:text-amber-300 hover:bg-zinc-800/80'
            }`}
            title="Direct Download Original File"
          >
            {isDownloaded ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryGrid({
  artworks = [],
  isDarkroomMode = false,
  onInspectArtwork,
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Grid of Artworks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {artworks.map((artwork, idx) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              idx={idx}
              isDarkroomMode={isDarkroomMode}
              onInspectArtwork={onInspectArtwork}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
