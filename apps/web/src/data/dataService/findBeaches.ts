import { DataBeach } from '@/types';

import { getSortedBeaches } from './getSortedBeaches';
import { toSimpleBeach } from './toSimpleBeach';

const PER_PAGE = 24;

export const findBeaches = async (
  page: number,
  predicate: (beach: DataBeach) => boolean = () => true,
) => {
  const sortedBeaches = getSortedBeaches();
  const filteredBeaches = sortedBeaches.filter(predicate);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  return {
    beaches: await Promise.all(
      filteredBeaches.slice(start, end).map(toSimpleBeach),
    ),
    total: filteredBeaches.length,
    pages: Math.ceil(filteredBeaches.length / PER_PAGE),
  };
};
