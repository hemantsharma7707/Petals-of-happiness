/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF6',
          100: '#FAF7F2',
          200: '#F5EEE4',
          300: '#EDE0D0',
        },
        brand: {
          50: '#FDF0EC',
          100: '#F9D9D0',
          200: '#F0AFA0',
          300: '#E8A598',
          400: '#D88877',
          500: '#C9856F',
          600: '#B5705A',
          700: '#9B5E52',
          800: '#7A4940',
          900: '#5C3530',
        },
        sage: {
          100: '#D4E0D3',
          200: '#B8CEB7',
          300: '#9BBB9A',
          400: '#8BA888',
          500: '#739570',
          600: '#5C7A59',
        },
        dark: {
          100: '#9D7B73',
          200: '#6B4C43',
          300: '#4A322A',
          400: '#2C1A14',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(44, 26, 20, 0.08)',
        'card': '0 4px 24px rgba(44, 26, 20, 0.10)',
        'hover': '0 8px 32px rgba(44, 26, 20, 0.16)',
        'brand': '0 4px 20px rgba(201, 133, 111, 0.35)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
