/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#070A0D',
        'void-dark': '#040608',
        'void-light': '#0E131A',
        'gold-bright': '#F1B873',
        'gold-primary': '#D4A359',
        'gold-muted': '#B7976E',
        'gold-champagne': '#E2BA7D',
        'surface-glass': 'rgba(18, 24, 28, 0.65)',
        'surface-raised': '#13191E',
        gold: {
          bright: '#F1B873',
          primary: '#D4A359',
          muted: '#B7976E',
          champagne: '#E2BA7D',
          dark: '#7D5D30',
        },
        surface: {
          glass: 'rgba(18, 24, 28, 0.65)',
          raised: '#13191E',
          border: 'rgba(241, 184, 115, 0.15)',
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
