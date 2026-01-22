import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL Shortener",  
  description: "Welcome to URL Shortener, it is a simple, fast and free URL shortening service.",        
  openGraph:{
    title: "URL Shortener",
    siteName: "URL Shortener",
    description: "Welcome to URL Shortener, it is a simple, fast and free URL shortening service.",
    images:"https://allez.me/home.png",
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>         
         <Script  strategy="beforeInteractive"
              data-website-id="6e2a6cf1-682c-462a-ad6b-237d8962adab" src="https://umami.ultra-neo.com/script.js" ></Script>         
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
