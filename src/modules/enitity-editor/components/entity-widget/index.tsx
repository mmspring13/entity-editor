import {
  EntityEdit,
  type EntityEditProps,
} from '@/modules/enitity-editor/components/edit-entity';
import {
  type Column,
  Table,
} from '@/modules/enitity-editor/components/table-entity';
import { TableRow } from './../table-entity/table-entity-row';
import { TableCell } from './../table-entity/table-entity-cell';
import { EntityFilters } from './entity-filters';
import { SortableHeader } from './sortable-header';
import { type ReactNode, useCallback, useState, useMemo } from 'react';

// eslint-disable-next-line
type RowValues = Record<string, any>;

export type EntityWidgetSchemaFn = (
  values: RowValues,
) => EntityEditProps['schema'];

export type EntityWidgetProps<T extends Column> = {
  schema: EntityEditProps['schema'] | EntityWidgetSchemaFn;
  tableColumns: Array<T & { sortable?: boolean }>;
  keyProp: string;
  tableData: Array<RowValues>;
  onSaveEntity(values: RowValues): void;
  // onFilter(values: Record<string, any>): void;
  renderCell(key: T['key'], row: RowValues): ReactNode;
};

// eslint-disable-next-line
export const EntityWidget = <T extends Column>({
  schema,
  tableData,
  tableColumns,
  keyProp,
  onSaveEntity,
  // onFilter,
  renderCell,
}: EntityWidgetProps<T>) => {
  const [selectedEntity, setSelectedEntity] = useState<RowValues | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleFilter = useCallback((values: Record<string, any>) => {
    setFilters(values);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        } else {
          return null; // Remove sorting
        }
      } else {
        return { key, direction: 'asc' };
      }
    });
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let result = tableData;

    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = result.filter((row) => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === '' || value === undefined || value === false) return true;

          const rowValue = row[key];
          if (typeof value === 'string') {
            return rowValue
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase());
          }
          if (typeof value === 'number') {
            return rowValue === value;
          }
          if (typeof value === 'boolean') {
            return rowValue === value;
          }
          if (Array.isArray(value)) {
            return value.length === 0 || value.includes(rowValue);
          }
          return true;
        });
      });
    }

    // Apply sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue;
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
        
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          const comparison = Number(aValue) - Number(bValue);
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
        
        // Handle mixed types or other cases
        const aStr = String(aValue ?? '');
        const bStr = String(bValue ?? '');
        const comparison = aStr.localeCompare(bStr);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [tableData, filters, sortConfig]);

  // eslint-disable-next-line
  const onEditEntity = useCallback((values: RowValues) => {
    setSelectedEntity(values);
  }, []);

  const onSubmitEditEntity = useCallback(
    (values: RowValues) => {
      onSaveEntity(values);
      setSelectedEntity(null);
    },
    [onSaveEntity],
  );

  return (
    <>
      {typeof schema === 'function' ? (
        <EntityFilters
          schema={schema(tableData[0] || {})}
          onFilter={handleFilter}
        />
      ) : (
        <EntityFilters schema={schema} onFilter={handleFilter} />
      )}

      <Table 
        data={filteredAndSortedData} 
        columns={tableColumns} 
        keyProp={keyProp}
        renderHeader={(column) => (
          <SortableHeader
            column={column}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      >
        {(row) => (
          <TableRow
            key={row[keyProp]}
            row={row}
            columns={tableColumns}
            onEdit={onEditEntity}
          >
            {(col) => <TableCell>{renderCell(col.key, row)}</TableCell>}
          </TableRow>
        )}
      </Table>

      {selectedEntity && (
        <EntityEdit
          schema={
            typeof schema === 'function' ? schema(selectedEntity) : schema
          }
          initialValues={selectedEntity}
          onSubmit={onSubmitEditEntity}
          open={true}
          onOpenChange={() => setSelectedEntity(null)}
        />
      )}
    </>
  );
};
