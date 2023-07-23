'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';

import { PATHS } from '@/config/paths';
import { Counters } from '@/data';

import { MenuItem } from './MenuItem';

type Props = {
  features: Counters;
  municipalities: Counters;
};

export const DesktopMenu = ({ features, municipalities }: Props) => (
  <NavigationMenu.Root
    className="relative z-50 hidden md:block"
    delayDuration={400}
  >
    <NavigationMenu.List className="flex items-center">
      <MenuItem
        basePath={`/${PATHS.municipality}`}
        title="Municipios"
        data={municipalities}
      />
      <MenuItem
        basePath={`/${PATHS.feature}`}
        title="Características"
        data={features}
      />
      <NavigationMenu.Item>
        <Link href={`/${PATHS.all}`} legacyBehavior passHref>
          <NavigationMenu.Link className="block select-none px-3 py-5 text-[15px] font-medium leading-none text-gray-200 no-underline outline-none transition-colors hover:text-sky-300 focus:shadow-[0_0_0_2px]">
            Todas las playas
          </NavigationMenu.Link>
        </Link>
      </NavigationMenu.Item>
      <NavigationMenu.Indicator className="top-full z-20 -m-2.5 flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease] data-[state=hidden]:animate-fadeOut data-[state=visible]:animate-fadeIn">
        <div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-white" />
      </NavigationMenu.Indicator>
    </NavigationMenu.List>
    <div className="perspective-[2000px] absolute right-0 top-full flex min-w-full justify-center">
      <NavigationMenu.Viewport className="relative h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-md bg-white shadow-lg transition-[width,_height] duration-300 data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn sm:w-[var(--radix-navigation-menu-viewport-width)]" />
    </div>
  </NavigationMenu.Root>
);