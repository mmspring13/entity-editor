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
};

export const Table = <T,>({
  data,
  columns,
  children,
  keyProp,
}: TableProps<T>) => {
  const header = useMemo(
    () => (
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="px-4 py-2 text-left border-b">
              {col.label}
            </th>
          ))}
          <th className="px-4 py-2 text-left border-b">Edit</th>
        </tr>
      </thead>
    ),
    [columns],
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

// // --------------------
// // ✅ Example Usage:
// // --------------------
// type DataItem = {
//   id: number;
//   description: string;
//   active: boolean;
//   createdAt: string;
//   removedAt: string;
// };
//
// const columns: Array<{ key: keyof DataItem; label: string }> = [
//   { key: 'id', label: 'ID' },
//   { key: 'description', label: 'Description' },
//   { key: 'createdAt', label: 'Created At' },
//   { key: 'removedAt', label: 'Removed At' },
// ];
