/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        "ton-bg": "#000000",
        "ton-red": "#7B68EE",
        "ton-chalk": "#0000FF",
        "ton-lime": "#66CDAA",
        "ton-ice": "#AFEEEE",
        "ton-gray": "#D3D3D3",
      },
      fontFamily: {
        title: ["var(--font-title)"],
        kid: ["var(--font-kid)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        neonFlicker: {
          "0%, 100%": { opacity: "0.9" },
          "12%": { opacity: "0.55" },
          "14%": { opacity: "0.95" },
          "22%": { opacity: "0.65" },
          "27%": { opacity: "0.92" },
          "53%": { opacity: "0.72" },
          "60%": { opacity: "0.96" },
          "72%": { opacity: "0.58" },
        },
        chalkWiggle: {
          "0%, 100%": { transform: "translate(0px, 0px) rotate(0deg)" },
          "33%": { transform: "translate(1px, -1px) rotate(0.1deg)" },
          "66%": { transform: "translate(-1px, 1px) rotate(-0.1deg)" },
        },
        canvasJitter: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "20%": { transform: "translate(0.5px, -0.5px)" },
          "40%": { transform: "translate(-0.5px, 0.4px)" },
          "60%": { transform: "translate(0.4px, 0.6px)" },
          "80%": { transform: "translate(-0.4px, -0.3px)" },
        },
        floaty: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(0px, -10px)" },
        },
      },
      animation: {
        neonFlicker: "neonFlicker 2.6s linear infinite",
        neonFlickerSlow: "neonFlicker 4.2s linear infinite",
        chalkWiggle: "chalkWiggle 1.8s ease-in-out infinite",
        canvasJitter: "canvasJitter 0.22s linear infinite",
        floaty: "floaty 5.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
