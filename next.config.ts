import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
        formats: ['image/avif', 'image/webp'],
    },
    // Enable SWC minification for faster builds
    // swcMinify is enabled by default in Next.js 15+

    // Production optimizations
    reactStrictMode: true,
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png)',
                locale: false,
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    }
                ],
            },
        ];
    },
};

export default nextConfig;
