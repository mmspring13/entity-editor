import React, { memo, type ReactNode, useRef } from 'react';
import type { Column } from './index';

export type TableRowProps<T> = {
  row: T;
  columns: Array<Column>;
  children: (col: Column) => ReactNode;
  onEdit?: (row: T) => void;
};

// eslint-disable-next-line
export const TableRow = memo(function TableRow<T extends Record<string, any>>({
    row,
    columns,
    children,
    onEdit,
  }: TableRowProps<T>) {
    const d = useRef(null);
    console.log('REDNER ROW', d.current);

    return (
      <tr className="hover:bg-gray-400 transition-colors" ref={d}>
        {columns.map((col) => (
          <React.Fragment key={String(col.key)}>{children(col)}</React.Fragment>
        ))}
        <td className="px-4 py-2 text-left border-b">
          <button type="button" onClick={() => onEdit?.(row)}>
            Edit
          </button>
        </td>
      </tr>
    );
  },
  (oldProps, newProps) => {
    return JSON.stringify(oldProps.row) === JSON.stringify(newProps.row);
  },
);
