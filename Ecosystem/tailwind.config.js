/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        industrial: {
          DEFAULT: 'var(--industrial)',
          light: 'var(--industrial-light)',
          mid: 'var(--industrial-mid)',
        },
        amber: {
          DEFAULT: 'var(--amber)',
          dark: 'var(--amber-dark)',
          light: 'var(--amber-light)',
        },
        indigo: {
          DEFAULT: 'var(--indigo)',
          light: 'var(--indigo-light)',
        },
        'green-ops': {
          DEFAULT: 'var(--green-ops)',
          light: 'var(--green-ops-light)',
        },
        'fleet-blue': {
          DEFAULT: 'var(--fleet-blue)',
          light: 'var(--fleet-blue-light)',
        },
        'finance-green': {
          DEFAULT: 'var(--finance-green)',
          light: 'var(--finance-green-light)',
        },
        'status-green': 'var(--status-green)',
        'status-red': 'var(--status-red)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(15, 23, 42, 0.06)',
        'card-hover': '0 20px 48px -12px rgba(30, 58, 95, 0.14)',
        portal: '0 4px 24px 0 rgba(30, 58, 95, 0.1)',
        'portal-hover': '0 28px 56px -16px rgba(30, 58, 95, 0.18)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};