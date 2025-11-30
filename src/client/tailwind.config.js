/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#13ec80',
        'background-light': '#f6f8f7',
        'background-dark': '#102219',
        'text-light': '#333333',
        'text-dark': '#f8f9fa',
        'text-muted-light': '#757575',
        'text-muted-dark': '#98a2b3',
        'border-light': '#d0d5dd',
        'border-dark': '#3b5447',
        'input-bg-light': '#ffffff',
        'input-bg-dark': '#1c2721',
        'error': '#D0021B',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
