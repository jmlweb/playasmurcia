'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { LuChevronDown } from 'react-icons/lu';
import { twMerge } from 'tailwind-merge';

import { PATHS } from '@/config/paths';
import { Counters } from '@/data';

type Props = {
  title: string;
  basePath: string;
  data: Counters;
};

export const MenuItem = ({ title, basePath, data }: Props) => (
  <NavigationMenu.Item>
    <NavigationMenu.Trigger className="group flex select-none items-center justify-between gap-1 px-3 py-5 text-[15px] font-medium leading-none text-gray-200 transition-colors motion-safe:hover:text-sky-300 focus:shadow-md">
      {title}
      <LuChevronDown />
    </NavigationMenu.Trigger>
    <NavigationMenu.Content
      className={twMerge(
        'absolute right-0 top-0 w-full p-4 data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft sm:w-auto',
        basePath.startsWith(`/${PATHS.municipality}`)
          ? 'min-w-[600px]'
          : 'min-w-[220px]',
      )}
    >
      <ul
        className={
          basePath.startsWith(`/${PATHS.municipality}`)
            ? 'grid grid-cols-2'
            : 'flex flex-col'
        }
      >
        {data.map((dataItem) => (
          <li key={dataItem.slug}>
            <Link href={`${basePath}/${dataItem.slug}`} legacyBehavior passHref>
              <NavigationMenu.Link className="group flex select-none items-center py-3 text-[15px] font-medium leading-none text-gray-500 no-underline transition-colors motion-safe:hover:text-gray-700">
                {dataItem.name}{' '}
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-normal transition-colors duration-75 motion-safe:group-hover:bg-sky-200">
                  {dataItem.count} playa{dataItem.count !== 1 && 's'}
                </span>
              </NavigationMenu.Link>
            </Link>
          </li>
        ))}
      </ul>
    </NavigationMenu.Content>
  </NavigationMenu.Item>
);
