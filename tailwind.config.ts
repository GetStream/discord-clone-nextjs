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
        discord: '#7289da',
        'dark-discord': '#4752c4',
        'dark-gray': '#dfe1e4',
        'medium-gray': '#f0f1f3',
        'light-gray': '#e8eaec',
        'hover-gray': '#cdcfd3',
        'composer-gray': 'hsl(210 calc( 1 * 11.1%) 92.9% / 1);',
        'gray-normal': '#313338',
      },
    },
  },
  plugins: [],
};
export default config;
