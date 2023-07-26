import { LuArrowRight } from 'react-icons/lu';

import { Container } from '@/components/Container';
import { ItemsGrid } from '@/components/ItemsGrid';
import { dataService } from '@/data';

export const revalidate = 86400; // 24 hours

const Page = async () => {
  const featuredBeaches = await dataService.featuredBeaches();
  return (
    <Container fixed>
      <header className="relative animate-fade-up py-[min(calc(5vh+5vw),100px)] text-center">
        <h1 className="relative text-[clamp(20px,calc(4vw+4px),36px)] font-bold tracking-tight text-gray-700 mix-blend-darken">
          Encuentra tu playa en la Región de Murcia
        </h1>
        <h2 className="relative text-[clamp(16px,calc(3vw+2px),24px)] font-semibold text-gray-500 mix-blend-darken [text-wrap:balance]">
          Sumérgete en el paraíso del sol y el mar: <br />
          Descubre tu oasis en las playas de la Costa Cálida.
        </h2>
      </header>
      <section>
        <h3 className="mb-4 text-[clamp(16px,calc(3vw+2px),24px)] font-semibold text-gray-700">
          Playas destacadas
        </h3>
        <ItemsGrid beaches={featuredBeaches} />
        <footer className="mt-10 flex justify-center">
          <a
            className="flex items-center gap-x-1 rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors motion-safe:hover:border-sky-300 motion-safe:hover:bg-sky-100 motion-safe:hover:text-sky-700"
            href="/lista-playas"
          >
            Ver todas las playas <LuArrowRight className="text-xl" />
          </a>
        </footer>
      </section>
    </Container>
  );
};

export default Page;
