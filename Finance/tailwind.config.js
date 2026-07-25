/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        positive: 'var(--positive)',
        negative: 'var(--negative)',
        warning: 'var(--warning)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) * 0.5)',
        md: 'calc(var(--radius) * 0.75)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) * 1.25)',
        '2xl': 'calc(var(--radius) * 1.5)',
        '3xl': 'calc(var(--radius) * 2)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      fontSize: {
        'metric-lg': ['2.25rem', { lineHeight: '1.1', fontWeight: '700' }],
        'metric-md': ['1.75rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};