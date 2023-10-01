import { cva } from 'class-variance-authority';
import Image from 'next/image';
import { ReactNode } from 'react';

import { IMAGES } from '@/config/images';

import emptyBeach from './empty-beach.jpg';

const image = cva(
  'block h-auto w-full transition-transform duration-700 motion-safe:group-hover:scale-105',
  {
    variants: {
      empty: {
        false: 'bg-gray-200',
        true: 'opacity-60 blur-sm',
      },
    },
  },
);

const EmptyWrapper = ({ children }: { children: ReactNode }) => (
  <div className="bg-gradient-to-r from-red-400/80 via-red-500/80 to-yellow-400/80">
    {children}
  </div>
);

type Props = {
  src: string;
  priority: boolean;
};

export const ItemImage = ({ src, priority }: Props) => {
  if (!src) {
    return (
      <EmptyWrapper>
        <Image
          src={emptyBeach}
          width={416}
          height={234}
          alt=""
          className={image({ empty: true })}
          priority={priority}
        />
      </EmptyWrapper>
    );
  }
  return (
    <Image
      src={`${IMAGES.list}${src}`}
      width={416}
      height={234}
      alt=""
      className="block h-auto w-full transition-transform duration-700 motion-safe:group-hover:scale-105 bg-gray-200"
      priority={priority}
    />
  );
};
