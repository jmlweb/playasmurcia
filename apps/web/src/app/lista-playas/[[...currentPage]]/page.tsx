import { Metadata, ResolvingMetadata } from 'next';

import { Container } from '@/components/Container';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsSectionHeader } from '@/components/ItemsSectionHeader';
import { Pagination } from '@/components/Pagination';
import { IMAGES } from '@/config/images';
import { PATHS } from '@/config/paths';
import { dataService } from '@/data';
import { pluralizeBeach } from '@/utils';

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
  const data = await dataService.findBeaches(Number(currentPage));
  const previousImages = (await parent).openGraph?.images || [];
  const selectedBeach = data.beaches.find((beach) => beach.picture);
  const selectedImage = selectedBeach
    ? `${IMAGES.ogPath}${selectedBeach.picture}`
    : IMAGES.ogDefault;

  return {
    title: `Playas de la Región de Murcia${
      Number(currentPage) > 1 ? ` - Página ${currentPage}` : ''
    }`,
    description: `${data.total} ${pluralizeBeach(
      data.total,
    )} - Tus playas en la Región de Murcia`,
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
  const data = await dataService.findBeaches(Number(currentPage));

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
