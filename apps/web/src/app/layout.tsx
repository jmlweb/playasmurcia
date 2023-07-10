import './global.css';

import { Metadata } from 'next';

import { Header } from './header';

export const metadata: Metadata = {
  title:
    'PlayasMurcia: La información más completa sobre las playas de la Región de Murcia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-gray-100">
      <body className="min-h-screen scroll-smooth bg-gradient-to-t from-indigo-200/20 via-red-200/20 to-yellow-100/20">
        <Header />
        {children}
      </body>
    </html>
  );
}
