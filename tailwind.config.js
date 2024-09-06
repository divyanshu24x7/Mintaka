/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mintakaGray: '#161616',
        menuGray: '#1b1b1b',
        menuGray2: '#242424',
        mintakaText: '#6c6967',
      },
      fontFamily:{
        sans:['Roboto','sans-serif']
      },
    },
    /*screens:{
      sm: '480px',
      md: '768',
      lg: '976px',
      xl: '1440px'
    },*/
  },
  plugins: [],
}