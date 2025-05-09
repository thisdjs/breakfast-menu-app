/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "brand-primary": "#8B5E3C",
        "brand-accent": "#E4A754",
        "brand-card-border": "#D1C0A8",
        "header-background": "#713F12",
        "footer-background": "#FEF9C3",
        "brand-header-bg": "#713f12", // Dark brown from the header
        "brand-footer-bg": "#FEF9C3",
        "brand-main-bg": "#FEFDF7", // Light beige/cream for main page background
        "brand-surface": "#FFFFFF", // White for card backgrounds, modal background
        "brand-primary-accent": "#E4A754", // Yellow-orange for card borders, buttons, active elements
        "brand-secondary-accent": "#F7DDA4", // Lighter yellow for item icon backgrounds
        "brand-text-primary": "#3A2E25", // Dark brown/gray for primary text (e.g., "Breakfast Menu")
        "brand-text-secondary": "#75665A", // Lighter brown/gray for secondary text (e.g., item names)
        "brand-text-on-accent": "#FFFFFF", // White text on dark/accent backgrounds (e.g., "+" button)
        "brand-modal-bg": "#FFFFFF", // White for the modal itself
        "brand-modal-overlay": "#2D2D2D", // Dark gray for the right panel overlay/background
        "brand-input-border": "#D1C0A8", // Light brown/gray for input borders in the modal
        "brand-input-text": "#4A3B31", // Text color inside input fields
        "brand-placeholder-text": "#A89C92", // Placeholder text color in modal inputs
        "brand-button-disabled-bg": "#E5E7EB", // A generic light gray for disabled button backgrounds (like scroll arrows)
        "brand-button-disabled-text": "#9CA3AF", // A generic gray for disabled button text/icons
        "brand-order-summary-bg": "#FDFBF0", // Slightly different beige for "Your Order" section
        "brand-order-summary-text": "#5A4A3C", // Text in "Your Order" section
        "brand-order-price": "#4A3B31", // Price text color
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.08)",
        "card-center": "0 8px 20px rgba(0, 0, 0, 0.12)",
        "button-accent": "0 4px 10px rgba(228, 167, 84, 0.4)",
      },
    },
  },
  plugins: [scrollbarHide],
};
