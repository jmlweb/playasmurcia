import Link from 'next/link';

type Props = {
  title: string;
  path: string;
  items: ReadonlyArray<{
    name: string;
    slug: string;
    count: number;
  }>;
};

export const ItemsBlock = ({ title, path, items }: Props) => (
  <>
    <dt className="mb-1 mt-4 font-semibold text-gray-500">{title}</dt>
    {items.map(({ name, slug, count }) => (
      <dd key={slug}>
        <Link
          href={`/${path}/${slug}`}
          className="mb-0.5 block font-medium text-sky-700"
        >
          {name} <span className="text-sm text-gray-500">({count} playas)</span>
        </Link>
      </dd>
    ))}
  </>
);
