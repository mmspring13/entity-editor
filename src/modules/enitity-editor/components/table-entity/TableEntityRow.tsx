import React, { memo, useCallback, useMemo } from 'react';

// eslint-disable-next-line
export interface TableEntityRowProps<T extends Record<string, any>> {
  item: T;
  onEdit?: (id: string | number) => void;
  children: (item: keyof T) => React.ReactNode;
}

export const TableEntityRow = memo(
  // eslint-disable-next-line
  <T extends Record<string, any>>({
    item,
    // columns,
    onEdit,
    children,
  }: TableEntityRowProps<T>) => {
    const handleEdit = useCallback(() => {
      onEdit?.(item.id);
    }, [onEdit, item.id]);

    // const formatValue = useCallback(
    //   (key: string, value: any): string => {
    //     // const schema = columns.find((col) => col.key === key);
    //
    //     if (schema?.getValueToString) {
    //       return schema.getValueToString(item);
    //     }
    //
    //     if (value === null || value === undefined) {
    //       return '-';
    //     }
    //
    //     // if (typeof value === 'boolean') {
    //     //   return value ? 'Yes' : 'No';
    //     // }
    //     //
    //     // if (typeof value === 'string') {
    //     //   // Handle date strings
    //     //   if (key === 'createdAt' || key === 'removedAt') {
    //     //     try {
    //     //       const date = new Date(value);
    //     //       return date.toLocaleDateString();
    //     //     } catch {
    //     //       return value;
    //     //     }
    //     //   }
    //     //   return value;
    //     // }
    //
    //     return String(value);
    //   },
    //   [item, columns],
    // );

    // Generate dynamic grid template columns based on schema
    const responsiveGridCols = useMemo(() => {
      const baseCols = Object.keys(item)
        .map(() => '1fr')
        .join(' ');
      return {
        default: `grid-cols-[${baseCols}_100px]`,
        md: `md:grid-cols-[${baseCols}_100px]`,
        sm: `sm:grid-cols-[${baseCols}_80px]`,
      };
    }, [item]);

    return (
      <div
        className={`grid ${responsiveGridCols.default} ${responsiveGridCols.md} ${responsiveGridCols.sm} gap-4 md:gap-4 sm:gap-2 px-4 md:px-4 sm:px-2 py-4 md:py-4 sm:py-3 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors duration-200 last:border-b-0`}
      >
        {Object.keys(item).map(children)}
        <div className="py-2 flex items-center gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs md:text-xs sm:text-xs px-3 md:px-3 sm:px-2 py-1.5 md:py-1.5 sm:py-1 rounded transition-colors duration-200"
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
      </div>
    );
  },
);

TableEntityRow.displayName = 'TableEntityRow';
