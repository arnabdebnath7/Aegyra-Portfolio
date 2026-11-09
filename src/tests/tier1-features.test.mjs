/**
 * tier1-features.test.mjs
 * Tier 1 - Core Feature Coverage:
 * - Natural Color Palette Tokens (Stone Marble, Emerald, Azure Cyan, Sunlit Amber)
 * - Obsolete Gold Token Deprecation & Backward-Compatibility Mapping
 * - Art-Integrated Layout Primitives & Structural Components
 * - WebP Artwork Asset Availability (all 10 files with RIFF/WEBP headers)
 * - Clean Production Build Verification
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { analyzeThemeTokens } from './harness/token-analyzer.mjs';
import { auditAssetIntegrity } from './harness/asset-validator.mjs';
import { inspectBuildArtifacts } from './harness/build-verifier.mjs';
import {
  analyzeCinematicStage,
  analyzeHeroChapter,
  analyzePhilosophyChapter,
  analyzeShowcaseChapter,
  analyzeUiPrimitives,
} from './harness/dom-simulator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

describe('Tier 1: Feature Coverage (Core Design & Artifact Foundations)', () => {
  test('T1-TOK-01: 4-Pillar Natural Color Palette tokens are defined in src/index.css', () => {
    const { tokenReport } = analyzeThemeTokens(PROJECT_ROOT);
    
    assert.ok(
      tokenReport.foundTokens >= 20,
      `Expected at least 20 natural tokens, found ${tokenReport.foundTokens}/${tokenReport.totalRequired}. Missing: ${tokenReport.missingTokens.join(', ')}`
    );

    // Verify key landmark tokens from each pillar
    const canvas = tokenReport.tokens['--color-stone-canvas'];
    assert.ok(canvas, 'Missing --color-stone-canvas');
    assert.equal(canvas.actual.toUpperCase(), '#080D0B');

    const amber = tokenReport.tokens['--color-amber-sunlit'];
    assert.ok(amber, 'Missing --color-amber-sunlit');
    assert.equal(amber.actual.toUpperCase(), '#E9BB7D');

    const emerald = tokenReport.tokens['--color-emerald-deep'];
    assert.ok(emerald, 'Missing --color-emerald-deep');
    assert.equal(emerald.actual.toUpperCase(), '#061A14');

    const cyan = tokenReport.tokens['--color-cyan-waterfall'];
    assert.ok(cyan, 'Missing --color-cyan-waterfall');
    assert.equal(cyan.actual.toUpperCase(), '#2C8BA9');
  });

  test('T1-TOK-02: Tailwind configuration extends semantic natural color scales', () => {
    const { tailwindContent } = analyzeThemeTokens(PROJECT_ROOT);

    assert.ok(tailwindContent.includes('stone:'), 'tailwind.config.js missing stone color scale');
    assert.ok(tailwindContent.includes('emerald:'), 'tailwind.config.js missing emerald color scale');
    assert.ok(tailwindContent.includes('cyan:'), 'tailwind.config.js missing cyan color scale');
    assert.ok(tailwindContent.includes('amber:'), 'tailwind.config.js missing amber color scale');
  });

  test('T1-TOK-03: Obsolete gold tokens have clean CSS variable mapping or deprecation', () => {
    const { obsoleteTokensAnalysis, tailwindContent } = analyzeThemeTokens(PROJECT_ROOT);

    assert.ok(
      obsoleteTokensAnalysis.hasCleanMapping,
      'tailwind.config.js should map legacy void/gold tokens to semantic CSS variables for backward compatibility'
    );
    assert.ok(
      tailwindContent.includes('--color-stone-canvas'),
      'Legacy void should alias to --color-stone-canvas'
    );
    assert.ok(
      tailwindContent.includes('--color-amber-sunlit'),
      'Legacy gold-bright should alias to --color-amber-sunlit'
    );
  });

  test('T1-TOK-04: Glassmorphic and material utility classes are defined in src/index.css', () => {
    const { utilityClasses } = analyzeThemeTokens(PROJECT_ROOT);

    assert.ok(utilityClasses.hasGlassPanel, 'Missing .glass-panel utility in src/index.css');
    assert.ok(utilityClasses.hasGlassPill, 'Missing .glass-pill utility in src/index.css');
    assert.ok(utilityClasses.hasAmbientGlow, 'Missing .ambient-glow utility in src/index.css');
    assert.ok(utilityClasses.hasAmbientStageGlow, 'Missing .ambient-stage-glow utility in src/index.css');
    assert.ok(utilityClasses.hasScrollbarGutter, 'Missing scrollbar-gutter: stable in src/index.css');
    assert.ok(utilityClasses.hasOverflowClip, 'Missing overflow-x: clip in src/index.css');
  });

  test('T1-LAY-01: Art-integrated UI primitives exist in src/components/ui/', () => {
    const ui = analyzeUiPrimitives(PROJECT_ROOT);

    // If worker M1 has finished, AegyraButton & ArchitecturalFrame exist; otherwise legacy exist
    assert.ok(
      ui.aegyraButtonExists || ui.legacyGoldButtonExists,
      'Must have either AegyraButton or legacy GoldButton primitive'
    );
    assert.ok(
      ui.architecturalFrameExists || ui.legacyGlassCardExists,
      'Must have either ArchitecturalFrame or legacy GlassCard primitive'
    );
  });

  test('T1-LAY-02: Chapter layout contracts integrate artwork and structure', () => {
    const hero = analyzeHeroChapter(PROJECT_ROOT);
    assert.ok(hero.exists, 'HeroChapter.tsx must exist');
    assert.ok(hero.hasDinotopiaTitle, 'Hero chapter must feature Dinotopia title');
    assert.ok(hero.hasHeroImage, 'Hero chapter must bind hero-valley.webp');

    const philosophy = analyzePhilosophyChapter(PROJECT_ROOT);
    assert.ok(philosophy.exists, 'PhilosophyChapter.tsx must exist');
    assert.ok(philosophy.hasPhilosophyImage, 'Philosophy chapter must bind philosophy-companions.webp');

    const showcase = analyzeShowcaseChapter(PROJECT_ROOT);
    assert.ok(showcase.exists, 'ShowcaseChapter.tsx must exist');
    assert.ok(showcase.hasShowcaseImage, 'Showcase chapter must bind showcase-world.webp');
  });

  test('T1-AST-01: All 10 WebP artwork assets exist with valid RIFF/WEBP magic headers', () => {
    const audit = auditAssetIntegrity(PROJECT_ROOT);

    assert.ok(audit.directoryExists, 'public/assets/images/ directory must exist');
    assert.equal(
      audit.passedAssets,
      10,
      `Expected all 10 assets to pass integrity check, passed ${audit.passedAssets}/10. Failed: ${audit.results.filter((r) => !r.isPassing).map((r) => r.name).join(', ')}`
    );
    assert.ok(audit.allValid, 'All 10 WebP artwork assets must be valid');
  });

  test('T1-BLD-01: Production build artifacts are present and non-empty in dist/', () => {
    const artifacts = inspectBuildArtifacts(PROJECT_ROOT);

    assert.ok(artifacts.distExists, 'dist/ directory must exist');
    assert.ok(artifacts.indexHtml.exists, 'dist/index.html must exist');
    assert.ok(artifacts.indexHtml.hasRootContainer, 'dist/index.html must contain #root container');
    assert.ok(artifacts.cssFiles.length > 0, 'dist/assets/ must contain production CSS');
    assert.ok(artifacts.jsFiles.length > 0, 'dist/assets/ must contain production JS bundle');
    assert.ok(artifacts.isValid, 'Build artifacts must satisfy size and structure validation');
  });
});
