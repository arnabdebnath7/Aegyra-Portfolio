import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, Compass, Eye, Info } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const ExhibitionChapter: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const hotspots = [
    {
      id: 1,
      title: 'Acro-Sanctuary',
      coordinate: '14.8° N · Zenith Spire',
      top: '32%',
      left: '48%',
      lore: 'The apex rotunda where planetary eclipses align with sacred bronze sundials.',
    },
    {
      id: 2,
      title: 'Cascade Viaduct',
      coordinate: '32.4° E · Lower Aqueduct',
      top: '64%',
      left: '30%',
      lore: 'Triple-tier stone arches channeling subterranean torrents to the outer agricultural rings.',
    },
    {
      id: 3,
      title: 'Nebula Observatory',
      coordinate: '88.1° Zenith · Starlight Cupola',
      top: '18%',
      left: '72%',
      lore: 'Prismatic crystal optics capturing stellar nebulae and charting deep-space celestial trajectories.',
    },
  ];

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        gsap.set('.exhibition-title-line, .exhibition-meta, .hotspot-pin', {
          opacity: 1,
          transform: 'none',
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        '.exhibition-title-line',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power3.out' }
      );

      tl.fromTo(
        '.exhibition-meta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.6'
      );

      tl.fromTo(
        '.hotspot-pin',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)' },
        '-=0.3'
      );

      gsap.to(imageRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="chapter-exhibition"
      ref={sectionRef}
      data-testid="chapter-exhibition"
      className="relative w-full h-full min-h-[100dvh] md:min-h-full flex flex-col justify-between overflow-hidden bg-void select-none py-12 md:py-16 px-4 md:px-8"
    >
      {/* 9:16 Aspect Background Canvas */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/images/exhibition-pantheon.webp"
          alt="The Celestial Pantheon exhibiting celestial skies and grand rotunda halls"
          className="w-full h-full object-cover object-center will-change-transform transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-void/35 to-void/90 pointer-events-none" />
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 text-center max-w-xl mx-auto pt-6">
        <div className="exhibition-meta inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-primary/30 bg-surface-glass backdrop-blur-md mb-3">
          <Sparkles className="w-3 h-3 text-gold-bright" />
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold-champagne">
            CHAPTER 04 · EXHIBITION
          </span>
        </div>

        <div className="exhibition-meta font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-gold-bright font-medium mb-2">
          CINEMATIC EXHIBITION
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight mb-3">
          <span className="block overflow-hidden">
            <span className="block exhibition-title-line">The Celestial</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block exhibition-title-line italic text-gold-bright">Pantheon</span>
          </span>
        </h2>

        <p className="exhibition-meta font-sans text-neutral-300 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto mb-2">
          Where monumental neoclassical colonnades touch the cosmic veil. Explore interactive
          architectural coordinates below.
        </p>
      </div>

      {/* Interactive Floating Hotspots Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {hotspots.map((h, i) => {
          const isActive = activeHotspot === i;
          return (
            <div
              key={h.id}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
              style={{ top: h.top, left: h.left }}
            >
              <button
                onClick={() => setActiveHotspot(isActive ? null : i)}
                aria-label={`Inspect ${h.title}`}
                className="hotspot-pin group relative flex items-center justify-center w-8 h-8 rounded-full border border-gold-bright bg-void/80 backdrop-blur-md text-gold-bright shadow-lg shadow-gold-primary/30 hover:scale-125 transition-transform duration-300"
              >
                <span className="absolute inset-0 rounded-full bg-gold-bright/30 animate-ping opacity-75" />
                <Compass className="w-4 h-4 text-gold-bright group-hover:rotate-45 transition-transform" />
              </button>

              {/* Tooltip on Active/Hover */}
              {isActive && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-3 rounded-2xl glass-panel bg-void/90 border border-gold-bright text-left shadow-2xl z-30 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm font-medium text-white">{h.title}</span>
                    <Info className="w-3.5 h-3.5 text-gold-bright" />
                  </div>
                  <div className="font-mono text-[9px] text-gold-champagne mb-1.5">{h.coordinate}</div>
                  <p className="font-sans text-[11px] text-neutral-300 font-light leading-snug">
                    {h.lore}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Metadata & Hotspot Detail Banner */}
      <div className="relative z-10 w-full max-w-xl mx-auto mt-auto pb-4">
        <GlassCard className="exhibition-meta !p-3.5 text-center flex flex-col sm:flex-row items-center justify-between gap-3 bg-void/70 backdrop-blur-lg">
          <div className="flex items-center gap-2 text-left">
            <Eye className="w-4 h-4 text-gold-bright flex-shrink-0" />
            <div className="font-mono text-[10px] text-neutral-300">
              <span className="text-gold-bright font-semibold">COORDINATE MAPPING ACTIVE:</span> Tap
              beacons to inspect sacred sanctuaries.
            </div>
          </div>
          <div className="font-mono text-[9px] px-2.5 py-1 rounded-full border border-gold-primary/30 text-gold-muted whitespace-nowrap">
            CANVAS: 460 x 1024 RESTORED
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default ExhibitionChapter;
