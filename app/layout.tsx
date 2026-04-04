import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AI } from "./actions";

const manrope = Manrope({ subsets: ["latin"] });

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
            <body className={manrope.className}>
                <AI>
                    {children}
                </AI>
            </body>
        </html>
    );
}
