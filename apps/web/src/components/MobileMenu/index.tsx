import Link from 'next/link';
import { LuGrip } from 'react-icons/lu';

import { PATHS } from '@/config/paths';
import { Counters } from '@/data';

import { Modal } from './Modal';

type Props = {
  features: Counters;
  municipalities: Counters;
};

export const MobileMenu = ({ features, municipalities }: Props) => (
  <div className="block md:hidden">
    <Modal
      trigger={
        <button className="flex items-center gap-1 py-3 text-sm">
          Menú
          <LuGrip className="text-lg" />
        </button>
      }
    >
      <dl className="leading-relaxed">
        <dd className="mb-4">
          <Link href="/lista-playas" className="block font-medium text-sky-700">
            Ver todas las playas
          </Link>
        </dd>
        <dt className="mb-1 font-semibold text-gray-500">Municipios</dt>
        {municipalities.map(({ name, slug, count }) => (
          <dd key={slug}>
            <Link
              href={`/${PATHS.municipality}/${slug}`}
              className="mb-0.5 block font-medium text-sky-700"
            >
              {name}{' '}
              <span className="text-sm text-gray-500">({count} playas)</span>
            </Link>
          </dd>
        ))}
        <dt className="mb-1 mt-4 font-semibold text-gray-500">
          Características
        </dt>
        {features.map(({ name, slug, count }) => (
          <dd key={slug}>
            <Link
              href={`/${PATHS.feature}/${slug}`}
              className="mb-0.5 block font-medium text-sky-700"
            >
              {name}{' '}
              <span className="text-sm text-gray-500">({count} playas)</span>
            </Link>
          </dd>
        ))}
      </dl>
    </Modal>
  </div>
);
