import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        'custom-w': '20rem', // Defina o valor específico de largura desejado
        'custom-h': '30rem', // Defina o valor específico de altura desejado
      },
    },
    
  },
  plugins: [],
};
export default config;
