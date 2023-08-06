import { cva } from 'class-variance-authority';

import { WeatherBox } from '@/components/WeatherBox';
import { Prediction } from '@/types';

type Props = {
  data: Prediction[];
};

const titleStyle = cva(['font-medium', 'mb-2', 'text-sm'], {
  variants: {
    current: {
      true: ['text-sky-700'],
      false: ['text-gray-500'],
    },
  },
});

export const Predictions = ({ data }: Props) => (
  <ul className="mt-4 lg:mt-6 mb-14 grid gap-4 md:gap-6 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
    {data.map((prediction, index) => (
      <li key={prediction.day}>
        <p
          className={titleStyle({
            current: index === 0,
          })}
        >
          {prediction.day}
        </p>
        <WeatherBox {...prediction} mode="detail" />
      </li>
    ))}
  </ul>
);
