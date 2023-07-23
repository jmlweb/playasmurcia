import { Container } from '@/components/Container2';
import { ItemsGrid } from '@/components/ItemsGrid';
import { ItemsSectionHeader } from '@/components/ItemsSectionHeader';
import { Pagination } from '@/components/Pagination';
import { PATHS } from '@/config/paths';
import { dataService } from '@/data';

export function generateStaticParams() {
  return [{}];
}

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
