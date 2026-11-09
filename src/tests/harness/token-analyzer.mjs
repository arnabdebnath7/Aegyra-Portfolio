/**
 * token-analyzer.mjs
 * Analyzes CSS variables in src/index.css and Tailwind configuration in tailwind.config.js
 * Computes WCAG 2.2 AAA contrast ratios and verifies color token migrations.
 */

import fs from 'node:fs';
import path from 'node:path';

export const REQUIRED_TOKENS = {
  stone: {
    '--color-stone-canvas': '#080D0B',
    '--color-stone-surface': '#121C19',
    '--color-stone-surface-alt': '#1A2623',
    '--color-stone-border': '#2A3834',
    '--color-stone-muted': '#87979B',
    '--color-stone-body': '#C5BDB2',
    '--color-stone-marble': '#F3F3EE',
  },
  emerald: {
    '--color-emerald-deep': '#061A14',
    '--color-emerald-forest': '#0C261F',
    '--color-emerald-base': '#1B4332',
    '--color-emerald-vibrant': '#2D6A4F',
    '--color-emerald-moss': '#556D3F',
    '--color-emerald-glow': '#80A36E',
  },
  cyan: {
    '--color-cyan-abyss': '#09202B',
    '--color-cyan-deep': '#114656',
    '--color-cyan-base': '#1F7E9B',
    '--color-cyan-waterfall': '#2C8BA9',
    '--color-cyan-luminous': '#41B3C8',
    '--color-cyan-mist': '#A8E6F0',
  },
  amber: {
    '--color-amber-shadow': '#4E381E',
    '--color-amber-warm': '#A9895D',
    '--color-amber-base': '#DE9E4B',
    '--color-amber-sunlit': '#E9BB7D',
    '--color-amber-highlight': '#FBE4BE',
  },
};

/**
 * Converts hex color to RGB tuple [r, g, b] (0-255)
 */
export function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Calculates WCAG 2.2 Relative Luminance
 */
export function relativeLuminance(r, g, b) {
  const [sR, sG, sB] = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

/**
 * Calculates WCAG 2.2 Contrast Ratio between two hex colors
 */
export function calculateContrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = relativeLuminance(...rgb1);
  const l2 = relativeLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Extracts all CSS custom properties from a CSS file content
 */
export function extractCssVariables(cssContent) {
  const vars = {};
  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(cssContent)) !== null) {
    vars[match[1].trim()] = match[2].trim();
  }
  return vars;
}

/**
 * Analyzes the CSS tokens and Tailwind configuration
 */
export function analyzeThemeTokens(projectRoot) {
  const cssPath = path.join(projectRoot, 'src', 'index.css');
  const tailwindPath = path.join(projectRoot, 'tailwind.config.js');

  const cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
  const tailwindContent = fs.existsSync(tailwindPath) ? fs.readFileSync(tailwindPath, 'utf8') : '';

  const cssVars = extractCssVariables(cssContent);

  // Check required tokens
  const tokenReport = {
    totalRequired: 0,
    foundTokens: 0,
    missingTokens: [],
    tokens: {},
  };

  for (const [pillar, tokens] of Object.entries(REQUIRED_TOKENS)) {
    for (const [varName, expectedHex] of Object.entries(tokens)) {
      tokenReport.totalRequired++;
      const val = cssVars[varName];
      if (val) {
        tokenReport.foundTokens++;
        tokenReport.tokens[varName] = {
          pillar,
          expected: expectedHex,
          actual: val,
          matches: val.toLowerCase() === expectedHex.toLowerCase(),
        };
      } else {
        tokenReport.missingTokens.push(varName);
      }
    }
  }

  // Check obsolete gold token status
  // Either obsolete hardcoded gold tokens are removed, or mapped to CSS variables
  const obsoleteTokensAnalysis = {
    hasObsoleteHardcodedGold: false,
    hasCleanMapping: false,
    details: [],
  };

  const hardcodedGoldHex = ['#f1b873', '#d4a359', '#b7976e', '#e2ba7d', '#070a0d'];
  for (const hex of hardcodedGoldHex) {
    if (cssContent.toLowerCase().includes(hex)) {
      obsoleteTokensAnalysis.details.push(`Found hardcoded ${hex} in index.css`);
    }
  }

  // Check if tailwind config references CSS variables or withOpacity for gold/void/stone/amber
  if (
    tailwindContent.includes('--color-stone-canvas') ||
    tailwindContent.includes('--color-amber-sunlit')
  ) {
    obsoleteTokensAnalysis.hasCleanMapping = true;
  }

  // Check utility classes in index.css
  const utilityClasses = {
    hasGlassPanel: cssContent.includes('.glass-panel'),
    hasGlassPill: cssContent.includes('.glass-pill'),
    hasAmbientGlow: cssContent.includes('.ambient-glow'),
    hasAmbientStageGlow: cssContent.includes('.ambient-stage-glow'),
    hasScrollbarGutter: cssContent.includes('scrollbar-gutter'),
    hasOverflowClip: cssContent.includes('overflow-x: clip'),
  };

  return {
    cssVars,
    tokenReport,
    obsoleteTokensAnalysis,
    utilityClasses,
    tailwindContent,
    cssContent,
  };
}
