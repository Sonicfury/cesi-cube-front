module.exports = {
  darkMode: ['class', '[data-mode="dark"]'],
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      sans: ["Marianne", "Arial", "sans-serif"],
      serif: ["Yeseva One", "Georgia", "serif"]
    },
    extend: {},
  },
  daisyui: {
    themes: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui")
  ],
}
