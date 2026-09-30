import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Feather, Award, Compass, Layers, CheckCircle2, MapPin } from 'lucide-react';
import { ARTIST_PROFILE } from '../../data/artworksData';

export default function ArtistBio() {
  const [activeToolIndex, setActiveToolIndex] = useState(0);

  return (
    <section id="statement-section" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <span className="text-xs font-mono-tech tracking-[0.25em] text-amber-400 uppercase">
          Draftsmanship & Philosophy
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-100 tracking-tight mt-3">
          The Artist & The Atelier
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4" />
      </div>

      {/* Artist Statement Blockquote */}
      <div className="relative mb-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 border border-white/10 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto">
        <div className="absolute top-6 left-6 text-6xl font-serif-elegant text-amber-500/20 select-none">
          “
        </div>
        <p className="relative z-10 text-base sm:text-xl lg:text-2xl text-zinc-200 font-serif-elegant italic leading-relaxed text-center px-4 sm:px-8">
          {ARTIST_PROFILE.statement}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center text-center">
          <span className="font-display font-semibold text-amber-200 tracking-wider text-sm sm:text-base">
            {ARTIST_PROFILE.name}
          </span>
          <span className="text-xs font-mono-tech text-zinc-500 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-amber-500/60" /> {ARTIST_PROFILE.atelier}
          </span>
        </div>
      </div>

      {/* Grid: Biography & Atelier Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
        {/* Left Column: Biography (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-display text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Feather className="w-5 h-5 text-amber-400" />
            <span>Academic Rigor Meets Contemporary Atmosphere</span>
          </h3>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed text-justify">
            {ARTIST_PROFILE.bio}
          </p>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed text-justify">
            Each composition begins with rigorous observation from life or archival physical references. Rather than relying on mechanical grids, forms are sculpted through intuitive tripartite shading—mapping deep shadow anchors first, letting paper grain act as breathable midtones, and carving specular illumination with kneaded erasers.
          </p>

          {/* Key Achievements Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {ARTIST_PROFILE.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 text-center"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-amber-300">
                  {stat.value}
                </div>
                <div className="text-[11px] font-mono-tech text-zinc-500 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Curated Exhibitions History (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-zinc-950/80 border border-white/10">
          <h3 className="font-display text-lg font-bold text-zinc-200 mb-6 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Selected Exhibitions & Salons</span>
          </h3>
          <div className="space-y-5">
            {ARTIST_PROFILE.exhibitions.map((item, idx) => (
              <div key={idx} className="relative pl-6 border-l border-zinc-800 group">
                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-amber-400 transition-colors" />
                <span className="text-[11px] font-mono-tech text-amber-400/90 font-semibold">
                  {item.year} • {item.type}
                </span>
                <h4 className="text-sm font-semibold text-zinc-200 mt-0.5">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {item.venue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Atelier Tools & Physical Mediums Section */}
      <div id="tools-section" className="pt-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono-tech tracking-[0.2em] text-amber-400 uppercase">
            Tactile Substrates & Pigments
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100 mt-2">
            The Draftsman's Physical Arsenal
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            A hand drawing is only as timeless as the archival chemistry between carbon lead and cotton rag.
          </p>
        </div>

        {/* Tools Tabs & Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Tool List Selection (5 cols) */}
          <div className="md:col-span-5 space-y-2">
            {ARTIST_PROFILE.tools.map((tool, idx) => {
              const isSelected = idx === activeToolIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveToolIndex(idx)}
                  className={`w-full p-4 rounded-xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/10'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase font-mono-tech tracking-wider text-amber-400/80 block">
                      {tool.category}
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-zinc-100">
                      {tool.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono-tech ${
                      isSelected ? 'bg-amber-400/20 text-amber-200' : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    {tool.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tool Detailed Spotlight (7 cols) */}
          <div className="md:col-span-7 p-8 rounded-2xl bg-zinc-950/90 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech text-amber-400 uppercase tracking-widest">
                  {ARTIST_PROFILE.tools[activeToolIndex].category} Profile
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {ARTIST_PROFILE.tools[activeToolIndex].tag}
                </span>
              </div>
              <h4 className="font-display text-2xl sm:text-3xl font-bold text-zinc-100 mt-4">
                {ARTIST_PROFILE.tools[activeToolIndex].name}
              </h4>
              <p className="text-sm sm:text-base text-zinc-300 font-serif-elegant mt-4 leading-relaxed">
                {ARTIST_PROFILE.tools[activeToolIndex].description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Archival, Museum-Grade & Lightfast Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
