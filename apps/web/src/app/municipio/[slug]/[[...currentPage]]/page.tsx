import { Metadata, ResolvingMetadata } from 'next';

import { Container } from '@/components/Container';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsSectionHeader } from '@/components/ItemsSectionHeader';
import { Pagination } from '@/components/Pagination';
import { IMAGES } from '@/config/images';
import { PATHS } from '@/config/paths';
import { dataService, getMunicipalityName } from '@/data';
import { pluralizeBeach } from '@/utils';

export function generateStaticParams() {
  const municipalities = dataService.municipalities();

  return municipalities.map((municipality) => ({
    slug: municipality.slug,
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
    Number(currentPage),
    (beach) => beach.municipality === slug,
  );
  const previousImages = (await parent).openGraph?.images || [];
  const selectedBeach = data.beaches.find((beach) => beach.picture);
  const selectedImage = selectedBeach
    ? `${IMAGES.ogPath}${selectedBeach.picture}`
    : 'https://playasmurcia.com/og-image.jpg';

  return {
    title: `Playas en ${getMunicipalityName(slug)}${
      Number(currentPage) > 1 ? ` - Página ${currentPage}` : ''
    }`,
    description: `${data.total} ${pluralizeBeach(
      data.total,
    )} ${getMunicipalityName(slug)} - Tus playas en la Región de Murcia`,
    openGraph: {
      images: [selectedImage, ...previousImages],
    },
  };
};

const Municipality = async ({
  params: { slug, currentPage = '1' },
}: {
  params: { slug: string; currentPage?: string };
}) => {
  const data = await dataService.findBeaches(
    Number(currentPage),
    (beach) => beach.municipality === slug,
  );

  return (
    <Container fixed>
      <ItemsSectionHeader
        total={data.total}
        suffix={`en ${getMunicipalityName(slug)}`}
        currentPage={Number(currentPage)}
      />
      <ItemsGrid beaches={data.beaches} />
      <Pagination
        basePath={`/${PATHS.municipality}/${slug}`}
        currentPage={Number(currentPage)}
        totalPages={data.pages}
      />
    </Container>
  );
};

export default Municipality;
