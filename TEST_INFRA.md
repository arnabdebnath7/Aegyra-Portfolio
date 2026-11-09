# Aegyra Portfolio: Test Infrastructure & Verification Specification

**Specification Version**: 1.0.0  
**Target Environment**: Node.js v26.13.0+ / Linux Cloud Shell / Vercel Edge  
**Integrity Level**: Opaque-Box Comprehensive E2E Verification  
**Author**: Test Writer M4 (E2E Testing Architect)  

---

## 1. Architectural Philosophy & Principles

The Aegyra Portfolio redesign converts a constrained mobile-framed portfolio into a production-grade, immersive agency-level experience featuring GSAP multi-plane depth motion, an authentic 4-pillar natural color palette, asymmetrical art-integrated layouts, and full-bleed stage responsiveness.

To guarantee that visual, structural, and interactive specifications are genuinely met without relying on superficial facade tests, this test infrastructure enforces four fundamental principles:

1. **Opaque-Box Verification**: Tests validate observable contracts, layout bounds, CSS token declarations, DOM attributes, event bindings, and build artifacts from the consumer's perspective.
2. **Progressive Testability**: Tests are partitioned into hierarchical tiers (Tier 1 through Tier 4) allowing independent verification of design tokens, layout boundaries, interactive mechanics, and complete end-to-end user journeys.
3. **Zero External Daemon Dependency**: The test runner runs standalone in Node.js v26 with native `node:test` and `node:assert`, executing in under 2 seconds without requiring an external web server process or headless browser binary installation.
4. **Adversarial Integrity**: Tests explicitly verify edge boundaries (320px to 2560px viewports), horizontal overflow prevention (`overflow-x: clip`), WCAG 2.2 AAA contrast ratios, reduced-motion accessibility overrides, and modal focus trapping.

---

## 2. Test Suite Architecture & Tier Hierarchy

```
src/tests/
├── run-e2e.mjs                  # Master test runner & CLI orchestrator
├── tier1-features.test.mjs      # Tier 1: Palette tokens, obsolete mappings, layout, assets, build
├── tier2-boundaries.test.mjs    # Tier 2: Viewports (320-2560px), overflow clip, reduced motion, hydration
├── tier3-interactions.test.mjs  # Tier 3: Nav links, pinned showcase scrub, modal focus trap & backdrop
├── tier4-scenarios.test.mjs     # Tier 4: Full agency journey traversal across 6 chapters & inquiry dispatch
└── harness/
    ├── dom-simulator.mjs        # Virtual DOM, layout box calculator, and viewport emulator
    ├── token-analyzer.mjs       # CSS variable and Tailwind theme token extractor & contrast auditor
    ├── asset-validator.mjs      # Binary WebP header & dimension integrity checker
    └── build-verifier.mjs       # Bundler artifact inspector (dist/ index, css, js)
```

---

## 3. Tier Coverage Matrix & Acceptance Criteria

### Tier 1: Feature Coverage (Core Design & Artifact Foundations)

| Test ID | Test Target | Verification Method | Expected Outcome |
|---|---|---|---|
| `T1-TOK-01` | 4-Pillar Natural Color Palette | Inspect `src/index.css` `:root` variables | Contains all 24 natural tokens: Stone Marble (`#080D0B`, `#121C19`, `#1A2623`, `#2A3834`, `#87979B`, `#C5BDB2`, `#F3F3EE`), Emerald Green (`#061A14`, `#0C261F`, `#1B4332`, `#2D6A4F`, `#556D3F`, `#80A36E`), Azure Waterfall Cyan (`#09202B`, `#114656`, `#1F7E9B`, `#2C8BA9`, `#41B3C8`, `#A8E6F0`), and Sunlit Amber (`#4E381E`, `#A9895D`, `#DE9E4B`, `#E9BB7D`, `#FBE4BE`). |
| `T1-TOK-02` | Tailwind Theme Token Integration | Inspect `tailwind.config.js` `theme.extend.colors` | Semantic scales `stone`, `emerald`, `cyan`, `amber` defined with CSS variable references. |
| `T1-TOK-03` | Obsolete Gold Token Deprecation/Mapping | Inspect `tailwind.config.js` and `src/index.css` | Hardcoded `#D4A359` / `#F1B873` either removed or re-mapped cleanly to `var(--color-amber-sunlit)` / `var(--color-amber-base)` as backward-compatibility aliases. |
| `T1-TOK-04` | Material & Glassmorphism Utilities | Inspect `src/index.css` classes | `.glass-panel`, `.glass-pill`, `.ambient-glow`, `.ambient-stage-glow` defined with blur and natural borders. |
| `T1-LAY-01` | Art-Integrated Layout Primitives | Inspect component exports in `src/components/ui/` | `AegyraButton.tsx` and `ArchitecturalFrame.tsx` present and exporting functional UI components. |
| `T1-LAY-02` | Removal of Restrictive 480px Phone Frame | Inspect `CinematicStage.tsx` container classes | Desktop container does not constrain width to `max-w-[480px]`; responsive fluid width enabled. |
| `T1-AST-01` | Public Asset Availability | Verify `public/assets/images/*.webp` | All 10 WebP files exist, non-zero size, with valid `RIFF....WEBP` binary magic numbers. |
| `T1-BLD-01` | Production Build Verification | Execute `npm run build` | Exits with code 0; `dist/index.html`, `dist/assets/*.css`, `dist/assets/*.js` generated. |

---

### Tier 2: Boundary & Corner Cases (Responsive & Environmental Rigor)

