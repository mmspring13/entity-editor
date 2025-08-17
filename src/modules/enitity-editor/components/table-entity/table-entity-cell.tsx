import { memo, type PropsWithChildren } from 'react';

export const TableCell = memo(function TableCell({
  children,
}: PropsWithChildren) {
  return <td className="px-4 py-2 border-b">{children}</td>;
});
