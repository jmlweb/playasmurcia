import { pluralizeBeach } from '@/utils';

type Props = {
  currentPage: number;
  total: number;
  suffix: string;
};

export const ItemsSectionHeader = ({ currentPage, total, suffix }: Props) => (
  <header className="flex items-baseline justify-between pb-4 pt-8 md:pb-6 md:pt-12">
    <h1 className="relative text-xl font-bold text-gray-600 md:text-2xl lg:text-3xl">
      <span className="text-gray-400">{total}</span> {pluralizeBeach(total)}{' '}
      {suffix}
    </h1>
    {Number(currentPage) > 1 && (
      <span className="ml-2 hidden text-gray-400 sm:block md:text-lg">
        Página {currentPage}
      </span>
    )}
  </header>
);
