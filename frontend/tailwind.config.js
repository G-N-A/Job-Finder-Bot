/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: '#e11d48', // Tailwind red-600
          dark: '#b91c1c',   // Tailwind red-700
        },
        dark: {
          DEFAULT: '#18181b', // Tailwind zinc-900
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

