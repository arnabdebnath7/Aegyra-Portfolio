import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, Globe, Sparkles, ArrowDown } from 'lucide-react';
import { HeroChapter } from './chapters/HeroChapter';
import { PhilosophyChapter } from './chapters/PhilosophyChapter';
import { ShowcaseChapter } from './chapters/ShowcaseChapter';
import { ExhibitionChapter } from './chapters/ExhibitionChapter';
import { MasteryChapter } from './chapters/MasteryChapter';
import { InquiriesChapter } from './chapters/InquiriesChapter';
import { InquiryModal } from './ui/InquiryModal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ChapterMeta {
  id: string;
  number: string;
  title: string;
  subtitle: string;
}

const CHAPTERS: ChapterMeta[] = [
  { id: 'chapter-hero', number: '01', title: 'The Valley of Aegyra', subtitle: 'A Lost World' },
  { id: 'chapter-philosophy', number: '02', title: 'Partners in Progress', subtitle: 'Philosophy & Identity' },
  { id: 'chapter-showcase', number: '03', title: 'A Living Landscape', subtitle: 'Archive of Works' },
  { id: 'chapter-exhibition', number: '04', title: 'The Celestial Pantheon', subtitle: 'Cosmic Exhibition' },
  { id: 'chapter-mastery', number: '05', title: 'The Caldera Basin', subtitle: 'Technical Craft' },
  { id: 'chapter-inquiries', number: '06', title: 'Enter the Gates', subtitle: 'Commission Inquiries' },
];

