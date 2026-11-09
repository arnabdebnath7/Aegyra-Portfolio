import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Play, Sparkles, BookOpen, Hammer, Heart } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const PhilosophyChapter: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const cards = [
    {
      title: 'Companions',
      role: 'Empathy & Coexistence',
      image: '/assets/images/card-companions.webp',
      icon: Heart,
      description: 'Humans and ancient creatures forge deep bonds of mutual reliance and kinship.',
    },
    {
      title: 'Scholars',
      role: 'Classical Rigor',
      image: '/assets/images/card-scholars.webp',
      icon: BookOpen,
      description: 'Vaulted libraries catalog millennial geometry, celestial movements, and medicine.',
    },
    {
      title: 'Builders',
      role: 'Monumental Engineering',
      image: '/assets/images/card-builders.webp',
      icon: Hammer,
      description: 'Architects raise cascading viaducts and rotunda halls carved into basalt spires.',
    },
  ];

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        gsap.set('.philosophy-card, .philosophy-title-line, .philosophy-meta', {
          opacity: 1,
          transform: 'none',
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        '.philosophy-title-line',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power3.out' }
      );

      tl.fromTo(
        '.philosophy-meta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.6'
      );

      tl.fromTo(
        '.philosophy-card',
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
        '-=0.4'
      );

      // Subtle parallax on the background canvas
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
      id="chapter-philosophy"
      ref={sectionRef}
      data-testid="chapter-philosophy"
      className="relative w-full h-full min-h-[100dvh] md:min-h-full flex flex-col justify-between overflow-hidden bg-void select-none py-12 md:py-16 px-4 md:px-8"
    >
      {/* 9:16 Aspect Background Canvas */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/images/philosophy-companions.webp"
          alt="Partners in Progress philosophy visual depicting human and creature companionship"
          className="w-full h-full object-cover object-center will-change-transform transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/50 to-void/95 pointer-events-none" />
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 text-center max-w-xl mx-auto pt-6">
        <div className="philosophy-meta inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-primary/30 bg-surface-glass backdrop-blur-md mb-3">
          <Sparkles className="w-3 h-3 text-gold-bright" />
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold-champagne">
            CHAPTER 02 · THE PEOPLE
          </span>
        </div>

        <div className="philosophy-meta font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-gold-bright font-medium mb-2">
          THE PHILOSOPHY & IDENTITY
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight mb-3">
          <span className="block overflow-hidden">
            <span className="block philosophy-title-line">Partners in</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block philosophy-title-line italic text-gold-bright">Progress</span>
          </span>
        </h2>

        <p className="philosophy-meta font-sans text-neutral-300 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto mb-4">
          In Aegyra, humans and ancient beings are not separate species — they are companions in the
          same unfolding civilization.
        </p>

        {/* Interactive Story Pill Trigger */}
        <div className="philosophy-meta inline-flex">
          <button
            onClick={() => setSelectedCard(0)}
            className="glass-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-gold-bright font-mono text-xs hover:border-gold-bright transition-all duration-300 hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-gold-bright" />
            <span className="tracking-wider uppercase">Our Story</span>
          </button>
        </div>
      </div>

      {/* Bottom Trilogy Cards Grid */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mt-auto pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const isSelected = selectedCard === idx;
            return (
              <GlassCard
                key={card.title}
                onClick={() => setSelectedCard(isSelected ? null : idx)}
                className={`philosophy-card !p-3.5 transition-all duration-300 group ${
                  isSelected ? 'border-gold-bright shadow-lg shadow-gold-primary/20 scale-[1.02]' : ''
                }`}
              >
                {/* Thumbnail Asset */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2.5 relative border border-surface-border/40">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-void/70 backdrop-blur-sm border border-gold-primary/40 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-gold-bright" />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-base md:text-lg text-white font-medium group-hover:text-gold-bright transition-colors">
                    {card.title}
                  </h3>
                  <span className="font-mono text-[9px] text-gold-muted uppercase tracking-widest">
                    0{idx + 1}
                  </span>
                </div>

                <p className="font-mono text-[10px] text-gold-champagne tracking-wider uppercase mb-1.5">
                  {card.role}
                </p>

                <p className="font-sans text-[11px] text-neutral-300 leading-snug font-light">
                  {card.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PhilosophyChapter;
