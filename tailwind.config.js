/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./dist/*.{html,js,jsx,ts,tsx}",
		"./src/integralforce_frontend/src/**/*.{js,jsx,ts,tsx}",
		"./src/integralforce_frontend/src/index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
  theme: {
    extend: {},
  },
  plugins: [],
}

