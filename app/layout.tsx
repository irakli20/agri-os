import type { Metadata } from "next";
import "./globals.css";
import { AI } from "./actions";

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
            <body className="font-sans antialiased">
                <AI>
                    {children}
                </AI>
            </body>
        </html>
    );
}
