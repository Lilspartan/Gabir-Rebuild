module.exports = {
  darkMode: false, // or 'media' or 'class'
	content: [
		'./pages/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
	],
  theme: {
    extend: {
      colors: {
        primary: "#273043",
        danger: "#dc3545",
				success: "#28a745",
				accent: "#6CD4FF",
				background: "#171C27",
				warning: "#ffc107",
				info: "#17a2b8",
				light: "#f8f9fa"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
