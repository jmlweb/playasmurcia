import { Metadata, ResolvingMetadata } from 'next';

import { Container } from '@/components/Container';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsSectionHeader } from '@/components/ItemsSectionHeader';
import { Pagination } from '@/components/Pagination';
import { IMAGES } from '@/config/images';
import { PATHS } from '@/config/paths';
import { dataService } from '@/data';
import { pluralizeBeach } from '@/utils';

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
  const data = await dataService.findBeaches(Number(currentPage), (beach) =>
    beach.features.includes(slug),
  );
  const previousImages = (await parent).openGraph?.images || [];
  const selectedBeach = data.beaches.find((beach) => beach.picture);
  const selectedImage = selectedBeach
    ? `${IMAGES.ogPath}${selectedBeach.picture}`
    : IMAGES.ogDefault;

  return {
    title: `Playas ${getTitle(slug)}${
      Number(currentPage) > 1 ? ` - Página ${currentPage}` : ''
    }`,
    description: `${data.total} ${pluralizeBeach(data.total)} ${getTitle(
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
  const data = await dataService.findBeaches(Number(currentPage), (beach) =>
    slug === 'bandera-azul' ? beach.blueFlag : beach.features.includes(slug),
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
