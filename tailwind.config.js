/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // path to all JavaScript and TypeScript files in pages directory
    "./src/**/*.{js,ts,jsx,tsx}", // path to all JavaScript and TypeScript files in src directory
    "./components/**/*.{js,ts,jsx,tsx}", // if you have a components folder
    // include any other directories where you might be using Tailwind CSS classes
  ],
  theme: {
    extend: {
      colors: {
        "custom-orange": "#fd6741",
        "custom-peach": "#f49a7c",
        "custom-white": "#ffffff",
        "custom-teal": "#2d3748",
        "custom-black": "#000000",
      },
    },
  },
  plugins: [],
};
