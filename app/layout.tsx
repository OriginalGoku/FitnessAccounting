import type { Metadata } from 'next'
import './globals.css'
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: 'FitBooks | Bookkeeping for Fitness Professionals',
  description: 'Expert bookkeeping services designed specifically for personal trainers, fitness instructors, and studio owners in the GTA. I speak fitness and finance.',
  keywords: 'bookkeeping, personal trainer, fitness, accounting, GTA, Toronto, Richmond Hill, QuickBooks, HST',
  authors: [{ name: 'FitBooks' }],
  openGraph: {
    title: 'FitBooks | Bookkeeping for Fitness Professionals',
    description: 'Expert bookkeeping services designed specifically for personal trainers, fitness instructors, and studio owners in the GTA.',
    type: 'website',
    locale: 'en_CA',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <Navigation />
        
        <div className="pt-20  min-h-[70vh]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}