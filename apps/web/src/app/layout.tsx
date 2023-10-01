import './global.css';

import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Libre_Franklin } from 'next/font/google';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { DesktopMenu } from '@/components/DesktopMenu';
import { MobileMenu } from '@/components/MobileMenu';
import { dataService } from '@/data';

import { Footer } from './footer';
import { Header } from './header';

const libreFranklin = Libre_Franklin({
  subsets: ['latin-ext'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: 'https://www.playasmurcia.com',
  title:
    'PlayasMurcia: La información más completa sobre las playas de la Región de Murcia',
  description: `PlayasMurcia - Descubre tu oasis en las playas de la Costa Cálida.`,
  openGraph: {
    images: ['https://playasmurcia.com/og-image.jpg'],
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const [municipalities, features] = await Promise.all([
    dataService.municipalities(),
    dataService.features(),
  ]);

  return (
    <html
      lang="es"
      className={twMerge(
        'bg-gradient-to-t from-indigo-200/20 via-red-200/20 to-yellow-100/20',
        libreFranklin.variable,
      )}
    >
      <body className="flex min-h-[100dvh] flex-col overflow-y-auto overflow-x-hidden scroll-smooth bg-white/75 subpixel-antialiased">
        <Header
          desktopMenu={
            <DesktopMenu municipalities={municipalities} features={features} />
          }
          mobileMenu={
            <MobileMenu municipalities={municipalities} features={features} />
          }
        />
        <div className="w-full flex-1">{children}</div>
        <Footer features={features} municipalities={municipalities} />
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
