import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export default function GalleryControls({
  currentArtwork,
  currentIndex = 0,
  totalArtworks = 0,
  onPrev,
  onNext,
  onInspect,
  isPlaying = false,
  onTogglePlay,
}) {
  if (!currentArtwork) return null;

  return (
    <div className="absolute bottom-6 inset-x-0 z-20 pointer-events-none flex flex-col items-center gap-3 px-4">
      {/* Active artwork title bar floating chip */}
      <div className="pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-full bg-zinc-950/85 border border-white/10 backdrop-blur-xl shadow-2xl transition-all">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-display font-medium text-zinc-100">
            {currentArtwork.title}
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-amber-300/80 font-mono-tech text-xs hidden sm:inline">
            {currentArtwork.year}
          </span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-400 text-xs hidden sm:inline">
            {currentArtwork.medium.split(' on ')[0]}
          </span>
        </div>

        {/* Quick Studio Zoom button */}
        <button
          onClick={() => onInspect(currentArtwork)}
          className="ml-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-medium transition-colors cursor-pointer"
          title="Open Studio Zoom Magnifier"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Inspect</span>
        </button>
      </div>

      {/* Navigation Dock */}
      <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/5 active:scale-95"
          title="Previous Artwork [Left Arrow]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Counter indicator */}
        <div className="px-4 py-1 flex items-center gap-1.5 font-mono-tech text-xs text-zinc-300 select-none">
          <span className="text-amber-300 font-bold">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">
            {String(totalArtworks).padStart(2, '0')}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/5 active:scale-95"
          title="Next Artwork [Right Arrow]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-zinc-800 mx-1" />

        {/* Auto Tour Play/Pause */}
        <button
          onClick={onTogglePlay}
          className={`p-2.5 rounded-full transition-colors cursor-pointer border border-white/5 active:scale-95 ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
          title={isPlaying ? 'Pause Auto Tour' : 'Start Auto Exhibition Tour'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Subtle Hint */}
      <p className="text-[11px] text-zinc-500 font-mono-tech tracking-wider uppercase select-none hidden sm:block">
        Drag horizontally to rotate gallery • Click artwork or press Space to inspect details
      </p>
    </div>
  );
}
