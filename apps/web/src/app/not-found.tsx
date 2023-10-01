import Link from 'next/link';

import { PATHS } from '@/config/paths';

export default function NotFound() {
  return (
    <div className="pb-4 pt-8 md:pb-6 md:pt-12 text-center">
      <h1 className="text-xl font-bold text-gray-600 md:text-2xl lg:text-3xl">
        Página no encontrada
      </h1>
      <p className="mt-2 text-xl font-semibold text-sky-700 motion-safe:hover:text-sky-500">
        Ver <Link href={`/${PATHS.all}`}>Todas las playas</Link>
      </p>
    </div>
  );
}
