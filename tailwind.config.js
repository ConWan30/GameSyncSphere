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
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        orbitron: ["var(--font-orbitron)", "monospace"],
      },
      colors: {
        "primary-dark": "#0a0a0f",
        "gunmetal-gray": "#1a1a2e",
        "metallic-silver": "#c0c0c0",
        "accent-blue": "#00d4ff",
        "neon-green": "#39ff14",
        "electric-purple": "#8a2be2",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
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
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "float-up": {
          "0%": { transform: "translateY(100vh) scale(0)", opacity: "0" },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.6" },
          "100%": { transform: "translateY(-100px) scale(1)", opacity: "0" },
        },
        "grid-move": {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(50px, 50px)" },
        },
        "pulse-line": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.8" },
        },
        "logo-glow": {
          "0%": { filter: "drop-shadow(0 0 5px var(--accent-blue))" },
          "100%": { filter: "drop-shadow(0 0 15px var(--accent-blue))" },
        },
        "counter-glow": {
          "0%": { textShadow: "0 0 10px currentColor" },
          "100%": { textShadow: "0 0 20px currentColor" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "holographic-shift": "holographic-shift 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease-in-out infinite",
        "float-up": "float-up linear infinite",
        "grid-move": "grid-move 20s linear infinite",
        "pulse-line": "pulse-line 2s ease-in-out infinite",
        "logo-glow": "logo-glow 2s ease-in-out infinite alternate",
        "counter-glow": "counter-glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "holographic-gradient": "linear-gradient(135deg, #00d4ff 0%, #8a2be2 50%, #39ff14 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        holo: "0 0 30px rgba(0, 212, 255, 0.3)",
        "holo-lg": "0 0 50px rgba(0, 212, 255, 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
