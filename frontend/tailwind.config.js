/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0e1a',
          card: '#0f1629',
          border: '#1a2744',
          accent: '#00f5d4',
          blue: '#0066ff',
          purple: '#7b2fff',
          red: '#ff2d55',
          yellow: '#ffd60a',
          green: '#30d158',
          text: '#e2e8f0',
          muted: '#64748b'
        }
      },
      fontFamily: {
        cyber: ['Orbitron', 'monospace'],
        body: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 2s linear infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00f5d4, 0 0 10px #00f5d4' },
          '100%': { boxShadow: '0 0 20px #00f5d4, 0 0 40px #00f5d4' }
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px)",
        'cyber-glow': 'radial-gradient(ellipse at center, rgba(0,102,255,0.15) 0%, transparent 70%)'
      },
      backgroundSize: {
        'grid': '50px 50px'
      }
    }
  },
  plugins: []
}
