/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        burger: {
          yellow: '#FFC72C',
          gold: '#F2A104',
          red: '#D62828',
          deepred: '#9E1B1B',
          bun: '#E8A552',
          bunlight: '#F6C27A',
          cheese: '#FFB627',
          lettuce: '#6FBF54',
          patty: '#6B3A1E',
          cream: '#FFF6E6',
          char: '#2B1B12',
        },
        // «Типовая ГИС»: state-portal palette (deep blue on cool grey surfaces).
        // «Бейдж GoCloud Tech»: light paper ground, near-black ink, conference green.
        gc: {
          green: '#26D07C',
          greenHover: '#1FBF70',
          greenDark: '#17804C',
          greenLight: '#C2EDD8',
          greenPale: '#EAF8F0',
          ink: '#161916',
          ink2: '#222222',
          paper: '#F2F3F1',
          line: '#D9DED9',
          muted: '#5B625C',
          grey: '#9AA09B',
          red: '#D7263D',
          redLight: '#FDECEE',
          amber: '#B8720A',
          amberLight: '#FEF0CC',
        },
        gis: {
          blue: '#0D4CD3',
          blueHover: '#1D5DEB',
          blueDark: '#0B40B3',
          blueLight: '#E4ECFD',
          navy: '#0B1F33',
          ink: '#1F2A37',
          muted: '#66727F',
          line: '#D1D5DF',
          divider: '#E4ECFD',
          surface: '#F3F5F8',
          surface2: '#EAEEF4',
          gold: '#C9A227',
          green: '#1E7F3C',
          greenLight: '#EBFAED',
          amber: '#B8720A',
          amberLight: '#FEF0CC',
          red: '#E11432',
          redLight: '#FFF1F1',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        gis: ['Roboto', '"Segoe UI"', 'Arial', 'system-ui', 'sans-serif'],
        gocloud: ['Manrope', 'Verdana', 'system-ui', 'sans-serif'],
        gcmono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        pop: '0 18px 40px -12px rgba(158, 27, 27, 0.45)',
        card: '0 10px 30px -10px rgba(43, 27, 18, 0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(6deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-7deg)' },
          '50%': { transform: 'rotate(7deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(214, 40, 40, 0.55)' },
          '50%': { boxShadow: '0 0 0 22px rgba(214, 40, 40, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        wiggle: 'wiggle 1.6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
