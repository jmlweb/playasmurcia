import { ReactNode } from 'react';

import { Container } from '@/components/Container2';
import { Logo } from '@/components/Logo2';

type Props = {
  desktopMenu: ReactNode;
  mobileMenu: ReactNode;
};

export const Header = ({ desktopMenu, mobileMenu }: Props) => (
  <header className="relative top-0 z-10 bg-gray-700 text-gray-200 shadow-md shadow-gray-900/30">
    <Container className="flex min-h-[55px] items-center justify-between" fixed>
      <Logo />
      {desktopMenu}
      {mobileMenu}
    </Container>
  </header>
);
