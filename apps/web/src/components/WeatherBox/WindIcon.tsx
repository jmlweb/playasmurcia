import { LuArrowUp } from 'react-icons/lu';

import { icon, IconProps } from './icon';

type Props = {
  mode: IconProps['mode'];
  windDirection: number;
};

export const WindIcon = ({ mode, windDirection }: Props) => {
  const className = icon({
    type: 'wind',
    mode,
  });
  return (
    <LuArrowUp
      className={className}
      style={{ transform: `rotate(${windDirection}deg)` }}
    />
  );
};
