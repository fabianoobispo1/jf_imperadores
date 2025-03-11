/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  // Configurações para resolver o problema com o módulo Oxide:
  future: {
    disableColorOpacityUtilitiesByDefault: true,
  },
  experimental: {
    oxidizedPlugins: false,
  },
}
