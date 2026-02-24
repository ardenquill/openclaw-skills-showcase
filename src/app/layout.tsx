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

export const metadata: Metadata = {
  title: "OpenClaw Skills Showcase — Security Audited",
  description:
    "Browse 12 OpenClaw skills with security audit results — prompt injection vectors, key exposure risks, and input validation findings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}
      >
        <div className="min-h-screen">
          <header className="border-b border-zinc-800/50">
            <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
              <a href="/" className="text-sm font-bold tracking-tight text-zinc-100 hover:text-white">
                OpenClaw Skills
              </a>
              <a
                href="https://github.com/BankrBot/openclaw-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                GitHub
              </a>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-zinc-800/50 mt-20">
            <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-zinc-600">
              Security audit powered by OpenClaw. Not affiliated with skill providers.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
