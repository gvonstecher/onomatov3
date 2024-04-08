/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                rojo: "#EB5757",
                amarillo: "#F2C94C",
                grisBackground: "#F5F5F5",
                grisClaro: "#828282",
                grisTopo: "#4F4F4F",
            },
        },
    },
    plugins: [],
};
