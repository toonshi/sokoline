import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CartProvider } from "@/components/providers/CartProvider";
import ChatSheet from "@/components/ChatSheet";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sokoline",
  description: "Your modern marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en" className="antialiased">
          <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
            <Navbar />
            <Breadcrumbs />
            <main>
              {children}
            </main>
            <ChatSheet />
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
