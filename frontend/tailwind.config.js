/** @type {import('@tailwindcss/types').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#c084fc",
        secondary: "#a78bfa",
        accent: "#7c3aed",
      },
    },
  },
  plugins: [],
};
