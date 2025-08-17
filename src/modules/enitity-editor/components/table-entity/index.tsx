import React, { memo, useCallback, useMemo } from 'react';
import { TableEntityRow } from './TableEntityRow.js';

export interface TableColumn {
  key: string;
  label?: string;
  getValueToString?: (item: any) => string;
}

export interface TableEntityProps<T> {
  data: T[];
  columns: TableColumn[];
  // onEdit?: (id: string | number) => void;
  children?: (item: T) => React.ReactNode;
}

export const TableEntity = memo(
  <T extends Record<string, any>>({
    data,
    columns,
    // onEdit,
    children,
  }: TableEntityProps<T>) => {
    // const handleEdit = useCallback(
    //   (id: string | number) => {
    //     onEdit?.(id);
    //   },
    //   [onEdit],
    // );

    const memoizedData = useMemo(() => data, [data]);

    // Generate dynamic grid template columns based on schema
    const responsiveGridCols = useMemo(() => {
      const baseCols = columns.map(() => '1fr').join(' ');
      return {
        default: `grid-cols-[${baseCols}_100px]`,
        md: `md:grid-cols-[${baseCols}_100px]`,
        sm: `sm:grid-cols-[${baseCols}_80px]`,
      };
    }, [columns]);

    return (
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="bg-gray-50 border-b border-gray-200">
          <div
            className={`grid ${responsiveGridCols.default} ${responsiveGridCols.md} ${responsiveGridCols.sm} gap-4 md:gap-4 sm:gap-2 px-4 md:px-4 sm:px-2 py-4 md:py-4 sm:py-3 font-semibold text-gray-600 text-sm md:text-sm sm:text-xs`}
          >
            {columns.map((column) => (
              <div key={column.key} className="py-2">
                {column.label || column.key}
              </div>
            ))}
            <div className="py-2">Actions</div>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {memoizedData.map(
            (item) =>
              // <TableEntityRow
              //   key={item.id}
              //   item={item}
              //   columns={columns}
              //   onEdit={handleEdit}
              // >
              children?.(item),
            // </TableEntityRow>
          )}
        </div>
      </div>
    );
  },
);

TableEntity.displayName = 'TableEntity';

export { TableEntityRow };
export { TableEntityDemo } from './TableEntityDemo.js';
