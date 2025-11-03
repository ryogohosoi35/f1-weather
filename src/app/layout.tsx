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
  title: "F1天気予報 | Formula 1レース開催地の詳細天気情報",
  description: "F1全レース開催サーキットの天気予報を詳しくお届け。決勝・予選・フリー走行の気温や降水確率をリアルタイムで確認。鈴鹿、モナコ、シルバーストーンなど各グランプリの天候をチェック。",
  keywords: "F1天気予報, Formula1天気, グランプリ天気, F1サーキット天気, 決勝天気, 予選天気, フリー走行, 鈴鹿天気, モナコGP, シルバーストーン, F1レース天候, 気温, 降水確率, レース予報, サーキット気象, F1ウィークエンド",
  authors: [{ name: "F1天気予報" }],
  verification: {
    google: "nGfAM9a8ubXmxiIz5ytMmrQFlGzYbPnNsrDtnHOfmZg",
  },
  // OGPメタタグ
  openGraph: {
    type: 'website',
    title: 'F1天気予報 | Formula 1レース開催地の詳細天気情報',
    description: 'F1全レース開催サーキットの天気予報を詳しくお届け。決勝・予選・フリー走行の気温や降水確率をリアルタイムで確認。',
    url: '/',
    siteName: 'F1天気予報',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'F1天気予報 - Formula 1レース開催地の詳細天気情報'
      }
    ],
    locale: 'ja_JP'
  },
  // Twitterカード
  twitter: {
    card: 'summary_large_image',
    title: 'F1天気予報 | Formula 1レース開催地の詳細天気情報',
    description: 'F1全レース開催サーキットの天気予報を詳しくお届け。決勝・予選・フリー走行の気温や降水確率をリアルタイムで確認。',
    images: ['/og-default.jpg']
  },
  // canonical link
  alternates: {
    canonical: '/'
  },
  // その他のメタデータ
  metadataBase: new URL('https://f1weathers.com')
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
  // metadataBaseの値を使用して構造化データのURLを構築
  // ビルド時に環境変数から取得、デフォルトはmetadata.metadataBaseの値を使用
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || metadata.metadataBase?.toString() || 'https://f1weathers.com';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    "name": "F1天気予報",
    "description": "F1全レース開催サーキットの天気予報を詳しくお届け。決勝・予選・フリー走行の気温や降水確率をリアルタイムで確認。",
    "url": siteUrl,
    "inLanguage": "ja",
    "about": {
      "@type": "Organization",
      "name": "Formula 1",
      "sameAs": "https://www.formula1.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "F1天気予報"
    },
    "keywords": ["F1天気予報", "Formula1天気", "グランプリ天気", "F1サーキット天気", "決勝天気", "予選天気"],
    "audience": {
      "@type": "Audience",
      "audienceType": "F1ファン",
      "geographicArea": {
        "@type": "Country",
        "name": "Japan"
      }
    }
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
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
