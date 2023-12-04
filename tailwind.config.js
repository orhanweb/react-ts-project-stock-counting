/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: '#bcf4d2', // En açık ton
          lighter: '#8eedb8',  // Daha açık ton
          light: '#61e69e',    // Açık ton
          DEFAULT: '#1dc46b',  // Standart ana renk
          dark: '#1baf62',     // Koyu ton
          darker: '#198a58',   // Daha koyu ton
          darkest: '#17654f',  // En koyu ton
        },
        background: {
          lightest: '#ffffff',  // En açık arka plan rengi (açık tema için)
          lighter: '#f2f2f2',   // Daha açık arka plan rengi (açık tema için)
          light: '#e5e5e5',     // Açık arka plan rengi (açık tema için)
          DEFAULT: '#707070',
          dark: '#333333',      // En açık arka plan rengi (karanlık tema için)
          darker: '#2c2c2c',    // Daha koyu arka plan rengi (karanlık tema için)
          darkest: '#262626',   // En koyu arka plan rengi (karanlık tema için)
        },
        text: {
          darkest: '#000000',  // Açık temada en koyu metin rengi
          darker: '#616161',   // Açık temada orta koyu metin rengi
          dark: '#757575',     // Açık temada en açık koyu metin rengi
          light: '#a6a6a6',    // Karanlık temada en koyu açık metin rengi
          lighter: '#bfbfbf',  // Karanlık temada orta açık metin rengi
          lightest: '#ffffff', // Karanlık temada en açık metin rengi
        },
        success: {
          light: '#81e979',    // Açık tema için başarı rengi
          dark: '#4caf50',     // Karanlık tema için başarı rengi
        },
        error:'#ff2b2b',
        warning: {
          light: '#ffde59',    // Açık tema için uyarı rengi
          dark: '#ffa000',     // Karanlık tema için uyarı rengi
        },
        info: {
          light: '#4dc0ff',    // Açık tema için bilgi rengi
          dark: '#1976d2',     // Karanlık tema için bilgi rengi
        },
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

