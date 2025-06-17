/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },
        festivalOrange: '#fb923c',
        festivalLight: '#fff7ed',
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        prata: ["Prata", "serif"],
      },
      boxShadow: {
        cardHover: '0 8px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  darkMode: "class", // Enable dark mode support
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

