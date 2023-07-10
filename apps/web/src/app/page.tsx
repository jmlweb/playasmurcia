import Image from 'next/image';

import { Container } from '@/components/container';
import { dataService } from '@/data';

import blueFlagSrc from './bandera-azul.png';

const Page = async () => {
  const featuredBeaches = await dataService.featuredBeaches();
  return (
    <Container fixed className="bg-white/75 pb-10 shadow-lg">
      <header className="animate-fade-up py-[min(calc(5vh+5vw),100px)] text-center">
        <h1 className="text-[clamp(20px,calc(4vw+4px),36px)] font-bold tracking-tight text-gray-800">
          Encuentra tu playa en la Región de Murcia
        </h1>
        <h2 className="text-[clamp(16px,calc(3vw+2px),24px)] font-semibold text-gray-700">
          Sumérgete en el paraíso del sol y el mar: Descubre tu oasis en las
          playas de la Costa Cálida.
        </h2>
      </header>
      <section>
        <h3 className="mb-4 text-[clamp(16px,calc(3vw+2px),24px)] font-medium text-gray-600">
          Playas destacadas
        </h3>
        <div className="flex snap-x items-start gap-x-4 gap-y-6 overflow-auto pb-4 md:grid md:grid-cols-[repeat(auto-fit,minmax(clamp(320px,calc(180px+9vw),466px),1fr))] xl:gap-x-6 xl:gap-y-8">
          {featuredBeaches.map((beach) => (
            <article
              key={beach.slug}
              className="relative flex min-w-[min(85vw,416px)] snap-center flex-col-reverse md:min-w-full"
            >
              <div className="mt-2 leading-5">
                <h4
                  id={`beach-title-${beach.slug}`}
                  className="font-medium text-gray-900"
                >
                  {beach.name}
                </h4>
                <p className="text-sm text-gray-500">Águilas</p>
              </div>
              <div className="relative overflow-hidden rounded peer-hover:invisible">
                <Image
                  src={`https://res.cloudinary.com/jmlweb/image/upload/e_improve/c_fill,h_468,w_832,f_auto,fl_progressive/v1688825552/playasmurcia/${beach.pictures[0]}`}
                  width={416}
                  height={234}
                  alt=""
                  className="block h-auto w-full"
                  priority
                />
                {beach.blueFlag && (
                  <Image
                    src={blueFlagSrc}
                    alt="Bandera azul"
                    title="Bandera azul"
                    width={32}
                    height={32}
                    className="absolute left-4 top-4 z-10"
                    quality={100}
                    placeholder="blur"
                  />
                )}
                {beach.features.length > 0 && (
                  <aside className="absolute bottom-4 right-4 flex gap-2">
                    {beach.features.map((feature) => (
                      <span
                        className="rounded bg-white/95 px-2 py-1 text-xs text-gray-800"
                        key={feature}
                      >
                        {feature}
                      </span>
                    ))}
                  </aside>
                )}
              </div>
              <a
                href={`/playa/${beach.slug}`}
                className="peer absolute inset-0"
                aria-describedby={`beach-title-${beach.slug}`}
              ></a>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default Page;
