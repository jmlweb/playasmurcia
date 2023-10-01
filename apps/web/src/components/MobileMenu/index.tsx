import dynamic from 'next/dynamic';
import Link from 'next/link';

import { PATHS } from '@/config/paths';
import { Counters } from '@/data';

import { ItemsBlock } from './ItemsBlock';
import { Trigger } from './Trigger';

const Modal = dynamic(() => import('./Modal'), {
  loading: () => <Trigger disabled />,
  ssr: false,
});

type Props = {
  features: Counters;
  municipalities: Counters;
};

export const MobileMenu = ({ features, municipalities }: Props) => (
  <div className="block md:hidden">
    <Modal trigger={<Trigger />}>
      <dl className="leading-relaxed">
        <dd>
          <Link
            href={`/${PATHS.all}`}
            className="block font-medium text-sky-700"
          >
            Ver todas las playas
          </Link>
        </dd>
        <ItemsBlock
          title="Municipios"
          path={PATHS.municipality}
          items={municipalities}
        />
        <ItemsBlock
          title="Características"
          path={PATHS.feature}
          items={features}
        />
      </dl>
    </Modal>
  </div>
);
