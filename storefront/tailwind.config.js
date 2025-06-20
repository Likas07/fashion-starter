module.exports = {
  darkMode: ["class", "class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      black: "hsl(var(--foreground))",
      "black-10%": "rgba(16, 24, 30, 0.1)",
      "black-30%": "rgba(16, 24, 30, 0.3)",
      white: "hsl(var(--background))",
      grayscale: {
        50: "hsl(var(--background))",
        100: "hsl(var(--border))",
        500: "hsl(210, 10%, 50%)",
        700: "hsl(var(--muted-foreground))",
        800: "hsl(var(--foreground))",
      },
      red: {
        900: "hsl(0, 80%, 45%)",
        primary: "hsl(var(--destructive))",
      },
      yellow: "hsl(45, 90%, 75%)",
      transparent: "rgba(0,0,0,0)",
      current: "currentColor",
      "fg-subtle": {
        DEFAULT: "hsl(var(--muted-foreground))",
        dark: "rgba(161, 161, 170, 1)",
      },
      "fg-base": {
        DEFAULT: "hsl(var(--foreground))",
        dark: "rgba(244, 244, 245, 1)",
      },
      "bg-field": {
        DEFAULT: "hsl(var(--card))",
        dark: "rgba(255, 255, 255, 0.04)",
      },
      "bg-field-hover": {
        DEFAULT: "hsl(var(--background))",
        dark: "rgba(255, 255, 255, 0.08)",
      },
      "border-base": {
        DEFAULT: "hsl(var(--border))",
        dark: "rgba(255, 255, 255, 0.08)",
      },
      "fg-muted": {
        DEFAULT: "hsl(var(--muted-foreground))",
        dark: "rgba(113, 113, 122, 1)",
      },
    },
    fontSize: {
      "3xl": ["3.5rem", 1.4],
      "2xl": ["3rem", 1.4],
      xl: ["2.5rem", 1.4],
      lg: ["2rem", 1.4],
      md: ["1.5rem", 1.4],
      sm: ["1.125rem", 1.4],
      base: ["1rem", 1.4],
      xs: ["0.75rem", 1.4],
      "2xs": ["0.625rem", 1.4],
    },
    borderRadius: {
      "2xs": "2px",
      xs: "4px",
      md: "24px",
      lg: "30px",
      full: "100%",
      none: "0px",
    },
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
    },
    extend: {
      spacing: {
        13: "3.25rem",
        15: "3.75rem",
        17: "4.25rem",
        18: "4.5rem",
        19: "4.75rem",
        21: "5.25rem",
        22: "5.5rem",
        23: "5.75rem",
        25: "6.25rem",
        26: "6.5rem",
        27: "6.75rem",
        28: "7rem",
        29: "7.25rem",
        30: "7.5rem",
        31: "7.75rem",
        33: "8.25rem",
        34: "8.5rem",
        35: "8.75rem",
        37: "9.25rem",
        39: "9.75rem",
        42: "10.5rem",
        45: "11.25rem",
        46: "11.5rem",
        47: "11.75rem",
        50: "12.5rem",
        54: "13.5rem",
        61: "15.25rem",
        65: "16.25rem",
        66: "16.5rem",
        75: "18.75rem",
        90: "22.5rem",
        91: "22.75rem",
        93: "23.25rem",
        95: "23.75rem",
        98: "24.5rem",
        100: "25rem",
        108: "27rem",
        120: "30rem",
        123: "30.75rem",
        124: "31rem",
        125: "31.25rem",
        135: "33.75rem",
        139: "34.75rem",
        150: "37.5rem",
        154: "38.5rem",
        159: "39.75rem",
        200: "50rem",
        6.5: "1.625rem",
        11.5: "2.875rem",
        13.5: "3.375rem",
        14.5: "3.625rem",
      },
      borderWidth: {
        6: "6px",
      },
      fontFamily: {
        inter: [
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
        ],
        agenda: [
          "Agenda",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      transitionProperty: {
        fontWeight: "font-weight",
        padding: "padding",
        width: "width",
      },
      zIndex: {
        header: "9999",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      boxShadow: {
        modal: "0px 0px 40px -16px rgba(0, 0, 0, 0.20)",
        "borders-interactive-with-active":
          "0px 0px 0px 1px rgba(59, 130, 246, 1), 0px 0px 0px 4px rgba(59, 130, 246, 0.2)",
        "borders-interactive-with-active-dark":
          "0px 0px 0px 1px rgba(96, 165, 250, 1), 0px 0px 0px 4px rgba(59, 130, 246, 0.25)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        "header-text": "hsl(46, 22%, 92%)",
        "footer-bg": "hsl(200, 36.8%, 37.3%)",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  safelist: [
    {
      pattern: /col-(start|end)-(1|2|3|4|5|6|7|8|9|10|11|12|13)/,
      variants: ["xs", "sm", "md", "lg", "xl"],
    },
  ],
  plugins: [require("tailwindcss-radix"), require("tailwindcss-animate")],
}
