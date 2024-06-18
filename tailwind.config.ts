import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"

  ],
  
  darkMode:'class',
  fontFamily: {
    'body': [
  'Inter', 
  'ui-sans-serif', 
  'system-ui', 
  '-apple-system', 
  'system-ui', 
  'Segoe UI', 
  'Roboto', 
  'Helvetica Neue', 
  'Arial', 
  'Noto Sans', 
  'sans-serif', 
  'Apple Color Emoji', 
  'Segoe UI Emoji', 
  'Segoe UI Symbol', 
  'Noto Color Emoji'
],
    'sans': [
  'Inter', 
  'ui-sans-serif', 
  'system-ui', 
  '-apple-system', 
  'system-ui', 
  'Segoe UI', 
  'Roboto', 
  'Helvetica Neue', 
  'Arial', 
  'Noto Sans', 
  'sans-serif', 
  'Apple Color Emoji', 
  'Segoe UI Emoji', 
  'Segoe UI Symbol', 
  'Noto Color Emoji'
]
  },
  plugins: [nextui({
    themes: {
      "purple-dark": {
        extend: "dark", // <- inherit default values from dark theme
        colors: {
          background:"#131312",
          foreground: "#fff",
          primary: {
            50: "#3B096C",
            100: "#520F83",
            200: "#7318A2",
            300: "#9823C2",
            400: "#c031e2",
            500: "#DD62ED",
            600: "#F182F6",
            700: "#FCADF9",
            800: "#FDD5F9",
            900: "#FEECFE",
            DEFAULT: "#00B9AE",
            foreground: "#ffffff",
          },
          secondary:{
            50: "#3B096C",
            100: "#520F83",
            200: "#7318A2",
            300: "#9823C2",
            400: "#c031e2",
            500: "#DD62ED",
            600: "#F182F6",
            700: "#FCADF9",
            800: "#FDD5F9",
            900: "#FEECFE",
            DEFAULT:'#00B9AE',
            foreground: "#ffffff",
          },
          focus: "#F182F6",
        },
        layout: {
          disabledOpacity: "0.3",
          radius: {
            small: "4px",
            medium: "6px",
            large: "8px",
          },
          borderWidth: {
            small: "1px",
            medium: "2px",
            large: "3px",
          },
        },
       
      },
    },
  })]

};
export default config;
