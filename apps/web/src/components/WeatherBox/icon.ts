import { cva, VariantProps } from 'class-variance-authority';

export const icon = cva(undefined, {
  variants: {
    type: {
      weather: 'text-4xl',
      wind: 'text-2xl mt-1.5 origin-center',
    },
    mode: {
      list: 'text-white',
      detail: 'text-gray-500',
    },
  },
});

export type IconProps = VariantProps<typeof icon>;
