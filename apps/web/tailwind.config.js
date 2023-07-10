/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '112.5rem',
      },
    },
  },
  plugins: [require('tailwindcss-animated')],
};
