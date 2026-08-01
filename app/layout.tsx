import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Arc.Studio — The Offline Service Strategist',
  description:
    'The offline, localized AI decision engine that turns raw inquiries into optimized profits—without ever connecting to the cloud.',
  keywords: ['offline AI', 'local AI', 'service business', 'freelancer', 'contractor', 'privacy'],
  openGraph: {
    title: 'Arc.Studio — The Offline Service Strategist',
    description: 'Your Business. Your Data. Your Rules.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} font-(family-name:--font-space-grotesk) antialiased bg-[#0A0A0A] text-white`}>
        {children}
      </body>
    </html>
  );
}