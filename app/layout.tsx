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
  title: "PASBAR JAYA | Klan Resmi Clash of Clans Indonesia",
  description: "Website resmi klan CoC PASBAR JAYA. Roster member, highlight war CWL & Classic ter-epic, event klan, dan statistik resmi Supercell.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-[#07090e] text-slate-100 antialiased selection:bg-amber-500 selection:text-black relative">
        
        {/* CRISP & CLEAR CLASH OF CLANS TOWN HALL FORTRESS BACKDROP (NO BLUR) */}
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none">
          {/* High-Res Town Hall Fortress Artwork - 100% Sharp */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65"
            style={{ backgroundImage: `url('/images/coc-townhall-bg.jpg')` }}
          />

          {/* Balanced Vignette Overlay to ensure text readability while keeping the Town Hall clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/75 via-[#07090e]/50 to-[#07090e]/85" />
          <div className="absolute inset-0 bg-radial-[ellipse_at_top] from-amber-500/10 via-transparent to-transparent" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>

      </body>
    </html>
  );
}
