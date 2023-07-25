import { Metadata, ResolvingMetadata } from 'next';

import { Container } from '@/components/Container';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsSectionHeader } from '@/components/ItemsSectionHeader';
import { Pagination } from '@/components/Pagination';
import { PATHS } from '@/config/paths';
import { dataService } from '@/data';

import { getTitle } from './getTitle';

export function generateStaticParams() {
  const features = dataService.features();

  return features.map((feature) => ({
    slug: feature.slug,
  }));
}

export const generateMetadata = async (
  {
    params: { slug, currentPage = '1' },
  }: {
    params: { slug: string; currentPage?: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const data = await dataService.findBeaches(
    slug === 'bandera-azul'
      ? (beach) => beach.blueFlag
      : (beach) => beach.features.includes(slug),
    Number(currentPage),
  );
  const previousImages = (await parent).openGraph?.images || [];
  const selectedBeach = data.beaches.find((beach) => beach.pictures.length > 0);
  const selectedImage = selectedBeach
    ? `https://res.cloudinary.com/jmlweb/image/upload/e_improve/f_auto,fl_progressive,c_limit,w_1024/v1688825552/playasmurcia/${selectedBeach.pictures[0]}`
    : 'https://playasmurcia.com/og-image.jpg';

  return {
    title: `Playas ${getTitle(slug)}${
      Number(currentPage) > 1 ? ` - Página ${currentPage}` : ''
    }`,
    description: `${data.total} playa${data.total > 0 ? 's' : ''} ${getTitle(
      slug,
    )} - Tus playas en la Región de Murcia`,
    openGraph: {
      images: [selectedImage, ...previousImages],
    },
  };
};

const Feature = async ({
  params: { slug, currentPage = '1' },
}: {
  params: { slug: string; currentPage?: string };
}) => {
  const data = await dataService.findBeaches(
    slug === 'bandera-azul'
      ? (beach) => beach.blueFlag
      : (beach) => beach.features.includes(slug),
    Number(currentPage),
  );

  return (
    <Container fixed>
      <ItemsSectionHeader
        total={data.total}
        suffix={getTitle(slug)}
        currentPage={Number(currentPage)}
      />
      <ItemsGrid beaches={data.beaches} />
      <Pagination
        basePath={`/${PATHS.feature}/${slug}`}
        currentPage={Number(currentPage)}
        totalPages={data.pages}
      />
    </Container>
  );
};

export default Feature;
