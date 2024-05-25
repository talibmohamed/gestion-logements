const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#171821",
            divider: "#21222d",
            primary: {
              DEFAULT: "#f9769d",
              50: '#ffe3eb',
              100: '#ffc2d1',
              200: '#ff9db4',
              300: '#ff7897',
              400: '#ff5a83',
              500: '#f9769d',
              600: '#e0598a',
              700: '#c34772',
              800: '#a6365b',
              900: '#872745',
              foreground: "#d3d3d3",
            },
            secondary: {
              DEFAULT: "#96a7ff",
              50: '#f0f3ff',
              100: '#d9e0ff',
              200: '#b4c3ff',
              300: '#8ea7ff',
              400: '#708fff',
              500: '#5277ff',
              600: '#3f63e0',
              700: '#324fb3',
              800: '#263b85',
              900: '#1a2957',
              foreground: "#d3d3d3",
            }, 
            focus: "#f9769d",
          },
        },
      },
    }),
  ]
};
    // theme : {
    //   colors: {
    //     transparent: 'transparent',
    //     // current: 'currentColor',
    //     'dark-blue' : '#171821',
    //     'raisin-black' : '#21222d',
    //     'light-crimson' : '#f9769d', 
    //     'light-periwinkle': '#96a7ff',
    //     'light-gray' : '#f3f3f3',
    //     'pinkish-gradient' : 'linear-gradient(45deg, rgba(23, 24, 33, 1) 30%, rgba(249, 118, 157, 1) 420%)'
    //   }
    // }

