/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class', // enable dark mode
  theme: {
    fontFamily: {
      // Add your custom fonts and enjoy.
      'Inter': ["Inter", "Sans-serif"]
    },
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('tailwindcss-animated')
  ],
};
