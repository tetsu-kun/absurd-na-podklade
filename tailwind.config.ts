import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f4f2ec",
        brand: {
          black: "#090909",
          red: "#f02b20",
          "red-light": "#ff746c",
          blue: "#1646eb",
          "blue-bright": "#5478ff",
          "blue-light": "#9db2ff",
          gray: "#d8d8d4",
          "ink-muted": "#6a6964",
        },
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      borderRadius: {
        soft: "0.7rem",
      },
      boxShadow: {
        card: "0 7px 0 rgb(9 9 9 / 0.07)",
        "card-hover": "0 11px 0 rgb(9 9 9 / 0.1)",
        button: "0 5px 0 rgb(9 9 9 / 0.18)",
        header: "0 8px 24px rgb(9 9 9 / 0.08)",
      },
      animation: {
        marquee: "marquee 18s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;