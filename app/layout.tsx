import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AI } from "./actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Agri-OS | Generative Farm Management Platform",
    description: "Next-generation farm management platform with AI-driven interface generation for precision agriculture.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <AI>
                    {children}
                </AI>
            </body>
        </html>
    );
}
