/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'claude-purple': '#8e44ad',
        'claude-light': '#f9f5ff',
        'claude-dark': '#2c2c2c',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};