| Test ID | Test Target | Verification Method | Expected Outcome |
|---|---|---|---|
| `T2-RSP-01` | Mobile Viewport (320px) | Simulate narrow 320px width | No horizontal scroll clipping; typography wraps gracefully; padding remains within viewport. |
| `T2-RSP-02` | Tablet Viewport (768px) | Simulate 768px breakpoint | Ground-plane card grid transitions cleanly (single to multi-column); navigation adjusts layout. |
| `T2-RSP-03` | Desktop Viewport (1280px) | Simulate 1280px standard canvas | Asymmetrical left-aligned typography protects right-hand focal subjects (acropolis, arch, companion). |
| `T2-RSP-04` | Ultra-Wide Viewport (2560px) | Simulate 2560px 4K monitor | Max-width containment boundaries prevent grotesque over-stretching; canvas remains centered. |
| `T2-OVR-01` | Horizontal Overflow Prevention | Audit root and body CSS rules | `overflow-x: clip` or `overflow-x: hidden` applied to outer boundaries; `scrollbar-gutter: stable` active. |
| `T2-ACC-01` | WCAG 2.2 AAA Contrast Verification | Calculate relative luminance between foreground and background | Body copy (`#C5BDB2` on `#080D0B`) ≥ 8.28:1; Marble titles (`#F3F3EE` on `#080D0B`) ≥ 17.59:1 (exceeds AAA 7.0:1 threshold). |
| `T2-MOT-01` | Reduced-Motion Media Handling | Check `prefers-reduced-motion` logic in motion hooks | GSAP animations adhere to user reduced-motion preferences, disabling high-velocity translation scrubs. |
| `T2-HYD-01` | Font & Asset Hydration Safety | Audit font loading and aspect ratio locks | Locked aspect ratios (`aspect-[9/16]`, `aspect-video`) avoid layout shift before assets load (`CLS = 0.00`). |

---

### Tier 3: Cross-Feature Interactions (State Machines & GSAP Dynamics)

| Test ID | Test Target | Verification Method | Expected Outcome |
|---|---|---|---|
| `T3-NAV-01` | Navigation Chapter Anchor Synchronization | Verify nav links match chapter DOM elements | Nav links for `World`, `People`, `Creatures`, `Journal` align with chapter identifiers `#chapter-hero`, `#chapter-philosophy`, `#chapter-showcase`, `#chapter-exhibition`, `#chapter-mastery`, `#chapter-inquiries`. |
| `T3-PIN-01` | Pinned Showcase Horizontal Scrub Track | Audit `ShowcaseChapter.tsx` motion contract | Section locks with `pin: true` while horizontal track `.showcase-track` translates across horizontal travel distance. |
| `T3-MOD-01` | Inquiries Modal Open / Close State | Simulate inquiry trigger and dismissal | Modal appears on inquiry action; closes on backdrop click and Esc key. |
| `T3-MOD-02` | Modal Focus Trapping & Accessibility | Inspect modal keyboard navigation | Focus trapped within modal elements; `aria-modal="true"` and role="dialog" present. |
| `T3-AUD-01` | Audio Ambient Soundscape Toggle | Simulate soundscape toggle button | Toggle switches between active and muted states without unhandled exceptions. |

---

### Tier 4: Real-World Application Scenarios (Full Agency User Journey)

| Test ID | Test Target | Verification Method | Expected Outcome |
|---|---|---|---|
| `T4-JRN-01` | Hero Landing & Discovery CTA | Simulate landing at Chapter 01 | Displays "The Valley of Dinotopia", asymmetrical CTA button "Explore the World", and scroll indicator. |
| `T4-JRN-02` | Sequential Chapter Traversal | Simulate continuous downward scroll scrub | Traverses cleanly through all 6 chapters: Hero → Philosophy → Showcase → Exhibition → Mastery → Inquiries with active chapter tracker updating accurately. |
| `T4-JRN-03` | Ground-Plane Trilogy Card Interaction | Simulate hover/focus on Chapter 02 trilogy | Companions, Scholars, and Builders cards trigger active brass border halos. |
| `T4-JRN-04` | Hotspot Telemetry Inspection | Simulate hotspot selection in Chapter 04 | Celestial Pantheon hotspot beacons update coordinate readouts in Space Mono. |
| `T4-JRN-05` | Inquiry Dispatch Submission | Simulate inquiry form submission | Form accepts client name, email, and inquiry dispatch with positive feedback confirmation. |

---

## 4. Execution Commands & Automation

### Running the Full E2E Test Suite
```bash
export PATH="/usr/local/nvm/versions/node/v26.13.0/bin:$PATH"
node src/tests/run-e2e.mjs
```

### Running Individual Tiers
```bash
# Tier 1 only (Features & Palette)
node src/tests/run-e2e.mjs --tier 1

# Tier 2 only (Boundaries & Responsive)
node src/tests/run-e2e.mjs --tier 2

# Tier 3 only (Interactions & Pinning)
node src/tests/run-e2e.mjs --tier 3

# Tier 4 only (Full User Journey)
node src/tests/run-e2e.mjs --tier 4
```

### Pass/Fail Exit Codes
- `0`: All tests passed successfully (100% compliance).
- `1`: One or more test assertions failed (contract regression or unfulfilled requirement).
- `2`: Syntax or infrastructure error.

---

## 5. Continuous Integration & Pre-Deployment Gate

Prior to deploying to Vercel (`https://dinotopia.vercel.app`) or pushing to `arnabdebnath7/Aegyra-Portfolio`:
1. `npm run build` must exit 0.
2. `node src/tests/run-e2e.mjs` must exit 0 across all 4 tiers.
3. Zero unresolved errors or unhandled promise rejections.
