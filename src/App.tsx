import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Compass, Sparkles, ArrowRight, Play } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.from(headlineRef.current, {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      data-testid="aegyra-portfolio"
      className="min-h-screen bg-void text-neutral-100 flex flex-col justify-between p-6 md:p-12 selection:bg-gold-primary/30 selection:text-gold-bright"
    >
      {/* Editorial Header */}
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto border-b border-surface-border/40 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-gold-primary/60 flex items-center justify-center bg-surface-glass">
            <Compass className="w-4 h-4 text-gold-bright" />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-gold-muted">
            Aegyra Archives
          </span>
        </div>
        <div className="font-mono text-xs tracking-wider text-neutral-400">
          [ 42° 18' N / 71° 04' W ]
        </div>
      </header>

      {/* Main Hero Stage Placeholder */}
      <main className="max-w-4xl mx-auto my-auto text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-primary/30 bg-surface-glass text-gold-bright text-xs font-mono tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CHAPTER 01 · VALLEY OF AEGYRA</span>
        </div>

        <h1
          ref={headlineRef}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight text-neutral-100 leading-none mb-8"
        >
          An Editorial <br />
          <span className="italic font-light text-gold-bright">Expedition</span>
        </h1>

        <p className="font-sans text-neutral-400 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed mb-10">
          A visual archive set against the 9:16 vertical canvas. Exploring ancient
          architectural sanctuaries, high calderas, and living landscapes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            data-testid="cta-explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-primary text-void font-sans text-sm font-semibold tracking-wide hover:bg-gold-bright transition-all duration-300 shadow-lg shadow-gold-primary/20"
          >
            <span>Begin Ascent</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            data-testid="cta-trailer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gold-primary/40 bg-surface-glass text-neutral-200 font-sans text-sm hover:border-gold-bright hover:text-white transition-all duration-300"
          >
            <Play className="w-4 h-4 text-gold-primary" />
            <span>Play Prologue</span>
          </button>
        </div>
      </main>

      {/* Footer Metadata */}
      <footer className="w-full max-w-6xl mx-auto pt-6 border-t border-surface-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-neutral-500">
        <div>AEGYRA · PORTFOLIO REBUILD 2026</div>
        <div>EDITORIAL TYPOGRAPHY · 9:16 CINEMATIC STAGE</div>
      </footer>
    </div>
  );
};

export default App;
