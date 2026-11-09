import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Play, ArrowRight, ChevronDown, Compass } from 'lucide-react';
import { GoldButton } from '../ui/GoldButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeroChapterProps {
  onExplore?: () => void;
  onPlayTrailer?: () => void;
}

export const HeroChapter: React.FC<HeroChapterProps> = ({ onExplore, onPlayTrailer }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect user's reduced motion preference
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        gsap.set('.hero-title-line, .hero-meta, .hero-cta', { opacity: 1, transform: 'none' });
        return;
      }

      // Cinematic entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        imageRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 1.8 }
      );

      tl.fromTo(
        '.hero-title-line',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.12 },
        '-=1.2'
      );

      tl.fromTo(
        '.hero-meta',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
        '-=0.7'
      );

      tl.fromTo(
        '.hero-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      );

      // Scroll parallax scrub
      gsap.to(imageRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="chapter-hero"
      ref={sectionRef}
      data-testid="chapter-hero"
      className="relative w-full h-full min-h-[100dvh] md:min-h-full flex flex-col justify-between overflow-hidden bg-void select-none"
    >
      {/* 9:16 Aspect Visual Canvas */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/images/hero-valley.webp"
          alt="The Valley of Aegyra showing colossal waterfalls and classical temple architecture"
          className="w-full h-full object-cover object-center will-change-transform transform"
          loading="eager"
        />
        {/* Editorial Vignette and Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-transparent to-void/90 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-void/20 to-void/80 pointer-events-none" />
      </div>

      {/* Top Header Eyebrow / Masthead */}
      <div className="relative z-10 pt-20 md:pt-16 px-6 md:px-8 text-center flex flex-col items-center">
        {/* Classical Temple Crest Glyph */}
        <div className="hero-meta inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-primary/30 bg-surface-glass backdrop-blur-md mb-4 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-gold-bright" />
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold-champagne">
            ARCHIVE 01 · REALM OF AEGYRA
          </span>
        </div>

        <div className="hero-meta font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-gold-bright font-medium">
          A LOST WORLD REIMAGINED
        </div>
      </div>

      {/* Center Typography & Narrative Block */}
      <div ref={contentRef} className="relative z-10 px-6 md:px-8 text-center my-auto py-8">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.08] mb-4">
          <span className="block overflow-hidden">
            <span className="block hero-title-line">The Valley of</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block hero-title-line italic font-light text-gold-bright">
              Aegyra
            </span>
          </span>
        </h1>

        <p className="hero-meta font-sans text-neutral-300 text-xs sm:text-sm md:text-base max-w-md mx-auto font-light leading-relaxed mb-8 opacity-90">
          A harmonious sanctuary where architects, scholars, and companions preserve the
          monumental echoes of ancient civilization.
        </p>

        {/* Dual Primary & Secondary CTAs */}
        <div className="hero-cta flex flex-wrap items-center justify-center gap-3">
          <GoldButton
            data-testid="cta-explore"
            variant="primary"
            onClick={onExplore}
            className="group"
          >
            <span>Explore the World</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </GoldButton>

          <GoldButton
            data-testid="cta-trailer"
            variant="glass"
            onClick={onPlayTrailer}
            className="group"
          >
            <Play className="w-3.5 h-3.5 text-gold-bright fill-gold-bright/30 group-hover:scale-110 transition-transform" />
            <span>Watch Prologue</span>
          </GoldButton>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 pb-8 px-6 text-center flex flex-col items-center">
        <div className="hero-meta flex flex-col items-center gap-1.5 cursor-pointer text-gold-muted hover:text-gold-bright transition-colors">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
            Scroll to Discover
          </span>
          <div className="w-5 h-8 rounded-full border border-gold-primary/40 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-gold-bright animate-bounce" />
          </div>
          <ChevronDown className="w-3.5 h-3.5 animate-pulse text-gold-primary mt-0.5" />
        </div>
      </div>
    </section>
  );
};

export default HeroChapter;
