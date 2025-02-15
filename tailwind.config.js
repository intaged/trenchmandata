/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0A0B0F',
        'secondary': '#14161F',
        'accent': '#8B5CF6',
        'accent-light': '#A78BFA',
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
        'border-color': '#2D3748',
        'hover': 'rgba(20, 22, 31, 0.8)',
        'card-bg': 'rgba(20, 22, 31, 0.5)',
        'success': '#10B981',
        'error': '#EF4444',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, #8B5CF6, #A78BFA)',
        'gradient-dark': 'linear-gradient(180deg, #14161F 0%, #0A0B0F 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(20, 22, 31, 0.4) 100%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(167, 139, 250, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
} 