import { Metadata, ResolvingMetadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import probe from 'probe-image-size';
import { LuExternalLink } from 'react-icons/lu';

import { Container } from '@/components/Container';
import { IMAGES } from '@/config/images';
import { dataService, getMunicipalityName } from '@/data';

import Features from './features';

const LoadingMap = () => (
  <div className="animate-wiggle text-sky-700 animate-infinite">
    Cargando mapa...
  </div>
);

const BeachMap = dynamic(() => import('./beach-map'), {
  ssr: false,
  loading: LoadingMap,
});

const Modal = dynamic(() => import('./modal'), {
  ssr: false,
});

export const generateMetadata = async (
  {
    params: { slug },
  }: {
    params: { slug: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const data = await dataService.detail(slug);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${data.name} (${getMunicipalityName(data.municipality)}) - Mar ${
      data.sea === 0 ? 'Mediterráneo' : 'Menor'
    }`,
    description: `${data.name} - Tus playas en la Región de Murcia`,
    openGraph: {
      images:
        data.pictures.length > 0
          ? [`${IMAGES.ogPath}${data.pictures[0]}`, ...previousImages]
          : [IMAGES.ogDefault, ...previousImages],
    },
  };
};

const Detail = async ({ params: { slug } }: { params: { slug: string } }) => {
  const data = await dataService.detail(slug);
  const enhancedPictures = await Promise.all(
    data.pictures.map(async (picture) => {
      const { width, height } = await (probe(
        `${IMAGES.detail}${picture}`,
      ) as Promise<{ width: number; height: number }>);

      return {
        src: picture,
        width,
        height,
      };
    }),
  );
  const sizes = enhancedPictures.reduce(
    (acc, curr) => {
      acc[curr.src] = {
        width: curr.width,
        height: curr.height,
      };
      return acc;
    },
    {} as Record<string, { width: number; height: number }>,
  );

  return (
    <>
      <Container fixed>
        <header className="pb-4 pt-8 md:pb-6 md:pt-12">
          <h1 className="text-xl font-bold text-gray-600 [text-wrap:balance] md:text-2xl lg:text-3xl">
            {data.name}
          </h1>
          <h2 className="text-lg font-bold text-gray-400 md:text-xl lg:text-2xl">
            {getMunicipalityName(data.municipality)}, Mar{' '}
            {data.sea === 0 ? 'Mediterráneo' : 'Menor'}
          </h2>
          {data.address && (
            <p className="mt-2 text-gray-700">
              <span className="font-semibold mr-1">Dirección:</span>
              {data.address}
            </p>
          )}
          <p className="text-gray-700 flex flex-wrap items-center mt-2">
            <span className="font-semibold mr-1">Coordenadas:</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${data.position.join(
                ',',
              )}`}
              target="_blank"
              rel="external noopener noreferrer"
              className="inline-flex items-center motion-safe:hover:text-sky-600 transition-colors"
            >
              {data.position.join(', ')}{' '}
              <LuExternalLink className="ml-0.5 -mt-0.5" />
            </a>
          </p>
        </header>
        <Features features={data.features} />
      </Container>
      <div className="relative mx-4 grid h-[min(360px,60vh)] place-items-center bg-sky-200 md:mx-6 lg:mx-0 lg:h-[min(600px,400px+10vw)]">
        <BeachMap name={data.name} position={data.position} />
      </div>
      {data.pictures.length > 0 && (
        <>
          <Container fixed className="mt-10">
            <h3 className="mb-2 text-xl font-bold text-gray-700">
              Fotografías
            </h3>
            <div
              id="detail-thumbnails"
              className="grid gap-x-4 gap-y-6 overflow-auto pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-6 xl:gap-y-8 2xl:grid-cols-4"
            >
              {data.pictures.map((picture) => (
                <Link
                  key={picture}
                  href={`/playa/${slug}?picture=${picture}`}
                  shallow
                  className="block w-full h-auto cursor-zoom-in"
                  scroll={false}
                >
                  <Image
                    src={`${IMAGES.list}${picture}`}
                    width={416}
                    height={234}
                    alt=""
                    className="transition-transform duration-700 motion-safe:group-hover:scale-105 bg-gray-200"
                  />
                </Link>
              ))}
            </div>
          </Container>
          <Modal sizes={sizes} />
        </>
      )}
    </>
  );
};

export default Detail;
