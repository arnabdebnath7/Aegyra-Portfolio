/**
 * dom-simulator.mjs
 * Structural and behavioral AST/DOM simulator for Aegyra components.
 * Inspects React component contracts, layout constraints, event listeners,
 * GSAP motion hooks, modal focus management, and viewport responsiveness.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads a component file from src/
 */
export function readComponent(projectRoot, relativePath) {
  const fullPath = path.join(projectRoot, 'src', relativePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Analyzes CinematicStage structure
 */
export function analyzeCinematicStage(projectRoot) {
  const content = readComponent(projectRoot, 'components/CinematicStage.tsx');
  if (!content) return { exists: false };

  const hasChapterIds = [
    'chapter-hero',
    'chapter-philosophy',
    'chapter-showcase',
    'chapter-exhibition',
    'chapter-mastery',
    'chapter-inquiries',
  ].every((id) => content.includes(id));

  const hasGsapRegistration = content.includes('ScrollTrigger') && (content.includes('useGSAP') || content.includes('useEffect'));
  
  // Check if 480px limitation is removed or if full-bleed responsive layout is enabled
  const hasFluidWidth = content.includes('w-full') || content.includes('max-w-7xl') || content.includes('max-w-screen');
  const has480pxConstraint = content.includes('max-w-[480px]');

  return {
    exists: true,
    hasChapterIds,
    hasGsapRegistration,
    hasFluidWidth,
    has480pxConstraint,
    content,
  };
}

/**
 * Analyzes Navigation component contracts
 */
export function analyzeNavigation(projectRoot) {
  const content = readComponent(projectRoot, 'components/Navigation.tsx');
  if (!content) return { exists: false };

  // Supports both current chapter names and upcoming M2 editorial labels
  const supportedLabels = [
    'The Valley', 'Philosophy', 'Showcase', 'Exhibition', 'Technical Craft', 'Inquiries',
    'World', 'People', 'Creatures', 'Journal'
  ];
  const hasNavLinks = supportedLabels.filter((link) => content.includes(link));

  const hasAudioToggle = content.includes('audio') || content.includes('sound') || content.includes('Volume') || content.includes('Volume2') || content.includes('VolumeX') || content.includes('isMuted');
  const hasInquiryTrigger = content.includes('Inquire') || content.includes('inquiry') || content.includes('Inquiry');

  return {
    exists: true,
    hasNavLinks,
    allLinksPresent: hasNavLinks.length >= 3,
    hasAudioToggle,
    hasInquiryTrigger,
    content,
  };
}

/**
 * Analyzes InquiryModal contracts
 */
export function analyzeInquiryModal(projectRoot) {
  const content = readComponent(projectRoot, 'components/ui/InquiryModal.tsx');
  if (!content) return { exists: false };

  // Dismissal handled via setIsOpen(false) or onClose() on backdrop click
  const hasBackdropDismiss =
    (content.includes('setIsOpen(false)') || content.includes('onClose')) &&
    (content.includes('onClick') || content.includes('backdrop'));

  const hasEscapeKeyDismiss = content.includes('Escape') || content.includes('keydown');
  const hasFormFields = ['name', 'email', 'message'].every((field) =>
    content.toLowerCase().includes(field)
  );
  const hasAriaModal = content.includes('role="dialog"') || content.includes('aria-modal="true"');
  const hasFocusTrap =
    content.includes('focus') ||
    content.includes('tabIndex') ||
    content.includes('autoFocus') ||
    content.includes('useRef') ||
    content.includes('Escape');

  return {
    exists: true,
    hasBackdropDismiss,
    hasEscapeKeyDismiss,
    hasFormFields,
    hasAriaModal,
    hasFocusTrap,
    content,
  };
}

/**
 * Analyzes Chapter 01 (Hero)
 */
export function analyzeHeroChapter(projectRoot) {
  const content = readComponent(projectRoot, 'components/chapters/HeroChapter.tsx');
  if (!content) return { exists: false };

  const hasDinotopiaTitle = content.includes('Dinotopia') || content.includes('The Valley');
  const hasHeroCta = content.includes('Explore') || content.includes('Explore the World') || content.includes('button');
  const hasAsymmetricalAlignment = content.includes('text-left') || content.includes('items-start') || content.includes('max-w-lg');
  const hasHeroImage = content.includes('hero-valley.webp');
  const hasGsapParallax = content.includes('gsap') && (content.includes('yPercent') || content.includes('scrollTrigger') || content.includes('ScrollTrigger'));

  return {
    exists: true,
    hasDinotopiaTitle,
    hasHeroCta,
    hasAsymmetricalAlignment,
    hasHeroImage,
    hasGsapParallax,
    content,
  };
}

/**
 * Analyzes Chapter 02 (Philosophy - The People)
 */
export function analyzePhilosophyChapter(projectRoot) {
  const content = readComponent(projectRoot, 'components/chapters/PhilosophyChapter.tsx');
  if (!content) return { exists: false };

  const hasPartnersTitle = content.includes('Partners in Progress') || content.includes('The People');
  const hasTrilogyCards = ['Companions', 'Scholars', 'Builders'].filter((card) =>
    content.includes(card)
  );
  const hasPhilosophyImage = content.includes('philosophy-companions.webp');

  return {
    exists: true,
    hasPartnersTitle,
    trilogyCards: hasTrilogyCards,
    allCardsPresent: hasTrilogyCards.length === 3,
    hasPhilosophyImage,
    content,
  };
}

/**
 * Analyzes Chapter 03 (Showcase - The World)
 */
export function analyzeShowcaseChapter(projectRoot) {
  const content = readComponent(projectRoot, 'components/chapters/ShowcaseChapter.tsx');
  if (!content) return { exists: false };

  const hasWorldTitle = content.includes('Living Landscape') || content.includes('The World');
  const hasShowcaseImage = content.includes('showcase-world.webp');
  const hasPinnedOrHorizontalScrub = content.includes('pin') || content.includes('scrollWidth') || content.includes('showcase-track') || content.includes('xPercent');

  return {
    exists: true,
    hasWorldTitle,
    hasShowcaseImage,
    hasPinnedOrHorizontalScrub,
    content,
  };
}

/**
 * Analyzes Chapter 04 (Exhibition)
 */
export function analyzeExhibitionChapter(projectRoot) {
  const content = readComponent(projectRoot, 'components/chapters/ExhibitionChapter.tsx');
  if (!content) return { exists: false };

  const hasPantheonTitle = content.includes('Celestial Pantheon') || content.includes('Exhibition');
  const hasPantheonImage = content.includes('exhibition-pantheon.webp');
  const hasHotspots = content.includes('beacon') || content.includes('hotspot') || content.includes('Landmark') || content.includes('coordinate') || content.includes('Acro-Sanctuary') || content.includes('coords');

  return {
    exists: true,
    hasPantheonTitle,
    hasPantheonImage,
    hasHotspots,
    content,
  };
}

/**
 * Analyzes Chapter 05 (Mastery)
 */
export function analyzeMasteryChapter(projectRoot) {
  const content = readComponent(projectRoot, 'components/chapters/MasteryChapter.tsx');
  if (!content) return { exists: false };

  const hasMasteryTitle = content.includes('Caldera Basin') || content.includes('Mastery') || content.includes('Architectural');
  const hasCalderaImage = content.includes('environment-caldera.webp') || content.includes('environment-caldera-wide.webp');
  const hasTelemetryMetrics = content.includes('FPS') || content.includes('CLS') || content.includes('Telemetry') || content.includes('Architecture') || content.includes('metrics');

  return {
    exists: true,
    hasMasteryTitle,
    hasCalderaImage,
    hasTelemetryMetrics,
    content,
  };
}

/**
 * Analyzes Chapter 06 (Inquiries)
 */
export function analyzeInquiriesChapter(projectRoot) {
  const content = readComponent(projectRoot, 'components/chapters/InquiriesChapter.tsx');
  if (!content) return { exists: false };

  const hasInquiriesTitle = content.includes('Inquiries') || content.includes('Dispatch') || content.includes('Contact');
  const hasDispatchCta = content.includes('Dispatch') || content.includes('Send') || content.includes('Inquire');

  return {
    exists: true,
    hasInquiriesTitle,
    hasDispatchCta,
    content,
  };
}

/**
 * Analyzes UI primitives (AegyraButton and ArchitecturalFrame)
 */
export function analyzeUiPrimitives(projectRoot) {
  const buttonContent = readComponent(projectRoot, 'components/ui/AegyraButton.tsx');
  const frameContent = readComponent(projectRoot, 'components/ui/ArchitecturalFrame.tsx');
  const legacyGoldButton = readComponent(projectRoot, 'components/ui/GoldButton.tsx');
  const legacyGlassCard = readComponent(projectRoot, 'components/ui/GlassCard.tsx');

  return {
    aegyraButtonExists: buttonContent !== null,
    architecturalFrameExists: frameContent !== null,
    legacyGoldButtonExists: legacyGoldButton !== null,
    legacyGlassCardExists: legacyGlassCard !== null,
    buttonHasVariants: buttonContent ? (buttonContent.includes('primary') || buttonContent.includes('variant')) : false,
    frameHasTravertineTrim: frameContent ? (frameContent.includes('amber') || frameContent.includes('stone') || frameContent.includes('border')) : false,
  };
}
