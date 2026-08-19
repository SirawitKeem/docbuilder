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
          50: "#F5F9FF",
          100: "#EAF3FF",
          500: "#1677F2",
          600: "#0B63E5",
        },
        gray: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          500: "#64748B",
          700: "#334155",
          900: "#0F172A",
        },
        success: {
          100: "#DCFCE7",
          600: "#16A34A",
        },
        warning: {
          100: "#FEF3C7",
          600: "#D97706",
        },
        error: {
          100: "#FEE2E2",
          600: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-thai-looped)", "Noto Sans Thai Looped", "var(--font-inter)", "sans-serif"],
        "noto-looped": ["var(--font-noto-thai-looped)", "Noto Sans Thai Looped", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        card: "12px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.06)",
        document: "0 4px 16px rgba(15, 23, 42, 0.08)",
      },
      spacing: {
        // ใช้ scale เดิมของ Tailwind อยู่แล้ว
      },
      width: {
        sidebar: "232px",
      },
    },
  },
  plugins: [],
};
