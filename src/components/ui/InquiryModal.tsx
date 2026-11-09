import React, { useEffect, useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { GoldButton } from './GoldButton';

interface InquiryModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, setIsOpen }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('commission');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-md bg-void/80 transition-all duration-300"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-gold-primary/30 shadow-2xl shadow-gold-primary/10 overflow-hidden bg-void/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-surface-border/30">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-champagne block">
              Direct Communication
            </span>
            <h2 id="inquiry-title" className="font-serif text-2xl md:text-3xl text-neutral-100 font-normal mt-1">
              Initiate Commission
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
            className="w-10 h-10 rounded-full border border-surface-border/40 flex items-center justify-center text-neutral-400 hover:text-gold-bright hover:border-gold-primary/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-gold-bright mb-4 animate-bounce" />
            <h3 className="font-serif text-2xl text-white mb-2">Inquiry Transmitted</h3>
            <p className="font-sans text-neutral-400 text-sm max-w-xs">
              Your message has reached the Aegyra Archives. An emissary will respond within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="inquiry-name" className="block font-mono text-xs text-neutral-400 mb-1 tracking-wider uppercase">
                Your Name / Organization
              </label>
              <input
                id="inquiry-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lord / Architect ..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-glass border border-surface-border/40 text-neutral-100 placeholder-neutral-500 font-sans text-sm focus:outline-none focus:border-gold-primary/70 focus:ring-1 focus:ring-gold-primary/70 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="inquiry-email" className="block font-mono text-xs text-neutral-400 mb-1 tracking-wider uppercase">
                Email Address
              </label>
              <input
                id="inquiry-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="archivist@aegyra.realm"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-glass border border-surface-border/40 text-neutral-100 placeholder-neutral-500 font-sans text-sm focus:outline-none focus:border-gold-primary/70 focus:ring-1 focus:ring-gold-primary/70 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="inquiry-type" className="block font-mono text-xs text-neutral-400 mb-1 tracking-wider uppercase">
                Inquiry Domain
              </label>
              <select
                id="inquiry-type"
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-glass border border-surface-border/40 text-neutral-200 font-sans text-sm focus:outline-none focus:border-gold-primary/70 focus:ring-1 focus:ring-gold-primary/70 transition-colors"
              >
                <option value="commission">Editorial Design & Art Direction</option>
                <option value="architecture">Architectural Visualization</option>
                <option value="exhibition">Cinematic Exhibition Licensing</option>
                <option value="collaboration">Research & Coexistence Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="inquiry-message" className="block font-mono text-xs text-neutral-400 mb-1 tracking-wider uppercase">
                Expedition Brief / Message
              </label>
              <textarea
                id="inquiry-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your vision, timeline, and architectural scope..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-glass border border-surface-border/40 text-neutral-100 placeholder-neutral-500 font-sans text-sm focus:outline-none focus:border-gold-primary/70 focus:ring-1 focus:ring-gold-primary/70 transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <a
                href="mailto:contact@aegyra.portfolio?subject=Portfolio%20Inquiry"
                className="font-mono text-xs text-gold-muted hover:text-gold-bright underline transition-colors"
              >
                Or open direct mailto link
              </a>
              <GoldButton type="submit" variant="primary" className="px-6 py-2.5">
                <span>Dispatch</span>
                <Send className="w-3.5 h-3.5 ml-1" />
              </GoldButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
