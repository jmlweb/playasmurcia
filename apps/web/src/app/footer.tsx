import { cva } from 'class-variance-authority';
import Link from 'next/link';

import { Container } from '@/components/Container';
import { Logo } from '@/components/Logo';
import { PATHS } from '@/config/paths';
import { Counters } from '@/data';

const gridStyle = cva(['grid grid-cols-2 gap-x-6 gap-y-1'], {
  variants: {
    expanded: {
      true: ['2xl:grid-cols-3'],
    },
  },
});

type LinksGroupProps = {
  title: string;
  path: string;
  items: Counters;
};

const LinksGroup = ({ title, path, items }: LinksGroupProps) => (
  <div className="mt-4 border-t border-gray-600 xl:border-0 2xl:pr-6">
    <h4 className="mb-2 mt-4 font-semibold text-gray-400 xl:mb-3">{title}:</h4>
    <ul
      className={gridStyle({
        expanded: items.length > 6,
      })}
    >
      {items.map(({ name, count, slug }) => (
        <li key={slug}>
          <Link
            href={`/${path}/${slug}`}
            className="group block py-1 text-gray-100 transition-colors motion-safe:hover:text-sky-300"
          >
            {name}{' '}
            <span className="ml-1 hidden rounded-full bg-gray-600 px-2 py-1 text-xs font-normal text-gray-200 transition-colors motion-safe:group-hover:bg-sky-200 motion-safe:group-hover:text-sky-700 md:inline-block">
              {count} playa{count !== 1 && 's'}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

type Props = {
  features: Counters;
  municipalities: Counters;
};

export const Footer = ({ features, municipalities }: Props) => (
  <footer className="mt-20 bg-gray-700 pb-12 pt-6 text-gray-100">
    <Container fixed className="justify-between gap-x-8 xl:flex">
      <div className="flex justify-center self-center xl:-mb-8 xl:flex-1 xl:justify-start">
        <Logo />
      </div>
      <div className="gap-20 xl:flex">
        <LinksGroup
          title="Municipios"
          path={PATHS.municipality}
          items={municipalities}
        />
        <LinksGroup
          title="Características"
          path={PATHS.feature}
          items={features}
        />
      </div>
    </Container>
  </footer>
);
