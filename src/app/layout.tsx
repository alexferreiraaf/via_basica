import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store-context';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Gospel Viva Store',
  description: 'Literatura que edifica sua vida.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full font-body antialiased bg-background">
        <StoreProvider>
          <div className="min-h-screen">
            <Header />
            <main className="max-w-4xl mx-auto min-h-[calc(100vh-64px)]">
              {children}
            </main>
          </div>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
