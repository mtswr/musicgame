import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MusicGame",
  description: "A music guessing game powered by Spotify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-zinc-100 font-mono min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          {/* <Footer /> */}
          <p className="text-center text-zinc-400 text-sm mb-4">powered by <a href="https://developer.spotify.com/documentation/web-api/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 text-emerald-500">Spotify API</a></p>
          <p className="text-center text-zinc-400 text-sm mb-4">made by <a href="https://github.com/mtswr" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200  text-emerald-500">@mtswr</a></p>
        </Providers>
      </body>
    </html>
  );
}
