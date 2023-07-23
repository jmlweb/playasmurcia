import Link from 'next/link';

import { LogoSymbol } from './LogoSymbol';

export const Logo = () => (
  <Link
    href="/"
    className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-200 transition-colors hover:text-sky-300 md:text-xl
  "
  >
    <LogoSymbol className="h-6 w-6 fill-current md:h-7 md:w-7" />
    <span className="-mt-0.5 inline-block antialiased md:-mt-1">
      playasmurcia
    </span>
  </Link>
);
