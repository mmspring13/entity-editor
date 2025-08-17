import React, { useMemo, type ReactNode } from 'react';

export type Column = {
  key: string;
  label: string;
};

export type TableProps<T> = {
  data: T[];
  keyProp: keyof T;
  columns: Array<Column>;
  children: (row: T) => ReactNode;
  renderHeader?: (column: Column) => ReactNode;
};

export const Table = <T,>({
  data,
  columns,
  children,
  keyProp,
  renderHeader,
}: TableProps<T>) => {
  const header = useMemo(
    () => (
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="px-4 py-2 text-left border-b">
              {renderHeader ? renderHeader(col) : col.label}
            </th>
          ))}
          <th className="px-4 py-2 text-left border-b">Edit</th>
        </tr>
      </thead>
    ),
    [columns, renderHeader],
  );

  return (
    <table className="min-w-full border-collapse border rounded-lg">
      {header}
      <tbody>
        {data.map((row) => (
          <React.Fragment key={row[keyProp] as string | number}>
            {children(row)}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};
