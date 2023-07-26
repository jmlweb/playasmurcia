import Image from 'next/image';
import Link from 'next/link';

import { IMAGES } from '@/config/images';
import { getMunicipalityName } from '@/data';
import { getFeatureName } from '@/data/getFeatureName';
import { SimpleBeaches } from '@/types';

import emptyBeach from './empty-beach.jpg';
import { Pill } from './Pill';
import { WeatherBox } from './WeatherBox';

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
            {beach.picture ? (
              <Image
                src={`${IMAGES.list}${beach.picture}`}
                width={416}
                height={234}
                alt=""
                className="block h-auto w-full transition-transform duration-700 motion-safe:group-hover:scale-105 bg-gray-200"
                priority={index <= 12}
              />
            ) : (
              <div className="bg-gradient-to-r from-red-400/80 via-red-500/80 to-yellow-400/80">
                <Image
                  src={emptyBeach}
                  width={416}
                  height={234}
                  alt=""
                  className="block h-auto w-full opacity-60 blur-sm transition-transform duration-700 motion-safe:group-hover:scale-105"
                  priority={index <= 12}
                />
              </div>
            )}
            <WeatherBox
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
