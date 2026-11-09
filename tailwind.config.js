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
        gold: {
          bright: '#F1B873',
          primary: '#D4A359',
          muted: '#B7976E',
          dark: '#7D5D30',
        },
        surface: {
          glass: 'rgba(18, 22, 29, 0.65)',
          raised: 'rgba(26, 31, 41, 0.85)',
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
