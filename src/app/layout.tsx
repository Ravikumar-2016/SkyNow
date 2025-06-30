import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'SkyNow - Real-time Weather Forecasts',
  description: 'Get accurate weather forecasts, live updates, and severe weather alerts for your location.',
  keywords: ['weather', 'forecast', 'meteorology', 'temperature', 'rain', 'sun'],
  authors: [{ name: 'Your Name', url: 'https://sky-now-three.vercel.app/' }],
  openGraph: {
    title: 'SkyNow Weather',
    description: 'Real-time weather forecasts and alerts',
    url: 'https://sky-now-three.vercel.app/',
    siteName: 'SkyNow',
    images: [
      {
        url: 'https://skynow.weather/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkyNow Weather',
    description: 'Real-time weather forecasts and alerts',
    images: ['https://skynow.weather/twitter-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
         <Analytics />
      </body>
    </html>
  );
}
