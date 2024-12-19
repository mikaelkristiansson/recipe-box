'use client';
import '@/styles/globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Recipe Box" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body>
        <Providers>
          <main className="text-foreground bg-background">
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
