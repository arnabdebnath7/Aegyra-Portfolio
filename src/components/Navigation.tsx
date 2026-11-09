import React, { useState } from 'react';
import { Compass, Volume2, VolumeX, Menu, X, Globe, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeChapter?: number;
  onNavigate?: (chapterIndex: number) => void;
  onOpenInquiry?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeChapter = 0,
  onNavigate,
  onOpenInquiry,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'The Valley', index: 0, id: 'chapter-hero' },
    { label: 'Philosophy', index: 1, id: 'chapter-philosophy' },
    { label: 'Showcase', index: 2, id: 'chapter-showcase' },
    { label: 'Exhibition', index: 3, id: 'chapter-exhibition' },
    { label: 'Technical Craft', index: 4, id: 'chapter-mastery' },
    { label: 'Inquiries', index: 5, id: 'chapter-inquiries' },
  ];

  const handleLinkClick = (index: number) => {
    if (onNavigate) {
      onNavigate(index);
    } else {
      const element = document.getElementById(navLinks[index].id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel rounded-full px-5 py-3 border border-surface-border/30 bg-void/70 backdrop-blur-md">
        {/* Brand Crest */}
        <div
          onClick={() => handleLinkClick(0)}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="Aegyra home"
        >
          {/* Classical Temple Glyph */}
          <div className="w-8 h-8 rounded-full border border-gold-primary/60 flex items-center justify-center bg-surface-glass group-hover:border-gold-bright transition-colors">
            <Compass className="w-4 h-4 text-gold-bright transition-transform duration-500 group-hover:rotate-45" />
          </div>
          <div>
            <span className="font-serif text-lg md:text-xl font-normal tracking-wide text-neutral-100 group-hover:text-gold-bright transition-colors block leading-tight">
              Aegyra
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-gold-muted block">
              Archives · 9:16
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.index)}
              className={`font-sans text-xs tracking-wider uppercase transition-colors py-1 relative ${
                activeChapter === link.index
                  ? 'text-gold-bright font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>{link.label}</span>
              {activeChapter === link.index && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-bright to-transparent" />
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions: Audio Toggle + Inquiries CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Coordinates badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-surface-border/40 bg-surface-glass text-[10px] font-mono text-gold-muted">
            <Globe className="w-3 h-3 text-gold-primary" />
            <span>42°18'N 71°04'W</span>
          </div>

          {/* Sound / Atmosphere Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Unmute atmospheric audio' : 'Mute audio'}
            className="w-8 h-8 rounded-full border border-surface-border/40 flex items-center justify-center text-neutral-400 hover:text-gold-bright hover:border-gold-primary/40 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-gold-bright animate-pulse" />}
          </button>

          {/* Direct Inquiries trigger */}
          {onOpenInquiry && (
            <button
              onClick={onOpenInquiry}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-primary/20 border border-gold-primary/40 text-gold-bright text-xs font-mono tracking-wider hover:bg-gold-primary/30 hover:border-gold-bright transition-all"
            >
              <Sparkles className="w-3 h-3" />
              <span>Inquire</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden w-8 h-8 rounded-full border border-surface-border/40 flex items-center justify-center text-neutral-200 hover:text-gold-bright transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 p-6 glass-panel rounded-3xl border border-surface-border/50 bg-void/95 shadow-2xl animate-in fade-in duration-200">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.index)}
                className={`text-left px-4 py-2.5 rounded-xl font-serif text-lg tracking-wide transition-colors ${
                  activeChapter === link.index
                    ? 'text-gold-bright bg-gold-primary/10 font-medium'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-gold-muted opacity-60">0{link.index + 1}</span>
                </div>
              </button>
            ))}
            {onOpenInquiry && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="mt-2 text-center w-full py-3 rounded-full bg-gold-bright text-void font-sans text-xs uppercase font-semibold tracking-wider"
              >
                Initiate Inquiry
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
