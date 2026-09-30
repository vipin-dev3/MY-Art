import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  Ruler,
  Calendar,
  CheckCircle,
  Share2,
  Eye,
  Sliders,
  Download,
  Check,
  FileCheck
} from 'lucide-react';
import { downloadArtwork } from '../../utils/downloadHelper';

export default function ArtworkDetailModal({
  artwork,
  isDarkroomMode = false,
  onClose,
  onInquireArtwork,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });

  // Inspection mode: standard, contrast, warm, mono
  const [filterMode, setFilterMode] = useState(isDarkroomMode ? 'mono' : 'standard');

  // Magnifier Loupe mode
  const [loupeActive, setLoupeActive] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0 });
  const [loupeRatio, setLoupeRatio] = useState({ x: 0.5, y: 0.5 });

  const [copiedShare, setCopiedShare] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoomLevel((z) => Math.min(3.5, z + 0.3));
      if (e.key === '-') setZoomLevel((z) => Math.max(1, z - 0.3));
      if (e.key === '0') {
        setZoomLevel(1);
        setPanPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle Pan & Drag
  const handleMouseDown = (e) => {
    if (loupeActive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e) => {
    // Loupe tracking
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setLoupePos({ x, y });
      setLoupeRatio({
        x: Math.max(0, Math.min(1, x / rect.width)),
        y: Math.max(0, Math.min(1, y / rect.height)),
      });
      setSpotlight({ x, y, active: true });
    }

    if (!isDragging || loupeActive) return;
    setPanPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel to zoom in / out
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoomLevel((prev) => Math.min(3.5, Math.max(1, prev + delta)));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'contrast':
        return 'contrast-135 brightness-95 saturate-70';
      case 'warm':
        return 'sepia-30 contrast-105 brightness-95';
      case 'mono':
        return 'grayscale contrast-125 brightness-90';
      default:
        return '';
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleDownloadOriginal = async () => {
    setIsDownloading(true);
    const targetUrl = artwork.highResImage || artwork.image;
    await downloadArtwork(targetUrl, artwork.title, artwork.originalFilename);
    setIsDownloading(false);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  if (!artwork) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-2xl overflow-y-auto">
        {/* Backdrop dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-6xl max-h-[92vh] bg-[#0c0d12] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title="Close [Esc]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: High-Res Inspection Viewport */}
          <div className="relative flex-1 bg-[#070709] min-h-[380px] sm:min-h-[500px] lg:min-h-[640px] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 select-none">
            {/* Viewport Control Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-md text-zinc-300 shadow-xl">
              {/* Zoom In */}
              <button
                onClick={() => setZoomLevel((z) => Math.min(3.5, z + 0.4))}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom In [+]"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Zoom Out */}
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.4))}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out [-]"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Reset Zoom */}
              <button
                onClick={resetZoom}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Reset Zoom [0]"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

              {/* Magnifier Loupe Mode Toggle */}
              <button
                onClick={() => setLoupeActive(!loupeActive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  loupeActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
                title="Toggle 3.0x Texture Magnifier Loupe"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3x Loupe</span>
              </button>

              {/* Filter Contrast Switcher */}
              <button
                onClick={() => {
                  const modes = ['standard', 'contrast', 'warm', 'mono'];
                  const nextIndex = (modes.indexOf(filterMode) + 1) % modes.length;
                  setFilterMode(modes[nextIndex]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
                title="Toggle Tone Mode (Original, Contrast, Warm, Mono)"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline capitalize">{filterMode}</span>
              </button>
            </div>

            {/* Current Zoom Percent indicator */}
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-full bg-zinc-950/70 border border-white/5 text-[11px] font-mono-tech text-zinc-400 backdrop-blur-md">
              {Math.round(zoomLevel * 100)}% ZOOM • DRAG TO PAN
            </div>

            {/* The Main High-Res Image Canvas */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className={`relative w-full h-full flex items-center justify-center p-8 ${
                loupeActive ? 'cursor-crosshair' : (zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default')
              }`}
            >
              <div
                style={{
                  transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomLevel})`,
                  transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="relative max-w-full max-h-[75vh] transition-transform origin-center shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
              >
                {/* Archival Matting board frame */}
                <div className="p-3 sm:p-5 bg-[#f4f2ec] rounded shadow-2xl">
                  <img
                    ref={imageRef}
                    src={artwork.highResImage || artwork.image}
                    alt={artwork.title}
                    className={`artwork-image-el max-w-full max-h-[60vh] object-contain block select-none ${getFilterStyle()}`}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Dynamic Spotlight Follow Layer over Artwork */}
              {spotlight.active && !loupeActive && (
                <div
                  className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
                  style={{
                    background:
                      isDarkroomMode || filterMode === 'mono'
                        ? `radial-gradient(420px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255, 255, 255, 0.32) 0%, rgba(220, 38, 38, 0.12) 35%, transparent 70%)`
                        : `radial-gradient(420px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255, 245, 215, 0.28) 0%, rgba(245, 158, 11, 0.1) 35%, transparent 70%)`,
                    mixBlendMode: 'screen',
                  }}
                />
              )}

              {/* 3x Optical Loupe Magnifier Bubble */}
              {loupeActive && (
                <div
                  className="pointer-events-none absolute w-48 h-48 rounded-full border-2 border-amber-400/80 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden z-30 bg-black"
                  style={{
                    left: `${loupePos.x - 96}px`,
                    top: `${loupePos.y - 96}px`,
                  }}
                >
                  <img
                    src={artwork.highResImage || artwork.image}
                    alt="Magnified Detail"
                    className={`absolute max-w-none ${getFilterStyle()}`}
                    style={{
                      width: `${(imageRef.current?.offsetWidth || 500) * 3}px`,
                      left: `-${loupeRatio.x * ((imageRef.current?.offsetWidth || 500) * 3 - 192)}px`,
                      top: `-${loupeRatio.y * ((imageRef.current?.offsetHeight || 500) * 3 - 192)}px`,
                    }}
                  />
                  {/* Loupe reticle crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full border border-amber-400/50" />
                  </div>
                  <div className="absolute bottom-2 inset-x-0 text-center text-[10px] font-mono-tech text-amber-300 font-semibold bg-black/60 py-0.5">
                    3.0X TEXTURE INSPECTION
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Curatorial Metadata & Download Panel */}
          <div className="w-full lg:w-[420px] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] bg-[#0c0d12]">
            <div className="space-y-6">
              {/* Category & Status Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-widest font-mono-tech px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {artwork.categoryName}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Free High-Res Download</span>
                </span>
              </div>

              {/* Artwork Title & Year */}
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-zinc-100 font-bold tracking-tight">
                  {artwork.title}
                </h2>
                <p className="text-sm font-mono-tech text-zinc-400 mt-1">
                  AVATAR Archive • Circa {artwork.year}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-950/60 border border-white/5 text-xs">
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Dimensions
                  </span>
                  <p className="font-medium text-zinc-200 mt-0.5">{artwork.dimensions}</p>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Atelier Time
                  </span>
                  <p className="font-medium text-zinc-200 mt-0.5">{artwork.estimatedHours}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Medium & Substrate
                  </span>
                  <p className="font-medium text-zinc-200 mt-0.5 leading-relaxed">{artwork.medium}</p>
                </div>
              </div>

              {/* Artistic Story & Context */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-amber-300/80 font-mono-tech flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Artistic Story & Notes</span>
                </h3>
                <p className="text-sm text-zinc-300 font-serif-elegant leading-relaxed text-justify">
                  {artwork.story}
                </p>
              </div>

              {/* Technique Breakdown */}
              <div className="p-3.5 rounded-lg bg-zinc-900/40 border border-white/5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                  Drafting Technique:
                </span>
                <p className="text-xs text-zinc-300 leading-normal">
                  {artwork.technique}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {artwork.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions: High-Res Download & Inquire */}
            <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono-tech">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>File: {artwork.originalFilename || 'High-Res Master'}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
                  title="Share link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedShare ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Primary Download Button */}
              <button
                onClick={handleDownloadOriginal}
                disabled={isDownloading}
                className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isDownloaded
                    ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-400 text-black shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                }`}
              >
                {isDownloaded ? (
                  <>
                    <Check className="w-4 h-4 text-black stroke-[3]" />
                    <span>Original Artwork Downloaded!</span>
                  </>
                ) : isDownloading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Preparing Master File...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Download Full Resolution Artwork</span>
                  </>
                )}
              </button>

              {/* Secondary Inquire / Commission Button */}
              <button
                onClick={() => {
                  onClose();
                  onInquireArtwork?.(artwork);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 transition-colors cursor-pointer text-center"
              >
                Request Custom Drawing or Inquire About Piece
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
