import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if touch device or coarse pointer
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isCoarse || isTouchDevice || prefersReducedMotion) {
      setIsTouch(true);
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Use GSAP quickTo for smooth inertial 60 FPS trailing
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3.out' });

    const handlePointerMove = (e: PointerEvent) => {
      setIsVisible(true);
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Attach hover morphing to interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('[role="tab"]') ||
          target.closest('.interactive-target'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleElementHover, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, []);

  if (isTouch) {
    return null;
  }

  return (
    <div
      data-testid="custom-cursor"
      className="custom-cursor fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Central pinpoint dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-gold-bright pointer-events-none shadow-sm shadow-gold-bright mix-blend-difference transform"
      />

      {/* Trailing ambient ring with hover scale */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 rounded-full pointer-events-none border border-gold-bright/40 transition-transform duration-200 ease-out transform ${
          isHovered
            ? 'w-14 h-14 -ml-7 -mt-7 scale-125 bg-gold-primary/10 border-gold-bright shadow-lg shadow-gold-primary/20 backdrop-blur-xs'
            : 'w-10 h-10 scale-100 bg-transparent'
        }`}
      />
    </div>
  );
};

export default CustomCursor;
