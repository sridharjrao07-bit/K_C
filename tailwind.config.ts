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
                primary: {
                    50: '#faf6f3',
                    100: '#f2e8df',
                    200: '#e5d1bf',
                    300: '#d4a574',
                    400: '#c89563',
                    500: '#b87d4b',
                    600: '#a76d42',
                    700: '#8b5a37',
                    800: '#6f4a2e',
                    900: '#5a3b25',
                },
                secondary: {
                    50: '#f9f6f2',
                    100: '#f0e8dc',
                    200: '#e1d1b9',
                    300: '#d2ba96',
                    400: '#c3a373',
                    500: '#a68a64',
                    600: '#8b7355',
                    700: '#6f5c46',
                    800: '#534537',
                    900: '#3e2723',
                },
                accent: {
                    50: '#fdf5f3',
                    100: '#f9e6e1',
                    200: '#f4cdc3',
                    300: '#eeb4a5',
                    400: '#e89b87',
                    500: '#d4776f',
                    600: '#c65d51',
                    700: '#a84e44',
                    800: '#8a3f37',
                    900: '#6c302a',
                },
                earth: {
                    50: '#faf8f5',
                    100: '#f5f0e8',
                    200: '#e8dcc9',
                    300: '#d1c0a3',
                    400: '#b5a084',
                    500: '#9a8268',
                    600: '#7d6b54',
                    700: '#625442',
                    800: '#4a3f32',
                    900: '#332b23',
                },
                cream: '#faf7f2',
                clay: '#d4776f',
                terracotta: '#c65d51',
                sand: '#e5d1bf',
                bark: '#6f5c46',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-in-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.5s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                'texture-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4a574\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            },
        },
    },
    plugins: [],
};

export default config;
