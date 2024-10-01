/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    boxShadow: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      t: "0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      orange: "0px 20px 20px -15px rgba(245,56,56,0.81) ",
      "orange-md": "0px 20px 40px -15px rgba(245,56,56,0.81) ",
      none: "none",
    },
    colors: {
      transparent: "transparent",
      black: {
        500: "#4F5665",
        600: "#0B132A",
        700: "#1C1C1C", // Darker black for dark mode
      },
      orange: {
        100: "#FFECEC",
        500: "#F53855",
        600: "#C53030", // Darker orange for dark mode
      },
      green: {
        500: "#2FAB73",
        600: "#227A56", // Darker green for dark mode
      },
      white: {
        300: "#F8F8F8",
        500: "#fff",
        600: "#E5E5E5", // Slightly darker white for dark mode
      },
      gray: {
        100: "#EEEFF2",
        400: "#AFB5C0",
        500: "#DDDDDD",
        600: "#4A4A4A", // Darker gray for dark mode
        700: "#2D2D2D", // Even darker gray for dark mode backgrounds
      },
    },
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          100: "#1A202C", // Dark background
          200: "#2D3748", // Slightly lighter dark background
          300: "#4A5568", // Dark border or accent
          400: "#718096", // Muted text color
        },
      },
    },
  },
  darkMode: 'class', // Enable class-based dark mode
  variants: {
    extend: {
      boxShadow: ["active", "hover"],
      backgroundColor: ["dark"], // Enable dark variant for background color
      textColor: ["dark"], // Enable dark variant for text color
    },
  },
  plugins: [],
};
