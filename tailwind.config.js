/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#e6ebe0',
                secondary: {
                    DEFAULT: '#5ca4a9',
                    100: '#9bc1bc',
                    200: '#3c6382',
                    300: '#f4f1bb',
                    400: '#ed6a5a',
                },
                gray: {
                    100: '#CDCDE0',
                },
            },
            fontFamily: {
                pthin: ['Poppins-Thin', 'sans-serif'],
                pextralight: ['Poppins-ExtraLight', 'sans-serif'],
                plight: ['Poppins-Light', 'sans-serif'],
                pregular: ['Poppins-Regular', 'sans-serif'],
                pmedium: ['Poppins-Medium', 'sans-serif'],
                psemibold: ['Poppins-SemiBold', 'sans-serif'],
                pbold: ['Poppins-Bold', 'sans-serif'],
                pextrabold: ['Poppins-ExtraBold', 'sans-serif'],
                pblack: ['Poppins-Black', 'sans-serif'],
            },
            textShadow: {
                outline:
                    '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
            },
        },
    },
    plugins: [],
};
