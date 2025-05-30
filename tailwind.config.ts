/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003974',
        secondary: '#494949',
        gray: {
          light: '#FAFAFA',
          DEFAULT: '#6B6B6B',
          dark: '#222222'
        }
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '992px',
        xl: '1280px',
        '2xl': '1440px',
      }
    },
  },
  plugins: [],
}