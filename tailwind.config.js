/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "#0A0A0A",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          blue: "#1E3A8A",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "metallic-silver": "#A9A9A9",
        "gunmetal-gray": "#2A2A2A",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "holographic-shift": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "holographic-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "cursor-pulse": {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)", opacity: "0.8" },
          "50%": { transform: "translate(-50%, -50%) scale(1.2)", opacity: "0.4" },
        },
        "grid-move": {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(50px, 50px)" },
        },
        "float-up": {
          "0%": { transform: "translateY(100vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100px) rotate(360deg)", opacity: "0" },
        },
        "schema-float": {
          "0%, 100%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "33%": { transform: "rotateX(5deg) rotateY(5deg)" },
          "66%": { transform: "rotateX(-5deg) rotateY(-5deg)" },
        },
        "connection-pulse": {
          "0%, 100%": { opacity: "0.6", "box-shadow": "0 0 5px rgba(30, 58, 138, 0.3)" },
          "50%": { opacity: "1", "box-shadow": "0 0 15px rgba(30, 58, 138, 0.6)" },
        },
        "logo-glow": {
          "0%": { opacity: "0.5", transform: "scale(1)" },
          "100%": { opacity: "1", transform: "scale(1.05)" },
        },
        "counter-glow": {
          "0%": { "text-shadow": "0 0 10px currentColor" },
          "100%": { "text-shadow": "0 0 20px currentColor, 0 0 30px currentColor" },
        },
        "code-scan": {
          "0%": { left: "-100%" },
          "50%": { left: "100%" },
          "100%": { left: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "holographic-shift": "holographic-shift 4s ease-in-out infinite",
        "holographic-rotate": "holographic-rotate 3s linear infinite",
        "cursor-pulse": "cursor-pulse 2s ease-in-out infinite",
        "grid-move": "grid-move 20s linear infinite",
        "float-up": "float-up linear infinite",
        "schema-float": "schema-float 6s ease-in-out infinite",
        "connection-pulse": "connection-pulse 2s ease-in-out infinite",
        "logo-glow": "logo-glow 2s ease-in-out infinite alternate",
        "counter-glow": "counter-glow 2s ease-in-out infinite alternate",
        "code-scan": "code-scan 3s ease-in-out infinite",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        orbitron: ["var(--font-orbitron)", "Orbitron", "sans-serif"],
      },
      backgroundImage: {
        "holographic-gradient": "linear-gradient(45deg, #ffffff, #a9a9a9, #1e3a8a, #ffffff)",
        "accent-gradient": "linear-gradient(45deg, #1e3a8a, #3b82f6, #a9a9a9)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        holographic: "0 0 20px rgba(30, 58, 138, 0.3), inset 0 0 20px rgba(30, 58, 138, 0.1)",
        "holographic-hover": "0 0 30px rgba(30, 58, 138, 0.5), inset 0 0 30px rgba(30, 58, 138, 0.2)",
        "card-hover":
          "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(30, 58, 138, 0.3), inset 0 0 30px rgba(30, 58, 138, 0.1)",
      },
      perspective: {
        1000: "1000px",
        2000: "2000px",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
