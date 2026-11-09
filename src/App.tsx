import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { CinematicStage } from './components/CinematicStage';
import { CustomCursor } from './components/CustomCursor';
import { NoiseOverlay } from './components/NoiseOverlay';

export const App: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState(0);

  const handleNavigate = (index: number) => {
    setActiveChapter(index);
    const chapterIds = [
      'chapter-hero',
      'chapter-philosophy',
      'chapter-showcase',
      'chapter-exhibition',
      'chapter-mastery',
      'chapter-inquiries',
    ];
    const el = document.getElementById(chapterIds[index]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      data-testid="aegyra-portfolio"
      className="relative w-full min-h-screen bg-void text-neutral-100 selection:bg-gold-primary/30 selection:text-gold-bright overflow-x-hidden"
    >
      {/* 35mm Film Grain SVG Overlay */}
      <NoiseOverlay />

      {/* Magnetic Proximity Cursor */}
      <CustomCursor />

      {/* Primary Editorial Masthead & Navigation */}
      <Navigation
        activeChapter={activeChapter}
        onNavigate={handleNavigate}
        onOpenInquiry={() => handleNavigate(5)}
      />

      {/* Central 9:16 Cinematic Stage Architecture */}
      <CinematicStage />
    </div>
  );
};

export default App;
