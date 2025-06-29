
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <- Adjust this based on your file structure
  ],
  theme: {
    extend: {
      backgroundImage: {
        'radial-spot': 'radial-gradient(circle at top right, #3f3f3f, #000000 80%)',
      },
    },
  },
  plugins: [],
};
