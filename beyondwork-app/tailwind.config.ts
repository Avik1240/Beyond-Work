import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Calm Corporate Energy Color System
        background: {
          DEFAULT: '#000', // pure black - app background
          subtle: '#222', // dark gray - elevated surfaces
          card: '#222', // card/surface background
        },
        text: {
          primary: '#ccc', // light gray - main text
          secondary: '#999', // medium gray - supporting text and metadata
        },
        accent: {
          DEFAULT: '#37A961', // corporate green - single accent
          500: '#37A961', // alias for compatibility
        },
        border: {
          DEFAULT: '#3f3f3f', // soft, low-contrast borders
          subtle: '#252d3a', // very subtle borders
          elevated: '#374151', // slightly more visible
        },
        destructive: {
          DEFAULT: '#dc2626', // muted red
          subtle: '#7f1d1d', // dark red background
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'card': '0.75rem', // 12px - consistent card radius
      },
      maxWidth: {
        'content': '1280px', // constrained content width
      },
    },
  },
  plugins: [],
};
export default config;
