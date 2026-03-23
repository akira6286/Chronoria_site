import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* 🔥 改這裡就好 */
export const metadata: Metadata = {
  title: "Chronoria｜時序之境",
  description: "在時間交錯的縫隙之中，無數存在被改寫。Chronoria 是一個關於時間、命運與選擇的世界。",
  icons: {
    icon: "/images/時序之境_iconB_單色_光暈.png",
  },
  openGraph: {
    title: "Chronoria｜時序之境 - 時間交錯的世界",
    description: "在時間交錯的縫隙之中，無數存在被改寫。Chronoria 是一個關於時間、命運與選擇的世界。",
    url: "https://chronoria.leetcord.org",
    siteName: "Chronoria",
    images: [
      {
        url: "https://chronoria.leetcord.org/images/文字/時序之境_文字_單色_深.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronoria｜時序之境 - 時間交錯的世界",
    description: "在時間交錯的縫隙之中，無數存在被改寫。Chronoria 是一個關於時間、命運與選擇的世界。",
    images: [
      "https://chronoria.leetcord.org/images/文字/時序之境_文字_單色_深.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
