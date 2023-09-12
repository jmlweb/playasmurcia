import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

const pill = cva(
  'rounded bg-white/95 px-2 py-1 text-sm shadow-lg transition-colors',
  {
    variants: {
      blueFlag: {
        true: [
          'text-sky-600',
          'motion-safe:group-hover:bg-sky-600/75',
          'motion-safe:group-hover:text-sky-100',
        ],
        false: [
          'text-gray-500',
          'motion-safe:group-hover:bg-gray-600/75',
          'motion-safe:group-hover:text-gray-100',
        ],
      },
    },
  },
);

type Props = {
  children: ReactNode;
  blueFlag?: boolean;
};

export const Pill = ({ blueFlag = false, children }: Props) => (
  <li
    className={pill({
      blueFlag,
    })}
  >
    {children}
  </li>
);
