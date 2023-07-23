import { Container } from '@/components/Container2';
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
