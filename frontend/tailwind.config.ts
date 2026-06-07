import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        raisin:   '#1A0A2E',
        turmeric: '#E8A020',
        forest:   '#1A6B4A',
        sindoor:  '#C1392B',
        chalk:    '#F7F3EE',
        stone:    '#E8E4DE',
        ink:      '#12091E',
      },
      fontFamily: {
        fraunces:  ['"Fraunces"', 'serif'],
        cabinet:   ['"Cabinet Grotesk"', 'sans-serif'],
        mono:      ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        btn:   '4px',
        card:  '12px',
        panel: '24px',
      },
      boxShadow: {
        warm: '0 4px 24px rgba(180,80,0,0.12)',
        card: '0 8px 32px rgba(180,80,0,0.12)',
        glow: '0 0 40px rgba(232,160,32,0.15)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} satisfies Config
