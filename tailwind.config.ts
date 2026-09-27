import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4F0E6',
        card: '#EAE2CC',
        cream: '#FBF9F2',
        line: '#D8CDB2',
        ink: '#1D1A14',
        muted: '#6E6759',
        pine: '#214434',
        moss: '#183527',
      },
      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', 'Times', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
