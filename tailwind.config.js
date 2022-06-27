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
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require("daisyui")
  ],
}
