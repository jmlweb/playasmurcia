import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { ComponentPropsWithoutRef, useMemo } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { twMerge } from 'tailwind-merge';

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

const link = cva(
  [
    'border-gray-300',
    'border',
    'font-medium',
    'grid',
    'py-1',
    'px-2',
    'place-items-center',
    'rounded',
    'tabular-nums',
    'text-gray-500',
    'transition-colors',
    'w-10',
    'h-10',
    'min-w-fit',
    'hover:bg-gray-200',
    'antialiased',
  ],
  {
    variants: {
      disabled: {
        true: ['opacity-40', 'cursor-not-allowed', 'hover:bg-transparent'],
      },
      active: {
        true: [
          'bg-sky-200',
          'border-sky-300',
          'text-sky-700',
          'hover:bg-sky-200',
        ],
      },
    },
  },
);

const PrevNextDisabled = ({ children }) => (
  <span
    className={twMerge(
      link({
        disabled: true,
      }),
    )}
  >
    {children}
  </span>
);

const PrevNextLink = (props: ComponentPropsWithoutRef<typeof Link>) => (
  <Link {...props} className={link()} />
);

export const Pagination = ({ currentPage, totalPages, basePath }: Props) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const PrevComponent = isFirstPage ? PrevNextDisabled : PrevNextLink;
  const NextComponent = isLastPage ? PrevNextDisabled : PrevNextLink;

  const pagesContent = useMemo(
    () =>
      Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          className={twMerge(
            link({
              active: currentPage === page,
            }),
          )}
          key={page}
          href={page === 1 ? basePath : `${basePath}/${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </Link>
      )),
    [basePath, currentPage, totalPages],
  );

  return totalPages > 1 ? (
    <nav className="mt-4 flex items-center justify-center gap-2 md:mt-6">
      <PrevComponent href={`${basePath}/${currentPage - 1}`}>
        <LuChevronLeft className="text-2xl" />
      </PrevComponent>
      {pagesContent}
      <NextComponent href={`${basePath}/${currentPage + 1}`}>
        <LuChevronRight className="text-2xl" />
      </NextComponent>
    </nav>
  ) : null;
};
