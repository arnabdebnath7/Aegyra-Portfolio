import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, Clock, Mail, ArrowUpRight, Github, Shield, Globe } from 'lucide-react';
import { GoldButton } from '../ui/GoldButton';
import { GlassCard } from '../ui/GlassCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface InquiriesChapterProps {
  onOpenInquiry: () => void;
}

export const InquiriesChapter: React.FC<InquiriesChapterProps> = ({ onOpenInquiry }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [timeString, setTimeString] = useState('');

  // Live real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        gsap.set('.inquiry-title-line, .inquiry-meta, .inquiry-footer', {
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
        '.inquiry-title-line',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power3.out' }
      );

      tl.fromTo(
        '.inquiry-meta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.6'
      );

      tl.fromTo(
        '.inquiry-footer',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="chapter-inquiries"
      ref={sectionRef}
      data-testid="chapter-inquiries"
      className="relative w-full h-full min-h-[100dvh] md:min-h-full flex flex-col justify-between overflow-hidden bg-void select-none py-12 md:py-16 px-4 md:px-8"
    >
      {/* Background with Ambient Radial Glow and Wide Caldera Vista */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/assets/images/environment-caldera-wide.webp"
          alt="Wide panoramic vista of the Aegyra Caldera"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/90 to-void pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-primary/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Top Header & Eyebrow */}
      <div className="relative z-10 text-center max-w-xl mx-auto pt-6">
        <div className="inquiry-meta inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-primary/30 bg-surface-glass backdrop-blur-md mb-3">
          <Sparkles className="w-3 h-3 text-gold-bright" />
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold-champagne">
            CHAPTER 06 · EXPEDITION CLOSE
          </span>
        </div>

        <div className="inquiry-meta font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-gold-bright font-medium mb-2">
          COMMISSION & INQUIRIES
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-white leading-tight mb-4">
          <span className="block overflow-hidden">
            <span className="block inquiry-title-line">Enter the</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block inquiry-title-line italic text-gold-bright">Gates</span>
          </span>
        </h2>

        <p className="inquiry-meta font-sans text-neutral-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-md mx-auto mb-8">
          The sanctuary doors remain open for visionary architectural collaborations, editorial art
          direction, and historical preservation inquiries.
        </p>

        {/* Primary CTA trigger */}
        <div className="inquiry-meta flex flex-wrap items-center justify-center gap-4">
          <GoldButton
            variant="primary"
            onClick={onOpenInquiry}
            className="group px-8 py-3.5 shadow-xl shadow-gold-primary/25"
          >
            <Mail className="w-4 h-4 text-void group-hover:scale-110 transition-transform" />
            <span>Open Commission Drawer</span>
          </GoldButton>
        </div>
      </div>

      {/* Center Status Card: Real-time Clock & Coordinates */}
      <div className="relative z-10 w-full max-w-md mx-auto my-6">
        <GlassCard className="inquiry-meta !p-4 bg-void/80 border-gold-primary/30 text-center">
          <div className="flex items-center justify-between font-mono text-xs text-gold-champagne mb-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-bright animate-spin" style={{ animationDuration: '10s' }} />
              <span>TEMPLE HOROLOGY</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-surface-glass border border-gold-primary/30 text-gold-bright">
              {timeString || 'SYNCHRONIZING...'}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-surface-border/30">
            <span>AEGYRA SANCTUARY COORDINATES</span>
            <span className="text-neutral-200">[ 42° 18' N / 71° 04' W ]</span>
          </div>
        </GlassCard>
      </div>

      {/* Concluding Footer Landmark with Credits & Metadata */}
      <footer className="inquiry-footer relative z-10 w-full max-w-2xl mx-auto pt-6 border-t border-surface-border/40 text-center font-mono text-[10px] text-neutral-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-neutral-300">
            <Shield className="w-3.5 h-3.5 text-gold-bright" />
            <span>© 2026 Aegyra Archives. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/arnabdebnath7/Aegyra-Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gold-muted hover:text-gold-bright transition-colors"
            >
              <Github className="w-3 h-3" />
              <span>Repository</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </a>
            <div className="flex items-center gap-1 text-neutral-400">
              <Globe className="w-3 h-3 text-gold-primary" />
              <span>9:16 Vertical Canvas</span>
            </div>
          </div>
        </div>
        <p className="text-neutral-500 text-[9px] font-sans font-light">
          Crafted with Vite, React, GSAP ScrollTrigger, Cormorant Garamond, and Tailwind CSS.
        </p>
      </footer>
    </section>
  );
};

export default InquiriesChapter;
