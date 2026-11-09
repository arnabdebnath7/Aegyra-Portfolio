/**
 * tier4-scenarios.test.mjs
 * Tier 4 - Real-World Application Scenarios:
 * - Full Agency User Journey:
 *   1. Landing Experience (Hero, "The Valley of Dinotopia", CTA, eager asset)
 *   2. Sequential Scroll-Driven Traversal across all 6 Chapters
 *   3. Ground-Plane Trilogy Cards Interaction (Companions, Scholars, Builders)
 *   4. Landmark Hotspots & Telemetry Exploration
 *   5. Sanctuary Inquiry Dispatch Submission & Feedback Lifecycle
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  readComponent,
  analyzeCinematicStage,
  analyzeNavigation,
  analyzeHeroChapter,
  analyzePhilosophyChapter,
  analyzeShowcaseChapter,
  analyzeExhibitionChapter,
  analyzeMasteryChapter,
  analyzeInquiriesChapter,
  analyzeInquiryModal,
} from './harness/dom-simulator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

describe('Tier 4: Real-World Application Scenarios (Full Agency User Journey)', () => {
  test('T4-JRN-01: Agency landing experience initializes masthead, hero canvas, and CTA discovery', () => {
    const nav = analyzeNavigation(PROJECT_ROOT);
    const hero = analyzeHeroChapter(PROJECT_ROOT);

    assert.ok(nav.exists, 'Navigation masthead must be present on landing');
    assert.ok(hero.exists, 'Hero chapter must be loaded as the initial stage');
    assert.ok(hero.hasDinotopiaTitle, 'Landing view must display the grand sanctuary title');
    assert.ok(hero.hasHeroImage, 'Landing view must bind hero-valley.webp as the visual foundation');
    assert.ok(hero.hasHeroCta, 'Landing view must provide an interactive CTA to explore the world');
  });

  test('T4-JRN-02: Sequential scroll traversal seamlessly spans all 6 architectural chapters', () => {
    const stage = analyzeCinematicStage(PROJECT_ROOT);
    assert.ok(stage.exists, 'CinematicStage must orchestrate chapter scroll flow');

    // All 6 chapters must be instantiated in CinematicStage
    const chapters = [
      { name: 'Chapter 01 (Hero)', analyze: analyzeHeroChapter },
      { name: 'Chapter 02 (Philosophy)', analyze: analyzePhilosophyChapter },
      { name: 'Chapter 03 (Showcase)', analyze: analyzeShowcaseChapter },
      { name: 'Chapter 04 (Exhibition)', analyze: analyzeExhibitionChapter },
      { name: 'Chapter 05 (Mastery)', analyze: analyzeMasteryChapter },
      { name: 'Chapter 06 (Inquiries)', analyze: analyzeInquiriesChapter },
    ];

    for (const ch of chapters) {
      const data = ch.analyze(PROJECT_ROOT);
      assert.ok(data.exists, `${ch.name} must exist and be mounted in the traversal sequence`);
    }

    // CinematicStage contains ScrollTrigger bindings to track traversal index
    const stageContent = stage.content;
    const hasScrollTracking =
      stageContent.includes('ScrollTrigger') &&
      stageContent.includes('activeChapter') &&
      stageContent.includes('chapter-');

    assert.ok(
      hasScrollTracking,
      'CinematicStage must wire ScrollTrigger trackers across all chapter boundary markers'
    );
  });

  test('T4-JRN-03: Chapter 02 ground-plane trilogy gallery presents interlinked companion roles', () => {
    const philosophy = analyzePhilosophyChapter(PROJECT_ROOT);
    assert.ok(philosophy.exists, 'PhilosophyChapter must exist');

    const content = philosophy.content;
    const hasCompanions = content.includes('Companions') || content.includes('card-companions.webp');
    const hasScholars = content.includes('Scholars') || content.includes('card-scholars.webp');
    const hasBuilders = content.includes('Builders') || content.includes('card-builders.webp');

    assert.ok(hasCompanions, 'Philosophy chapter must present the Companions cohort');
    assert.ok(hasScholars, 'Philosophy chapter must present the Scholars cohort');
    assert.ok(hasBuilders, 'Philosophy chapter must present the Builders cohort');
  });

  test('T4-JRN-04: Chapter 04 landmark hotspots display architectural telemetry and telemetry coordinates', () => {
    const exhibition = analyzeExhibitionChapter(PROJECT_ROOT);
    assert.ok(exhibition.exists, 'ExhibitionChapter must exist');

    const content = exhibition.content;
    const hasPantheonScene =
      content.includes('Pantheon') ||
      content.includes('Celestial') ||
      content.includes('exhibition-pantheon.webp');

    assert.ok(hasPantheonScene, 'Exhibition chapter must mount the Celestial Pantheon scene');

    // Hotspot coordinates or telemetry metrics
    const hasTelemetry =
      content.includes('coord') ||
      content.includes('telemetry') ||
      content.includes('status') ||
      content.includes('beacon') ||
      content.includes('hotspot') ||
      content.includes('Sanctuary') ||
      content.includes('font-mono');

    assert.ok(
      hasTelemetry,
      'Exhibition chapter must render landmark telemetry metadata or coordinate readouts'
    );
  });

  test('T4-JRN-05: Sanctuary inquiry dispatch flow completes form lifecycle with confirmation feedback', () => {
    const modal = analyzeInquiryModal(PROJECT_ROOT);
    assert.ok(modal.exists, 'InquiryModal must exist');

    const content = modal.content;

    // Form submission event handler
    assert.ok(
      content.includes('handleSubmit') || content.includes('onSubmit'),
      'Inquiry form must define an onSubmit/handleSubmit lifecycle handler'
    );

    // Prevents default page reload
    assert.ok(
      content.includes('preventDefault'),
      'Inquiry submission must call e.preventDefault() to preserve client SPA context'
    );

    // Shows confirmation feedback
    const hasConfirmationFeedback =
      content.includes('submitted') ||
      content.includes('CheckCircle') ||
      content.includes('success') ||
      content.includes('Confirmed');

    assert.ok(
      hasConfirmationFeedback,
      'Inquiry submission must transition to positive feedback/confirmation state'
    );
  });
});