export const CinematicStage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Initialize GSAP matchMedia and ScrollTrigger listeners
  useGSAP(
    () => {
      // Refresh on document font ready
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }

      const mm = gsap.matchMedia();

      // Desktop & Tablet (>= 768px): Centered 9:16 stage with ambient backlight
      mm.add('(min-width: 768px)', () => {
        CHAPTERS.forEach((chapter, index) => {
          ScrollTrigger.create({
            trigger: `#${chapter.id}`,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => setActiveChapter(index),
            onEnterBack: () => setActiveChapter(index),
            invalidateOnRefresh: true,
          });
        });
      });

      // Mobile (< 768px): Native full-bleed screen-by-screen flow
      mm.add('(max-width: 767px)', () => {
        CHAPTERS.forEach((chapter, index) => {
          ScrollTrigger.create({
            trigger: `#${chapter.id}`,
            start: 'top 45%',
            end: 'bottom 45%',
            onEnter: () => setActiveChapter(index),
            onEnterBack: () => setActiveChapter(index),
            invalidateOnRefresh: true,
          });
        });
      });

      // Global scroll progress tracker
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setScrollProgress(Math.round(self.progress * 100));
        },
      });

      // Return cleanup for StrictMode
      return () => {
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  const scrollToChapter = (index: number) => {
    const chapterId = CHAPTERS[index].id;
    const target = document.getElementById(chapterId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main
      ref={containerRef}
      className="relative w-full min-h-screen bg-void text-neutral-100 overflow-x-hidden selection:bg-gold-primary/30 selection:text-gold-bright"
    >
      {/* Ambient Backdrop Glow on Desktop */}
      <div
        aria-hidden="true"
        className="hidden md:block fixed inset-0 pointer-events-none z-0 ambient-stage-glow overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-primary/10 rounded-full blur-[160px] ambient-glow" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-gold-bright/5 rounded-full blur-[140px]" />
      </div>

      {/* Desktop Flanking Left Wing: Section Index & Progress Bar */}
      <aside
        aria-label="Chapter Index"
        className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-6 select-none pointer-events-auto"
      >
        <div className="flex flex-col gap-3 glass-panel rounded-3xl p-4 border border-surface-border/30 bg-void/70 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border/30 font-mono text-[10px] text-gold-muted uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-gold-bright" />
            <span>CHRONOLOGY</span>
          </div>

          {CHAPTERS.map((ch, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(idx)}
                className={`group flex items-center gap-3 text-left transition-all duration-300 ${
                  isActive ? 'translate-x-1' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full font-mono text-[10px] flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gold-bright text-void font-bold shadow-md shadow-gold-primary/40 scale-110'
                      : 'border border-surface-border/50 text-neutral-400 group-hover:border-gold-primary/50 group-hover:text-gold-bright'
                  }`}
                >
                  {ch.number}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-serif text-sm transition-colors ${
                      isActive ? 'text-gold-bright font-medium' : 'text-neutral-300 group-hover:text-white'
                    }`}
                  >
                    {ch.title}
                  </span>
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
                    {ch.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Vertical Scroll Progress Bar */}
        <div className="glass-panel rounded-full p-2 flex items-center justify-between border border-surface-border/30 bg-void/60 text-[10px] font-mono text-gold-champagne">
          <span>PROGRESS</span>
          <span className="text-gold-bright font-semibold">{scrollProgress}%</span>
        </div>
      </aside>

      {/* Desktop Flanking Right Wing: Coordinates, Aspect Badge, Tech Info */}
      <aside
        aria-label="Architectural Metadata"
        className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-4 select-none pointer-events-auto max-w-[200px]"
      >
        <div className="glass-panel rounded-3xl p-4 border border-surface-border/30 bg-void/70 backdrop-blur-md shadow-2xl flex flex-col gap-3 font-mono text-[10px]">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-border/30 text-gold-muted uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5 text-gold-bright" />
            <span>ARCHIVES</span>
          </div>

          <div>
            <div className="text-neutral-500 uppercase text-[9px]">Sanctuary Datum</div>
            <div className="text-neutral-200">[ 42° 18' N / 71° 04' W ]</div>
          </div>

          <div>
            <div className="text-neutral-500 uppercase text-[9px]">Canvas Architecture</div>
            <div className="text-gold-bright font-semibold">9:16 VERTICAL CANVASES</div>
          </div>

          <div>
            <div className="text-neutral-500 uppercase text-[9px]">Elevation Baseline</div>
            <div className="text-neutral-200">1,420M SEA LEVEL</div>
          </div>

          <div className="pt-2 border-t border-surface-border/30">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-bright text-[9px]">
              <Sparkles className="w-2.5 h-2.5" />
              <span>GPU 60 FPS ACCEL</span>
            </div>
          </div>
        </div>

        {/* Direct quick jump trigger */}
        <button
          onClick={() => scrollToChapter(5)}
          className="glass-panel rounded-2xl p-3 border border-surface-border/40 hover:border-gold-bright/60 bg-void/60 text-left transition-all duration-300 group"
        >
          <div className="font-mono text-[9px] text-gold-muted uppercase tracking-wider flex items-center justify-between">
            <span>Commission</span>
            <ArrowDown className="w-3 h-3 text-gold-primary group-hover:translate-y-0.5 transition-transform" />
          </div>
          <div className="font-serif text-sm text-neutral-200 group-hover:text-gold-bright transition-colors mt-0.5">
            Enter the Gates
          </div>
        </button>
      </aside>

      {/* Dual-Tier 9:16 Centered Stage Container */}
      {/* On Mobile (< 768px): Full-bleed 100dvh screen-by-screen scroll */}
      {/* On Desktop (>= 768px): Centered 9:16 architectural stage with rounded glass frame and glow */}
      <div
        ref={stageRef}
        className="w-full md:max-w-[480px] lg:max-w-[500px] md:mx-auto md:my-10 relative z-10 md:rounded-[36px] md:border md:border-gold-primary/30 md:shadow-2xl md:shadow-gold-primary/15 md:overflow-hidden md:bg-void"
      >
        {/* Subtle decorative stage frame borders on desktop */}
        <div className="hidden md:block absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-bright to-transparent z-30 pointer-events-none" />
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-bright to-transparent z-30 pointer-events-none" />

        {/* Narrative Chapters rendered in strict sequential DOM order */}
        <div className="flex flex-col">
          {/* Chapter 01: Hero */}
          <div className="w-full min-h-[100dvh] md:aspect-[9/16] relative flex flex-col justify-center">
            <HeroChapter
              onExplore={() => scrollToChapter(2)}
              onPlayTrailer={() => scrollToChapter(1)}
            />
          </div>

          {/* Chapter 02: Philosophy & Identity */}
          <div className="w-full min-h-[100dvh] md:aspect-[9/16] relative flex flex-col justify-center">
            <PhilosophyChapter />
          </div>

          {/* Chapter 03: Selected Works & Landscape */}
          <div className="w-full min-h-[100dvh] md:aspect-[9/16] relative flex flex-col justify-center">
            <ShowcaseChapter />
          </div>

          {/* Chapter 04: Cinematic Exhibition */}
          <div className="w-full min-h-[100dvh] md:aspect-[9/16] relative flex flex-col justify-center">
            <ExhibitionChapter />
          </div>

          {/* Chapter 05: Technical Mastery */}
          <div className="w-full min-h-[100dvh] md:aspect-[9/16] relative flex flex-col justify-center">
            <MasteryChapter />
          </div>

          {/* Chapter 06: Contact & Inquiries */}
          <div className="w-full min-h-[100dvh] md:aspect-[9/16] relative flex flex-col justify-center">
            <InquiriesChapter onOpenInquiry={() => setIsInquiryModalOpen(true)} />
          </div>
        </div>
      </div>

      {/* Interactive Inquiry Modal / Commission Drawer */}
      <InquiryModal isOpen={isInquiryModalOpen} setIsOpen={setIsInquiryModalOpen} />
    </main>
  );
};

export default CinematicStage;
