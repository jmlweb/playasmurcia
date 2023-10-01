import Link from 'next/link';

import { WeatherBox } from '@/components/WeatherBox';
import { getMunicipalityName } from '@/data';
import { getFeatureName } from '@/data/getFeatureName';
import { SimpleBeaches } from '@/types';

import { ItemImage } from './ItemImage';
import { Pill } from './Pill';

type Props = {
  beaches: SimpleBeaches;
};

export const ItemsGrid = ({ beaches }: Props) => (
  <div className="grid gap-x-4 gap-y-6 overflow-auto pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-6 xl:gap-y-8 2xl:grid-cols-4">
    {beaches.map((beach, index) => (
      <Link
        key={`${beach.slug}-${beach.municipality}`}
        href={`/playa/${beach.slug}`}
        className="group block"
        aria-describedby={`beach-title-${beach.slug}-${beach.municipality}`}
      >
        <article className="relative flex min-w-full flex-col-reverse">
          <header className="mt-2 leading-5 [text-wrap:balance]">
            <h4
              id={`beach-title-${beach.slug}-${beach.municipality}`}
              className="font-semibold text-gray-800 transition-colors motion-safe:group-hover:text-sky-500"
            >
              {beach.name}
            </h4>
            <p className="text-gray-500">
              {getMunicipalityName(beach.municipality)}
            </p>
          </header>
          <div className="relative overflow-hidden rounded-md shadow transition-opacity motion-safe:group-hover:opacity-90 motion-safe:group-hover:shadow-lg">
            <ItemImage src={beach.picture} priority={index <= 12} />
            <WeatherBox
              mode="list"
              temperature={beach.temperature}
              weatherCode={beach.weatherCode}
              windSpeed={beach.windSpeed}
              windDirection={beach.windDirection}
              weatherTitle={beach.weatherTitle}
            />
            {beach.features.length > 0 && (
              <ul className="absolute bottom-4 right-4 flex gap-2">
                {beach.features.map((feature) => (
                  <Pill blueFlag={feature === 'bandera-azul'} key={feature}>
                    {getFeatureName(feature)}
                  </Pill>
                ))}
              </ul>
            )}
          </div>
        </article>
      </Link>
    ))}
  </div>
);
