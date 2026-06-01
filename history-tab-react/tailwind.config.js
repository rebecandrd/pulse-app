/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        border: "#e5e7eb",
        "border-strong": "#d1d5db",
        accent: "#3b5bdb",
        "accent-hover": "#2f4ac4",
        "accent-light": "#eef2ff",
        surface: "#f5f6f8",
        "surface-2": "#ebebee",
      },
    },
  },
  plugins: [],
};
