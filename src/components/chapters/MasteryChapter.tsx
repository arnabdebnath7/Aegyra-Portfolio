import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, Cpu, Gauge, Layers, ShieldCheck, Flame } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const MasteryChapter: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const metrics = [
    {
      value: '60 FPS',
      label: 'GPU Frame Cadence',
      subtext: 'Hardware accelerated translate3d, scale3d & opacity only',
      icon: Gauge,
    },
    {
      value: '0 CLS',
      label: 'Layout Stability',
      subtext: 'Locked 9:16 aspect containers with pre-allocated layout boxes',
      icon: Layers,
    },
    {
      value: 'Fluid 9:16',
      label: 'Dual-Tier Responsive',
      subtext: '100dvh mobile containment with centered desktop stage',
      icon: Cpu,
    },
    {
      value: 'Zero generic fonts',
      label: 'Editorial Typography',
      subtext: '16th-century Claude Garamont punch-cuts & Space Mono',
      icon: ShieldCheck,
    },
  ];

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        gsap.set('.mastery-title-line, .mastery-meta, .metric-card', {
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
        '.mastery-title-line',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power3.out' }
      );

      tl.fromTo(
        '.mastery-meta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.6'
      );

      tl.fromTo(
        '.metric-card',
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
        '-=0.4'
      );

      gsap.to(imageRef.current, {
        yPercent: 14,
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
      id="chapter-mastery"
      ref={sectionRef}
      data-testid="chapter-mastery"
      className="relative w-full h-full min-h-[100dvh] md:min-h-full flex flex-col justify-between overflow-hidden bg-void select-none py-12 md:py-16 px-4 md:px-8"
    >
      {/* 9:16 Aspect Background Canvas */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/images/environment-caldera.webp"
          alt="The Caldera Basin painterly volcanic vista with glowing vents and cobalt waters"
          className="w-full h-full object-cover object-center will-change-transform transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/50 to-void/95 pointer-events-none" />
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 text-center max-w-xl mx-auto pt-6">
        <div className="mastery-meta inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-primary/30 bg-surface-glass backdrop-blur-md mb-3">
          <Sparkles className="w-3 h-3 text-gold-bright" />
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold-champagne">
            CHAPTER 05 · TECHNICAL CRAFT
          </span>
        </div>

        <div className="mastery-meta font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-gold-bright font-medium mb-2">
          TECHNICAL CRAFT & ARTISTRY
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight mb-3">
          <span className="block overflow-hidden">
            <span className="block mastery-title-line">The Caldera</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block mastery-title-line italic text-gold-bright">Basin</span>
          </span>
        </h2>

        <p className="mastery-meta font-sans text-neutral-300 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto mb-4">
          A marriage of raw volcanic terrain and mathematical engineering. Every animation, render
          loop, and typography weight is calibrated for zero-friction immersion.
        </p>

        <div className="mastery-meta inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void/70 border border-gold-primary/30 text-[10px] font-mono text-gold-champagne">
          <Flame className="w-3 h-3 text-gold-bright" />
          <span>GEOTHERMAL THERMAL FLUX: 1,840 MW</span>
        </div>
      </div>

      {/* 4-Item Metrics Grid */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mt-auto pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <GlassCard
                key={m.label}
                className="metric-card !p-3 text-center border-surface-border/40 hover:border-gold-primary/60 bg-void/80 backdrop-blur-lg"
              >
                <div className="w-7 h-7 mx-auto rounded-full bg-surface-glass border border-gold-primary/30 flex items-center justify-center mb-2">
                  <Icon className="w-3.5 h-3.5 text-gold-bright" />
                </div>
                <div className="font-serif text-xl sm:text-2xl text-white font-normal mb-0.5 tracking-tight">
                  {m.value}
                </div>
                <div className="font-mono text-[10px] text-gold-primary font-medium uppercase tracking-wider mb-1">
                  {m.label}
                </div>
                <div className="font-sans text-[9px] sm:text-[10px] text-neutral-400 font-light leading-snug">
                  {m.subtext}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MasteryChapter;
