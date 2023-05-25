module.exports = {
  darkMode: 'class', // or 'media' or 'class'
	content: [
		'./pages/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
	],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%', // add required value here
          }
        }
      },
      colors: {
        "dark-card-handle": "#222222ff",
        "dark-card-body": "#222222aa",
        "light-card-handle": "#eeeeeeff",
        "light-card-body": "#eeeeeeaa",
        "dark-card": "#222222",
        "light-card": "#eeeeee",
				twitter: "#1DA1F2",
				github: "#6e5494",
				gmail: "#DB4437",
				kofi: "#13C3FF",
				discord: "#5865F2",
        twitch: "#6441a5",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
