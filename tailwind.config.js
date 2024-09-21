/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',   // Add your HTML file(s)
    './js/**/*.js',   // Include JavaScript files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0078D7',
      },
    },
  },
  plugins: [],
}
