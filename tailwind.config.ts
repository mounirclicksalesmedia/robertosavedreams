import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3eb54d",
          50: "#f0faf1",
          100: "#dcf2df",
          200: "#bae5c0",
          300: "#8ed19a",
          400: "#5db86c",
          500: "#3eb54d",
          600: "#2d9039",
          700: "#26732f",
          800: "#235c2a",
          900: "#1f4c25",
          950: "#0f2a14",
        },
        secondary: {
          DEFAULT: "#ffc500",
          50: "#fffbeb",
          100: "#fff4c6",
          200: "#ffe988",
          300: "#ffda4a",
          400: "#ffc500",
          500: "#f2b000",
          600: "#d18a00",
          700: "#a66203",
          800: "#894d0a",
          900: "#74400e",
          950: "#432105",
        },
      },
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config; 