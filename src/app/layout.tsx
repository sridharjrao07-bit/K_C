import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/language-context";
import { CartProvider } from "@/context/cart-context";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Kaarigar Connect - Empowering Traditional Artisans",
    description: "A platform to help kaarigar (artisans) verify their craft, get onboarded, and sell on major marketplaces.",
    keywords: ["kaarigar", "artisan", "marketplace", "verification", "handmade", "crafts", "karigar"],
    authors: [{ name: "Kaarigar Connect Team" }],
    openGraph: {
        title: "Kaarigar Connect",
        description: "Empowering Traditional Artisans",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="min-h-screen">
                <LanguageProvider>
                    <CartProvider>
                        <Navbar />
                        <main>{children}</main>
                        <CartDrawer />
                    </CartProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}

