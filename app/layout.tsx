import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Caveat } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Providers } from "./providers";
import Script from 'next/script';

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roberto Save Dreams Foundation",
  description: "Empowering communities through education, microloans, and sustainable development initiatives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en"
      suppressHydrationWarning={true}
      className={`${heebo.variable} ${caveat.variable} light`}
    >
      <head>
        <Script
          src="https://js.lenco.co/v1/lenco.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-white text-gray-900" suppressHydrationWarning={true}>
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
