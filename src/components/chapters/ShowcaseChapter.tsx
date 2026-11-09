import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, ArrowUpRight, Mountain, Building2, Trees, Landmark } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const ShowcaseChapter: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [activeTab, setActiveTab] = useState<'valleys' | 'cities' | 'forests' | 'cliffs'>('valleys');

  const categories = [
    { id: 'valleys' as const, label: 'Valleys', testId: 'category-tab-valleys', icon: Mountain },
    { id: 'cities' as const, label: 'Cities', testId: 'category-tab-cities', icon: Building2 },
    { id: 'forests' as const, label: 'Forests', testId: 'category-tab-forests', icon: Trees },
    { id: 'cliffs' as const, label: 'Cliffs', testId: 'category-tab-cliffs', icon: Landmark },
  ];

  const showcaseData = {
    valleys: {
      title: 'The Waterfall Citadel',
      tag: 'Sanctuary 01',
      elevation: '1,420m Above Sea',
      image: '/assets/images/thumb-waterfall-citadel.webp',
      description:
        'A terraced metropolis woven into colossal waterfalls. Arched aqueducts carry pure glacial runoff to royal botanical reserves.',
      stats: { density: '68% Verdant', structures: '14 Architraves', flow: '42,000 m³/s' },
    },
    cities: {
      title: 'The Basalt Acropolis',
      tag: 'Civic Core',
      elevation: '2,100m High Plateau',
      image: '/assets/images/card-builders.webp',
      description:
        'Geometric stone palaces elevated on obsidian pillars. Council halls host inter-species dialogues and celestial calculations.',
      stats: { density: '92% Carved Basalt', structures: '28 Rotundas', flow: 'Solar Alignments' },
    },
    forests: {
      title: 'The Canopy Spires',
      tag: 'Bio-Archive',
      elevation: '850m River Basin',
      image: '/assets/images/card-companions.webp',
      description:
        'Millennial redwoods interlinked by suspended cedar ropeways. Arboreal companions nurture bioluminescent flora.',
      stats: { density: '99% Forest Canopy', structures: '8 Tree Castles', flow: 'Bioluminescent' },
    },
    cliffs: {
      title: 'The Precipice Library',
      tag: 'Wisdom Peak',
      elevation: '3,200m Cloud Ridge',
      image: '/assets/images/card-scholars.webp',
      description:
        'Perched upon sheared granite bluffs, wind-carved scriptoria guard ancient papyri and brass armillary spheres.',
      stats: { density: '100% Solid Granite', structures: '6 Sky Towers', flow: 'Continuous Wind' },
    },
  };

  const currentItem = showcaseData[activeTab];

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        gsap.set('.showcase-title-line, .showcase-meta, .showcase-display', {
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
        '.showcase-title-line',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power3.out' }
      );

      tl.fromTo(
        '.showcase-meta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.6'
      );

      tl.fromTo(
        '.showcase-display',
        { y: 30, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
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
      id="chapter-showcase"
      ref={sectionRef}
      data-testid="chapter-showcase"
      className="relative w-full h-full min-h-[100dvh] md:min-h-full flex flex-col justify-between overflow-hidden bg-void select-none py-12 md:py-16 px-4 md:px-8"
    >
      {/* 9:16 Aspect Background Canvas */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/images/showcase-world.webp"
          alt="A Living Landscape showcase scene overlooking ancient architraves and waterfalls"
          className="w-full h-full object-cover object-center will-change-transform transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/45 to-void/95 pointer-events-none" />
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 text-center max-w-xl mx-auto pt-6">
        <div className="showcase-meta inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-primary/30 bg-surface-glass backdrop-blur-md mb-3">
          <Sparkles className="w-3 h-3 text-gold-bright" />
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold-champagne">
            CHAPTER 03 · THE WORLD
          </span>
        </div>

        <div className="showcase-meta font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-gold-bright font-medium mb-2">
          THE ARCHIVE & SELECTED WORKS
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight mb-3">
          <span className="block overflow-hidden">
            <span className="block showcase-title-line">A Living</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block showcase-title-line italic text-gold-bright">Landscape</span>
          </span>
        </h2>

        <p className="showcase-meta font-sans text-neutral-300 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto mb-6">
          From towering temples to lush valleys, Aegyra is a living tapestry of architectural balance,
          wonder, and coexistence.
        </p>

        {/* 4 Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Landscape categories"
          className="showcase-meta inline-flex p-1.5 rounded-full glass-panel border border-surface-border/40 gap-1 sm:gap-2 max-w-full overflow-x-auto"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${cat.id}`}
                data-testid={cat.testId}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-gold-bright text-void font-semibold shadow-md shadow-gold-primary/30 scale-105'
                    : 'text-neutral-400 hover:text-white hover:bg-surface-glass'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-void' : 'text-gold-primary'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Showcase Item Container */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="relative z-10 w-full max-w-xl mx-auto mt-auto pb-4"
      >
        <GlassCard className="showcase-display border-gold-primary/40 bg-void/80 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Thumbnail */}
            <div className="w-full sm:w-44 aspect-[4/3] rounded-xl overflow-hidden relative border border-gold-primary/30 flex-shrink-0">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-void/80 backdrop-blur-sm border border-gold-primary/40 text-[9px] font-mono text-gold-bright uppercase tracking-wider">
                {currentItem.tag}
              </div>
            </div>

            {/* Description & Metadata */}
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif text-lg sm:text-xl text-white font-normal">
                  {currentItem.title}
                </h3>
                <div className="w-8 h-8 rounded-full border border-gold-primary/50 bg-gold-primary/10 flex items-center justify-center text-gold-bright hover:bg-gold-bright hover:text-void transition-colors cursor-pointer">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="font-mono text-[10px] text-gold-champagne tracking-wider mb-2">
                [ ELEVATION: {currentItem.elevation} ]
              </div>

              <p className="font-sans text-xs text-neutral-300 leading-relaxed font-light mb-3">
                {currentItem.description}
              </p>

              {/* Stats pill list */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border/30 text-center font-mono text-[9px]">
                <div className="text-neutral-400">
                  <span className="block text-gold-bright">{currentItem.stats.density}</span>
                  <span>Density</span>
                </div>
                <div className="text-neutral-400">
                  <span className="block text-gold-bright">{currentItem.stats.structures}</span>
                  <span>Scale</span>
                </div>
                <div className="text-neutral-400">
                  <span className="block text-gold-bright">{currentItem.stats.flow}</span>
                  <span>Atmosphere</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default ShowcaseChapter;
