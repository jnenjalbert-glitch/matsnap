import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matsnap - Find Your Perfect Haircut",
  description:
    "AI-powered face scanning to recommend the best haircuts for your face shape.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-white min-h-screen`}>
        <header className="border-b border-zinc-100">
          <div className="mx-auto max-w-lg flex items-center justify-between px-4 py-3">
            <a href="/" className="text-xl font-bold tracking-tight">
              Matsnap
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/scan" className="text-zinc-600 hover:text-zinc-900">
                Scan
              </a>
              <a
                href="/login"
                className="rounded-lg bg-zinc-900 px-4 py-1.5 text-white hover:bg-zinc-800 transition-colors"
              >
                Sign In
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
