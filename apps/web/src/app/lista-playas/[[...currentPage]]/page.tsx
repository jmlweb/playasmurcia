import { Metadata, ResolvingMetadata } from 'next';

import { Container } from '@/components/Container';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsSectionHeader } from '@/components/ItemsSectionHeader';
import { Pagination } from '@/components/Pagination';
import { PATHS } from '@/config/paths';
import { dataService } from '@/data';

export function generateStaticParams() {
  return [{}];
}

export const generateMetadata = async (
  {
    params: { currentPage = '1' },
  }: {
    params: { currentPage?: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const data = await dataService.findBeaches(() => true, Number(currentPage));
  const previousImages = (await parent).openGraph?.images || [];
  const selectedBeach = data.beaches.find((beach) => beach.pictures.length > 0);
  const selectedImage = selectedBeach
    ? `https://res.cloudinary.com/jmlweb/image/upload/e_improve/f_auto,fl_progressive,c_limit,w_1024/v1688825552/playasmurcia/${selectedBeach.pictures[0]}`
    : 'https://playasmurcia.com/og-image.jpg';

  return {
    title: `Playas de la Región de Murcia${
      Number(currentPage) > 1 ? ` - Página ${currentPage}` : ''
    }`,
    description: `${data.total} playa${
      data.total > 0 ? 's' : ''
    } - Tus playas en la Región de Murcia`,
    openGraph: {
      images: [selectedImage, ...previousImages],
    },
  };
};

const All = async ({
  params: { currentPage = '1' },
}: {
  params: { currentPage?: string };
}) => {
  const data = await dataService.findBeaches(() => true, Number(currentPage));

  return (
    <Container fixed>
      <ItemsSectionHeader
        total={data.total}
        suffix="en la Región de Murcia"
        currentPage={Number(currentPage)}
      />
      <ItemsGrid beaches={data.beaches} />
      <Pagination
        basePath={`/${PATHS.all}`}
        currentPage={Number(currentPage)}
        totalPages={data.pages}
      />
    </Container>
  );
};

export default All;
