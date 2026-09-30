import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

/**
 * Self-contained ambient soundscape generator using the Web Audio API.
 * Synthesizes subtle studio pencil sketching whispers and gentle acoustic room tone.
 * No external mp3 files required.
 */
export default function StudioAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  const startAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft low room drone (warm studio resonance)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(74, ctx.currentTime); // Deep D2 note
      oscGain.gain.setValueAtTime(0.06, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      // Gentle procedural pencil stroke noise simulator
      const playPencilStroke = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const now = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.08;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter to match paper friction sound (around 1200Hz - 2400Hz)
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400 + Math.random() * 800, now);
        filter.Q.setValueAtTime(2.5, now);

        const strokeGain = ctx.createGain();
        strokeGain.gain.setValueAtTime(0.001, now);
        strokeGain.gain.exponentialRampToValueAtTime(0.035 * (Math.random() * 0.5 + 0.5), now + 0.03);
        strokeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

        noise.connect(filter);
        filter.connect(strokeGain);
        strokeGain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.15);
      };

      // Periodic gentle pencil hatching rhythms
      intervalRef.current = setInterval(() => {
        if (Math.random() > 0.3) {
          playPencilStroke();
          setTimeout(playPencilStroke, 90 + Math.random() * 80);
          if (Math.random() > 0.5) {
            setTimeout(playPencilStroke, 220 + Math.random() * 60);
          }
        }
      }, 1400);

      setIsPlaying(true);
    } catch (err) {
      console.warn('AudioContext error:', err);
    }
  };

  const stopAudio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSound}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
          isPlaying
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
        }`}
        title={isPlaying ? 'Mute Studio Ambience' : 'Play Atelier Audio Ambience'}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Studio Sound: ON</span>
            {/* Animated audio equalizer bars */}
            <span className="flex items-end gap-0.5 h-3 ml-0.5">
              <span className="w-0.5 bg-amber-400 animate-[bounce_0.6s_infinite_alternate] h-3 rounded-full" />
              <span className="w-0.5 bg-amber-400 animate-[bounce_0.8s_infinite_alternate_0.2s] h-2 rounded-full" />
              <span className="w-0.5 bg-amber-400 animate-[bounce_0.5s_infinite_alternate_0.4s] h-2.5 rounded-full" />
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio Sound</span>
          </>
        )}
      </button>
    </div>
  );
}
