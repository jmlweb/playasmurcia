import { cva } from 'class-variance-authority';
import { Children, cloneElement, ReactElement, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const containerStyle = cva('px-4 md:px-6 xl:px-8', {
  variants: {
    fixed: {
      true: 'mx-auto max-w-8xl',
    },
  },
});

type Props<AC extends boolean> = {
  asChild?: AC;
  fixed?: boolean;
  children: AC extends true ? ReactElement : ReactNode;
  className?: AC extends true ? never : string;
};

export const Container = <AC extends boolean = false>({
  asChild,
  className,
  fixed,
  children,
}: Props<AC>) => {
  const parentClassName = containerStyle({ fixed });

  const safeChildren = asChild ? (
    (Children.only(children) as ReactElement)
  ) : (
    <div className={className}>{children}</div>
  );

  return cloneElement(safeChildren, {
    ...safeChildren.props,
    className: twMerge(safeChildren.props.className, parentClassName),
  });
};
