import { Container } from '@/components/Container2';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsSectionHeader } from '@/components/ItemsSectionHeader';
import { Pagination } from '@/components/Pagination';
import { PATHS } from '@/config/paths';
import { dataService, getMunicipalityName } from '@/data';

export function generateStaticParams() {
  const municipalities = dataService.municipalities();

  return municipalities.map((municipality) => ({
    slug: municipality.slug,
  }));
}

const Municipality = async ({
  params: { slug, currentPage = '1' },
}: {
  params: { slug: string; currentPage?: string };
}) => {
  const [municipality, data] = await Promise.all([
    getMunicipalityName(slug),
    dataService.findBeaches(
      (beach) => beach.municipality === slug,
      Number(currentPage),
    ),
  ]);

  return (
    <Container fixed>
      <ItemsSectionHeader
        total={data.total}
        suffix={`en ${municipality}`}
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
