import React, { useState } from 'react';
import { Compass, User, Palette, Mail, Menu, X, Sparkles, Contrast } from 'lucide-react';
import StudioAudio from './StudioAudio';

export default function Navbar({
  isDarkroomMode = false,
  onToggleDarkroom,
  onOpenCommission,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#08080a]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Atelier Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600/30 via-zinc-900 to-zinc-950 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.15)]">
            <span className="font-display font-bold text-lg text-amber-200 tracking-wider">A</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display tracking-[0.2em] text-base sm:text-lg font-bold text-zinc-100 uppercase">
                AVATAR
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Free HD Downloads
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-wider uppercase font-mono-tech hidden sm:block">
              Original Hand Drawings & Sketch Archive
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-zinc-400">
          <button
            onClick={() => scrollToSection('gallery-section')}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Exhibition Archive</span>
          </button>
          <button
            onClick={() => scrollToSection('statement-section')}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span>Artist Statement</span>
          </button>
          <button
            onClick={() => scrollToSection('tools-section')}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-zinc-500" />
            <span>Drawing Mediums</span>
          </button>
          <button
            onClick={() => scrollToSection('commission-section')}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-zinc-500" />
            <span>Custom Requests</span>
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Studio Audio */}
          <StudioAudio />

          {/* Interactive Darkroom Mode Toggle */}
          <button
            onClick={onToggleDarkroom}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              isDarkroomMode
                ? 'bg-red-950/70 border-red-500/60 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
            }`}
            title="Toggle High-Contrast B&W Darkroom Mode [D]"
          >
            <Contrast className={`w-3.5 h-3.5 ${isDarkroomMode ? 'text-red-400' : 'text-zinc-400'}`} />
            <span className="hidden sm:inline">
              {isDarkroomMode ? 'Darkroom: ON' : 'Darkroom'}
            </span>
            <span className="text-[10px] font-mono-tech opacity-60 hidden lg:inline">[D]</span>
          </button>

          {/* Commission Request CTA button */}
          <button
            onClick={onOpenCommission}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-amber-100 bg-gradient-to-r from-amber-700/60 via-amber-600/50 to-amber-800/60 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Request Drawing</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0d12]/95 border-b border-zinc-800 px-6 py-6 space-y-4 backdrop-blur-xl">
          <button
            onClick={() => scrollToSection('gallery-section')}
            className="block w-full text-left text-sm uppercase tracking-widest text-zinc-300 hover:text-amber-300 py-1"
          >
            Exhibition Archive
          </button>
          <button
            onClick={() => scrollToSection('statement-section')}
            className="block w-full text-left text-sm uppercase tracking-widest text-zinc-300 hover:text-amber-300 py-1"
          >
            Artist Statement
          </button>
          <button
            onClick={() => scrollToSection('tools-section')}
            className="block w-full text-left text-sm uppercase tracking-widest text-zinc-300 hover:text-amber-300 py-1"
          >
            Drawing Tools & Mediums
          </button>
          <button
            onClick={() => scrollToSection('commission-section')}
            className="block w-full text-left text-sm uppercase tracking-widest text-zinc-300 hover:text-amber-300 py-1"
          >
            Custom Commissions
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommission();
              }}
              className="w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-200 border border-amber-500/40 text-center"
            >
              Request Custom Drawing
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
