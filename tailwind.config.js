/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'c9-dark': '#0a0a0a',
        'c9-gray': '#1a1a1a',
        'c9-green': '#22c55e',
        'c9-green-hover': '#16a34a',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
