/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NyayaSetu Unified Design System Palette
        navbar: {
          DEFAULT: '#010811',
          bg: '#010811',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.06)',
          text: '#F8FAFC',
          muted: '#94A3B8'
        },
        midnight: {
          DEFAULT: '#071426', // Midnight navy
          950: '#030A14',
          900: '#071426',
          850: '#0B182B',
          800: '#0D1B2E',
        },
        slate: {
          DEFAULT: '#18263A', // Deep slate
          900: '#101D32',
          850: '#142134',
          800: '#18263A',
          700: '#22354E',
          600: '#2E4463',
          500: '#526D8A',
        },
        navy: {
          950: '#071426',
          900: '#101D32',
          850: '#18263A',
          800: '#1D2E4A',
          700: '#263B56',
        },
        steel: {
          600: '#5B7088',
          500: '#6E839B',
          400: '#8293A8',
          300: '#A4B3C5',
          200: '#CBD5E1',
        },
        muted: {
          DEFAULT: '#8295AF', // Muted blue
          blue: '#8295AF',
          300: '#B0BDD0',
          400: '#8295AF',
          500: '#647A97',
        },
        pale: {
          DEFAULT: '#F3F6FA', // Pale blue-grey
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#F3F6FA',
          300: '#E2E8F0',
          400: '#CBD5E1',
        },
        gold: {
          DEFAULT: '#B99A65', // Antique gold
          300: '#D6C098',
          400: '#CBB285',
          500: '#B99A65',
          600: '#9E804E',
        },
        charcoal: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },

        // Safety Aliases to prevent any missing class / dark-on-dark contrast failure
        porcelain: {
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#F3F6FA',
          300: '#E2E8F0',
        },
        silver: {
          100: '#F8FAFC',
          200: '#F3F6FA',
          300: '#CBD5E1',
          400: '#8295AF',
        },
        ice: {
          100: '#F3F6FA',
          200: '#E2E8F0',
          300: '#B0BDD0',
        },
        champagne: {
          400: '#CBB285',
          500: '#B99A65',
        },
        royal: {
          700: '#18263A',
        },

        // Backward compatibility mappings
        ivory: {
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#F3F6FA',
          300: '#E2E8F0',
          400: '#CBD5E1',
          500: '#B99A65',
        },
        forest: {
          700: '#22354E',
          800: '#18263A',
          900: '#071426',
          950: '#030A14',
        },
        sage: {
          50: '#FFFFFF',
          100: '#F3F6FA',
          200: '#E2E8F0',
          300: '#A4B3C5',
          400: '#8295AF',
          500: '#22354E',
          600: '#18263A',
        },
        terracotta: {
          500: '#18263A',
          600: '#071426',
        },
        ink: {
          950: '#071426',
          900: '#101D32',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#8295AF',
          400: '#CBD5E1',
          300: '#E2E8F0',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Cinzel', 'Georgia', 'serif'],
        display: ['Cinzel', '"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(7, 20, 38, 0.05)',
        'panel': '0 16px 36px -4px rgba(7, 20, 38, 0.16), 0 0 0 1px rgba(130, 147, 168, 0.2)',
        'elevated': '0 20px 40px -8px rgba(7, 20, 38, 0.28)',
      }
    },
  },
  plugins: [],
}
