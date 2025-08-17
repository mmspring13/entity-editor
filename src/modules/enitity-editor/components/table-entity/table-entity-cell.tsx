import { memo, type PropsWithChildren } from 'react';

export const TableCell = memo(function TableCell({
  children,
}: PropsWithChildren) {
  // if (children[0] === 99000859) window.qe = children;
  console.log('REDNER CELLL', typeof children, children);
  return <td className="px-4 py-2 border-b">{children}</td>;
});
