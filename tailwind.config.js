/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
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
