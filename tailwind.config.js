/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: "#bcf4d2", // Lightest shade
          lighter: "#8eedb8", // Lighter shade
          light: "#61e69e", // Light shade
          DEFAULT: "#1dc46b", // Standard primary color
          dark: "#1baf62", // Dark shade
          darker: "#198a58", // Darker shade
          darkest: "#17654f", // Darkest shade
        },
        background: {
          lightest: "#ffffff", // Lightest background color (for light theme)
          lighter: "#f2f2f2", // Lighter background color (for light theme)
          light: "#e5e5e5", // Light background color (for light theme)
          DEFAULT: "#707070",
          dark: "#333333", // Lightest background color (for dark theme)
          darker: "#2c2c2c", // Darker background color (for dark theme)
          darkest: "#262626", // Darkest background color (for dark theme)
        },
        text: {
          darkest: "#000000", // Darkest text color in light theme
          darker: "#616161", // Mid dark text color in light theme
          dark: "#757575", // Lightest dark text color in light theme
          light: "#a6a6a6", // Darkest light text color in dark theme
          lighter: "#bfbfbf", // Mid light text color in dark theme
          lightest: "#ffffff", // Lightest text color in dark theme
        },
        success: "#00d633",
        error: "#ff2b2b",
        warning: "#ff7a00",
        info: "#1976d2",
      },
      fontFamily: {
        sans: ["Raleway", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
