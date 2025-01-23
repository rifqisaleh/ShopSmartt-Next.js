/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",  // Include the HTML file if using it
    "./src/**/*.{js,ts,jsx,tsx}",  // Include all JS/TS and JSX/TSX files in the src folder
  ],
  theme: {
    extend: {
      colors: {
        urbanChic: {
          DEFAULT: "#37474F", // Deep charcoal as the default shade
          50: "#F4F6F7", // Lighter gray
          100: "#E8EBEC",
          200: "#CFD8DC", // Soft gray
          300: "#B0BEC5",
          400: "#78909C",
          500: "#37474F", // Main color
          600: "#2E3B41",
          700: "#263034",
          800: "#1D2428",
          900: "#121718", // Darkest shade
        },
      },
    },
  },
  plugins: [],
};
