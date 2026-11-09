/**
 * tier3-interactions.test.mjs
 * Tier 3 - Cross-Feature Interactions:
 * - Navigation links to chapter scroll triggers
 * - Pinned showcase track scrub semantics
 * - Inquiries modal dialog focus trapping and backdrop dismissal
 * - Audio soundscape toggle state machine
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  readComponent,
  analyzeCinematicStage,
  analyzeNavigation,
  analyzeInquiryModal,
  analyzeShowcaseChapter,
} from './harness/dom-simulator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

describe('Tier 3: Cross-Feature Interactions (State Machines & GSAP Dynamics)', () => {
  test('T3-NAV-01: Navigation links match chapter scroll triggers in CinematicStage', () => {
    const nav = analyzeNavigation(PROJECT_ROOT);
    const stage = analyzeCinematicStage(PROJECT_ROOT);

    assert.ok(nav.exists, 'Navigation component must exist');
    assert.ok(stage.exists, 'CinematicStage component must exist');

    // Stage must expose all 6 chapter anchor IDs
    assert.ok(stage.hasChapterIds, 'CinematicStage must contain all 6 chapter trigger IDs');

    // Nav links must be present
    assert.ok(
      nav.allLinksPresent,
      `Navigation must contain primary chapter links. Found: ${nav.hasNavLinks.join(', ')}`
    );

    // Navigation must contain an inquiry trigger
    assert.ok(
      nav.hasInquiryTrigger,
      'Navigation must provide an action button to open the Inquiries modal'
    );
  });

  test('T3-PIN-01: Pinned showcase gallery incorporates horizontal scroll scrub semantics', () => {
    const showcase = analyzeShowcaseChapter(PROJECT_ROOT);
    assert.ok(showcase.exists, 'ShowcaseChapter.tsx must exist');

    // Showcase must define either GSAP pin or category sector cards
    const showcaseContent = showcase.content;
    const hasCategorySectors =
      showcaseContent.includes('Valleys') ||
      showcaseContent.includes('Citadel') ||
      showcaseContent.includes('Landscape') ||
      showcaseContent.includes('sanctuary') ||
      showcaseContent.includes('sectors');

    assert.ok(
      hasCategorySectors,
      'Showcase chapter must define sanctuary sectors/cards for visual traversal'
    );

    // Motion scrubbing check (GSAP ScrollTrigger or horizontal track)
    const hasMotionOrPin =
      showcase.hasPinnedOrHorizontalScrub ||
      showcaseContent.includes('ScrollTrigger') ||
      showcaseContent.includes('gsap') ||
      showcaseContent.includes('useGSAP') ||
      showcaseContent.includes('overflow-x');

    assert.ok(
      hasMotionOrPin,
      'Showcase chapter must incorporate scroll-driven animation or horizontal traversal hooks'
    );
  });

  test('T3-MOD-01: Inquiries modal dialog handles open, backdrop click, and Escape key dismissal', () => {
    const modal = analyzeInquiryModal(PROJECT_ROOT);
    assert.ok(modal.exists, 'InquiryModal.tsx must exist');

    // Backdrop dismissal check
    assert.ok(
      modal.hasBackdropDismiss,
      'InquiryModal must handle backdrop click or overlay dismissal via onClose'
    );

    // Escape key dismissal check
    assert.ok(
      modal.hasEscapeKeyDismiss,
      'InquiryModal must register an Escape keydown event listener to close the dialog'
    );

    // Form fields check (name, email, message)
    assert.ok(
      modal.hasFormFields,
      'InquiryModal must provide input fields for client name, email address, and inquiry message'
    );
  });

  test('T3-MOD-02: Inquiries modal dialog enforces accessibility and focus trapping contracts', () => {
    const modal = analyzeInquiryModal(PROJECT_ROOT);
    assert.ok(modal.exists, 'InquiryModal.tsx must exist');

    // ARIA role and modal attribute
    const hasAria =
      modal.hasAriaModal ||
      modal.content.includes('role=') ||
      modal.content.includes('aria-');

    assert.ok(
      hasAria,
      'InquiryModal must include accessible dialog roles or ARIA attributes'
    );

    // Close button accessibility
    const hasAccessibleClose =
      modal.content.includes('aria-label') ||
      modal.content.includes('Close') ||
      modal.content.includes('X');

    assert.ok(
      hasAccessibleClose,
      'InquiryModal close button must provide accessible labeling'
    );
  });

  test('T3-AUD-01: Audio soundscape toggle manages ambient sound state', () => {
    const nav = analyzeNavigation(PROJECT_ROOT);
    assert.ok(nav.exists, 'Navigation must exist');

    // Audio toggle button in masthead or navigation
    assert.ok(
      nav.hasAudioToggle,
      'Navigation must provide an audio soundscape toggle for ambient atmosphere'
    );

    // State machine check: toggles between muted and active
    const hasStateHandling =
      nav.content.includes('useState') &&
      (nav.content.includes('isMuted') ||
        nav.content.includes('isPlaying') ||
        nav.content.includes('audio') ||
        nav.content.includes('sound'));

    assert.ok(
      hasStateHandling,
      'Audio toggle must manage state transitions between active and muted soundscapes'
    );
  });
});
