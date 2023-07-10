import Link from 'next/link';

import { LogoSymbol } from './logo-symbol';

export const Logo = () => (
  <Link
    href="/"
    className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-300 transition-colors hover:text-gray-400 md:text-xl
  "
  >
    <LogoSymbol className="h-6 w-6 fill-current md:h-7 md:w-7" />
    <span className="inline-block -mt-1">playasmurcia</span>
  </Link>
);
