/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030712',
          900: '#070A18',
          850: '#0C1026',
          800: '#111736',
          700: '#1B2352',
          600: '#273373',
        },
        electric: {
          blue: '#00F0FF',
          cyan: '#06B6D4',
          indigo: '#4F46E5',
          purple: '#8B5CF6',
          violet: '#A855F7',
          pink: '#EC4899',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'futuristic-grid': 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-blue': '0 0 30px -5px rgba(59, 130, 246, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
