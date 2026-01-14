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
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-out': 'fadeOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-down': 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-left': 'slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-right': 'slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scale-out': 'scaleOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'bounce-in': 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'wiggle': 'wiggle 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
                'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'spin-slow': 'spin 3s linear infinite',
                'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(30px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(-30px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                scaleOut: {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '100%': { transform: 'scale(0.9)', opacity: '0' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '25%': { transform: 'rotate(-3deg)' },
                    '75%': { transform: 'rotate(3deg)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(212, 119, 111, 0.2), 0 0 10px rgba(212, 119, 111, 0.1)' },
                    '100%': { boxShadow: '0 0 20px rgba(212, 119, 111, 0.4), 0 0 30px rgba(212, 119, 111, 0.2)' },
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
