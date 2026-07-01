import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font";
import { GeistMono } from "geist/font/mono";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "RedPacket — Web3 红包基础设施",
  description:
    "免合约、跨链、即插即用。3 分钟接入红包能力，让每个 Web3 项目都有红包功能。",
  keywords: ["Web3", "红包", "区块链", "RedPacket", "引流工具"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-geist-sans)" }}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
