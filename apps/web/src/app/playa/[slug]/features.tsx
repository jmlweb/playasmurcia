import { cva } from 'class-variance-authority';

import { FEATURES, getFeatureName } from '@/data';
import { Beach } from '@/types';

const parsedFeatures = Object.keys(FEATURES);

const style = cva(['rounded px-3 py-2 shadow-lg'], {
  variants: {
    type: {
      blueFlag: ['bg-sky-700', 'text-white'],
      feature: ['bg-gray-600', 'text-white'],
    },
    status: {
      disabled: ['line-through', 'opacity-40', 'cursor-not-allowed'],
    },
  },
});

type Props = Pick<Beach, 'blueFlag' | 'features'>;

const Features = ({ blueFlag, features }: Props) => (
  <ul className="mb-10 flex flex-wrap gap-x-2 gap-y-3 text-sm lg:text-base">
    {parsedFeatures.map((feature) => (
      <li
        key={feature}
        className={style(
          feature === 'bandera-azul'
            ? {
                type: 'blueFlag',
                status: !blueFlag ? 'disabled' : undefined,
              }
            : {
                type: 'feature',
                status: !features.includes(feature) ? 'disabled' : undefined,
              },
        )}
      >
        {getFeatureName(feature)}
      </li>
    ))}
  </ul>
);

export default Features;
