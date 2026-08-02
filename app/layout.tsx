import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arc Studio — The Business Strategist',
  description:
    'The offline, localized AI decision engine that turns raw inquiries into optimized profits—without ever connecting to the cloud.',
  keywords: ['Machie Learning', 'local AI', 'service business', 'freelancer', 'contractor', 'privacy'],
  openGraph: {
    title: 'Arc Studio — The Business Strategist',
    description: 'Your Business. Your Data. Your Rules.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#0A0A0A] text-white" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}