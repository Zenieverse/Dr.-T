import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        hedera: {
          green: '#00E887',
          blue: '#1358FE',
          dark: '#0B0F19'
        }
      }
    }
  },
  plugins: []
};

export default config;
