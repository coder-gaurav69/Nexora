/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      screens: {
        xsm: "500px",
      },
      animation: {
        "border-move": "borderMove 6s linear infinite",
      },
      keyframes: {
        borderMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
