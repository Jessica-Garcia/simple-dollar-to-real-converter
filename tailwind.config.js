/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      backgroundImage: {
        "app-bg": "linear-gradient(60deg, #00AB63 0%, #008B57 100%)",
      },
    },
  },
  plugins: [],
};
