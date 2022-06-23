module.exports = {
  darkMode: 'class', // or 'media' or 'class'
	content: [
		'./pages/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
	],
  theme: {
    extend: {
      colors: {
        "dark-card-handle": "#222222ff",
        "dark-card-body": "#222222aa",
        "light-card-handle": "#eeeeeeff",
        "light-card-body": "#eeeeeeaa",
        "dark-card": "#222222",
        "light-card": "#eeeeee",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
