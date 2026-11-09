/** @type {import('tailwindcss').Config} */
function withOpacity(varName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${varName}-rgb) / ${opacityValue})`;
    }
    return `var(${varName})`;
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 4-Pillar Natural Color Palette
        stone: {
          canvas: withOpacity('--color-stone-canvas'),
          surface: withOpacity('--color-stone-surface'),
          'surface-alt': withOpacity('--color-stone-surface-alt'),
          border: withOpacity('--color-stone-border'),
          muted: withOpacity('--color-stone-muted'),
          body: withOpacity('--color-stone-body'),
          marble: withOpacity('--color-stone-marble'),
        },
        emerald: {
          deep: withOpacity('--color-emerald-deep'),
          forest: withOpacity('--color-emerald-forest'),
          base: withOpacity('--color-emerald-base'),
          vibrant: withOpacity('--color-emerald-vibrant'),
          moss: withOpacity('--color-emerald-moss'),
          glow: withOpacity('--color-emerald-glow'),
        },
        cyan: {
          abyss: withOpacity('--color-cyan-abyss'),
          deep: withOpacity('--color-cyan-deep'),
          base: withOpacity('--color-cyan-base'),
          waterfall: withOpacity('--color-cyan-waterfall'),
          luminous: withOpacity('--color-cyan-luminous'),
          glow: withOpacity('--color-cyan-glow'),
          mist: withOpacity('--color-cyan-mist'),
        },
        amber: {
          shadow: withOpacity('--color-amber-shadow'),
          warm: withOpacity('--color-amber-warm'),
          base: withOpacity('--color-amber-base'),
          sunlit: withOpacity('--color-amber-sunlit'),
          highlight: withOpacity('--color-amber-highlight'),
        },
        // Backward-compatibility aliases preventing broken styles before M2
        void: withOpacity('--color-stone-canvas'),
        'void-dark': withOpacity('--color-emerald-deep'),
        'void-light': withOpacity('--color-stone-surface'),
        'gold-bright': withOpacity('--color-amber-sunlit'),
        'gold-primary': withOpacity('--color-amber-base'),
        'gold-muted': withOpacity('--color-amber-warm'),
        'gold-champagne': withOpacity('--color-amber-highlight'),
        gold: {
          bright: withOpacity('--color-amber-sunlit'),
          primary: withOpacity('--color-amber-base'),
          muted: withOpacity('--color-amber-warm'),
          champagne: withOpacity('--color-amber-highlight'),
          dark: withOpacity('--color-amber-shadow'),
        },
        'surface-glass': 'var(--surface-glass-default)',
        'surface-raised': withOpacity('--color-stone-surface'),
        'surface-border': withOpacity('--color-surface-border'),
        surface: {
          glass: 'var(--surface-glass-default)',
          raised: withOpacity('--color-stone-surface'),
          border: withOpacity('--color-surface-border'),
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      aspectRatio: {
        '9/16': '9 / 16',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
