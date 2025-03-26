import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // White background
        foreground: "#1a1a1a", // Slightly softer black for better readability
        secondaryText: "#6b7280", // Medium gray for secondary text
        border: "#e5e7eb", // Light gray for borders
        inputBg: "#f9fafb", // Very light gray for input backgrounds
        focus: "#808080", // Gray for focus states
        primary: "#1a1a1a", // Primary color
        error: "#ef4444", // Red for error states
        success: "#22c55e", // Green for success states
        warning: "#f59e0b", // Yellow for warning states
      },
      fontFamily: {
        sans: ["var(--font-montserrat)"],
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: '0.3'
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(5deg)',
            opacity: '0.15'
          },
        },
        slideIn: {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        slideIn: 'slideIn 0.5s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
};

export default config;