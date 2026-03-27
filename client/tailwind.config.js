/** @type {import('tailwindcss').Config} */
export default {
  content:[
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#0B3D20',
        'forest-mid': '#1B6B3C',
        'forest-light': '#2E9E5A',
        gold: '#C8921A',
        'gold-light': '#E8C060',
        'gold-pale': '#F6E8C0',
        cream: '#FAF6EE',
        parchment: '#F0E6D0',
        ink: '#18120A',
        'ink-mid': '#4A3D28',
        'ink-soft': '#8A7A60',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        display:['Instrument Serif', 'serif'],
        heading: ['Syne', 'sans-serif'],
        body:['DM Sans', 'sans-serif'],
      },
      animation: {
        'float': 'float 3.5s ease-in-out infinite',
        'float-delay': 'float 3.5s ease-in-out infinite 1.2s',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'pulse-ring2': 'pulseRing 2s ease-out infinite 0.65s',
        'pulse-ring3': 'pulseRing 2s ease-out infinite 1.3s',
        'blink': 'blink 2s ease-in-out infinite',
        'streak-fill': 'streakFill 1.8s ease-out 0.5s both',
        'slide-up': 'slideUp 0.6s ease both',
        'badge-pop': 'badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':  { transform: 'translateY(-12px)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(1)',   opacity: '0.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        streakFill: {
          from: { width: '0%' },
          to:   { width: '65%' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        badgePop: {
          from: { opacity: '0', transform: 'scale(0.6)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    }
  },}