import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store-context';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

const APP_NAME = "Gospel Viva Store";
const APP_DESCRIPTION = "Literatura que edifica sua vida.";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
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
        <FirebaseClientProvider>
          <StoreProvider>
            <div className="min-h-screen">
              <Header />
              <main className="max-w-4xl mx-auto min-h-[calc(100vh-64px)]">
                {children}
              </main>
            </div>
            <Toaster />
          </StoreProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
