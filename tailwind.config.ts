import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyan: { DEFAULT: '#00E5FF', dark: '#0099BB' },
        purple: { DEFAULT: '#7B2CBF', light: '#9D4EDD' },
        obsidian: '#0A0A0A',
        graphite: '#141414',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
export default config;