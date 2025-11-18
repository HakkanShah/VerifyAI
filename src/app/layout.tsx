import type {Metadata} from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { MatrixRainingLetters } from '@/components/matrix-background';
import { LightGrid } from '@/components/light-grid';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VerifyAI',
  description: 'Unmask the Truth with VerifyAI. Your shield against digital deception. Analyze text, images, and videos with our advanced AI detector.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-code antialiased min-h-screen flex flex-col bg-background overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <div className="dark:hidden">
              <LightGrid />
            </div>
            <MatrixRainingLetters />
            <Header />
            <div className="flex-grow relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-transparent to-background z-0"></div>
              <main className="relative z-10">
                {children}
              </main>
            </div>
            <Footer />
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
