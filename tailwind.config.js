/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F5F1FF",
          100: "#E1D3FF",
          200: "#C3A8FF",
          300: "#A47DFF",
          500: "#7C4DFF",
          600: "#6A3FE0",
          700: "#5C33CC",
          DEFAULT: "#7C4DFF",
          hover: "#6A3FE0",
          text: "#5C33CC",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F6F6FA",
        },
        control: {
          muted: "#F9F9FB",
        },
        background: "#F6F6FA",
        gray: {
          50: "#F6F6FA",
          100: "#F3F3F5",
          200: "#E4E4E8",
          300: "#C5C2D1",
          500: "#646469",
          700: "#22162B",
          900: "#22162B",
        },
        success: {
          100: "#DDEEE2",
          500: "#239742",
          600: "#17682F",
          DEFAULT: "#239742",
        },
        warning: {
          100: "#FFF2CE",
          500: "#FFB819",
          600: "#725000",
          DEFAULT: "#FFB819",
        },
        danger: {
          100: "#F9DFD5",
          500: "#E14400",
          600: "#A73300",
          DEFAULT: "#E14400",
        },
        error: {
          100: "#F9DFD5",
          500: "#E14400",
          600: "#A73300",
          DEFAULT: "#E14400",
        },
        info: {
          100: "#E0E9FC",
          500: "#1C60E7",
          600: "#174CA9",
          DEFAULT: "#1C60E7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", "Sora", "var(--font-noto-thai-looped)", "Noto Sans Thai Looped", "-apple-system", "sans-serif"],
        sora: ["var(--font-sora)", "Sora", "sans-serif"],
        "noto-looped": ["var(--font-noto-thai-looped)", "Noto Sans Thai Looped", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "10px",
        button: "10px",
        input: "10px",
        card: "16px",
        panel: "20px",
        lg: "16px",
        badge: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.04)",
        panel: "0 8px 32px rgba(0, 0, 0, 0.10)",
        "deal-card": "0 1px 4px rgba(0, 0, 0, 0.06)",
        document: "0 4px 16px rgba(15, 23, 42, 0.08)",
      },
      spacing: {
      },
      width: {
        sidebar: "236px",
        "sidebar-collapsed": "72px",
      },
    },
  },
  plugins: [],
};

