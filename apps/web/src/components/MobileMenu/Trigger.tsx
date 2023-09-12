import { LuGrip } from 'react-icons/lu';

type Props = {
  disabled?: boolean;
}

export const Trigger = ({
  disabled,
}: Props) => (
  <button className="flex items-center gap-1 py-3 text-sm" disabled={disabled}>
    Menú
    <LuGrip className="text-lg" />
  </button>
 );