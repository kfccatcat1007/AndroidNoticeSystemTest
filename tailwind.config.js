import uniAppPlugin from './src/tailwind-uniapp-plugin.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#4080ff',
        'primary-light': '#5590ff'
      },
      borderRadius: {
        'large': '24px',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['hover', 'active'],
    },
  },
  plugins: [
    uniAppPlugin
  ],
  corePlugins: {
    preflight: false  // 避免与 uni-app 样式冲突
  }
} 