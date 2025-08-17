import React, {
  memo,
  useMemo,
  type ReactNode,
  useState,
  useRef,
  useCallback,
} from 'react';

// Column definition type
interface Column {
  key: string;
  label: string;
}

// Props for Table
interface TableProps<T> {
  data: T[];
  keyProp?: string;
  columns: Column[];
  children: (row: T) => ReactNode;
}

export const Table = memo(
  // eslint-disable-next-line
  <T extends Record<string, any>>({
    data,
    columns,
    children,
    keyProp = 'id',
  }: TableProps<T>) => {
    const header = useMemo(
      () => (
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-left border-b"
              >
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
            <React.Fragment key={row[keyProp]}>{children(row)}</React.Fragment>
          ))}
        </tbody>
      </table>
    );
  },
);

// Row props
interface TableRowProps<T> {
  row: T;
  columns: Column[];
  children: (col: Column) => ReactNode;
  onEdit?: (row: T) => void;
}

export const TableRow = memo(
  // eslint-disable-next-line
  <T extends Record<string, any>>({
    row,
    columns,
    children,
    onEdit,
  }: TableRowProps<T>) => {
    const d = useRef(null);
    console.log('REDNER ROW', d.current);

    return (
      <tr className="hover:bg-blue-950 transition-colors" ref={d}>
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
  (p, o) => {
    console.log(p, o, o.columns === p.columns, o.onEdit === p.onEdit, p.children === o.children);
    return false;
  },
);

// Cell props
interface TableCellProps {
  children: ReactNode;
}

export const TableCell = memo(({ children }: TableCellProps) => {
  // if (children[0] === 99000859) window.qe = children;
  console.log('REDNER CELLL', typeof children, children);
  return <td className="px-4 py-2 border-b">{children}</td>;
});

// --------------------
// ✅ Example Usage:
// --------------------
type DataItem = {
  id: number;
  description: string;
  active: boolean;
  createdAt: string;
  removedAt: string;
};

const columns: Array<{ key: keyof DataItem; label: string }> = [
  { key: 'id', label: 'ID' },
  { key: 'description', label: 'Description' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'removedAt', label: 'Removed At' },
];

export const Sb = ({ renderCell }) => {
  const [data, setData] = useState<DataItem[]>([
    {
      id: 99000859,
      description: 'reprehenderit exercitation Duis non',
      active: false,
      createdAt: '1977-07-05T09:58:14.0Z',
      removedAt: '1991-07-12T09:30:12.0Z',
    },
    {
      id: 74826040,
      description: 'dolor ullamco fugiat incididunt in',
      active: false,
      createdAt: '2004-12-10T22:13:28.0Z',
      removedAt: '2021-09-09T11:21:13.0Z',
    },
  ]);

  const edit = useCallback((row: any) => {
    setData((prevData) => {
      const idx = prevData.findIndex((row2) => row2.id === row.id);
      prevData[idx]['description'] = 'edited';
      return [...prevData];
    });
  }, []);

  return (
    <Table data={data} columns={columns}>
      {(row) => (
        <TableRow key={row.id} row={row} columns={columns} onEdit={edit}>
          {(col) => (
            <TableCell>
              {renderCell(col.key, row)}
              {/*{row[col.key]}*/}
              {/*<button type="button" onClick={() => edit(row.id, col.key)}>*/}
              {/*  edit*/}
              {/*</button>*/}
            </TableCell>
          )}
        </TableRow>
      )}
    </Table>
  );
};
