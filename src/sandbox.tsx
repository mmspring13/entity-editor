import { useState, useCallback } from 'react';
import { Table } from '@/modules/enitity-editor/components/table-entity';
import { TableRow } from '@/modules/enitity-editor/components/table-entity/table-entity-row';
import { TableCell } from '@/modules/enitity-editor/components/table-entity/table-entity-cell';

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
    <Table data={data} columns={columns} keyProp="id">
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
