import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171421",
        grape: "#7c3aed",
        punch: "#f97316",
        mint: "#22c55e",
        soda: "#38bdf8"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 20, 33, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
