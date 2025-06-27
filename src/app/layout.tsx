import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { Header } from '@/components/layouts/header';
import { Footer } from '@/components/layouts/footer';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "F1天気予報 | Formula 1 Weather Forecast",
  description: "Formula 1グランプリ開催地の天気予報を美しいビジュアルでお届け。レースウィークエンドの準備に最適な情報をリアルタイムで提供します。",
  keywords: "F1, Formula 1, 天気予報, weather, forecast, グランプリ, Grand Prix, レース, race",
  authors: [{ name: "F1天気予報" }],
  verification: {
    google: "nGfAM9a8ubXmxiIz5ytMmrQFlGzYbPnNsrDtnHOfmZg",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
