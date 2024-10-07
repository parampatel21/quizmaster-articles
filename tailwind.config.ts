import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBlue: "#60a5fa", // Add blue-400 as customBlue
      },
    },
  },
  daisyui: {
    themes: ["garden"], // Use the Garden theme from DaisyUI
  },
  plugins: [require("daisyui")],
};

export default config;
