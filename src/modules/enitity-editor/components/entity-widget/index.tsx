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
import { isAfter, isBefore, isEqual } from 'date-fns';
import get from 'lodash/get';

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
  const [filters, setFilters] = useState<
    // eslint-disable-next-line
    Record<string, { value: any; fieldType: string }>
  >({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleFilter = useCallback(
    // eslint-disable-next-line
    (values: Record<string, { value: any; fieldType: string }>) => {
      setFilters(values);
    },
    [],
  );

  const handleSort = useCallback((key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        } else {
          return null;
        }
      } else {
        return { key, direction: 'asc' };
      }
    });
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let result = tableData;

    if (Object.keys(filters).length > 0) {
      result = result.filter((row) => {
        return Object.entries(filters).every(([key, filterData]) => {
          const { value, fieldType } = filterData;

          if (value === '' || value === undefined || value === false) {
            return true;
          }

          const rowValue = get(row, key);

          switch (fieldType) {
            case 'date':
              if (Array.isArray(value)) {
                const [from, to] = value;
                const after = from
                  ? isAfter(rowValue, from) || isEqual(rowValue, from)
                  : true;
                const before = to
                  ? isBefore(rowValue, to) || isEqual(rowValue, to)
                  : true;
                return after && before;
              }
              break;
            case 'select':
              return rowValue === value;

            // case 'multiselect':
            //   return Array.isArray(value) && value.includes(rowValue);

            case 'text':
              if (typeof value === 'string') {
                return rowValue
                  ?.toString()
                  .toLowerCase()
                  .includes(value.toLowerCase());
              }
              break;

            default:
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
          }

          return true;
        });
      });
    }

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

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

        const aStr = String(aValue ?? '');
        const bStr = String(bValue ?? '');
        const comparison = aStr.localeCompare(bStr);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [tableData, filters, sortConfig]);

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
            {(col) => (
              <TableCell key={col.key}>{renderCell(col.key, row)}</TableCell>
            )}
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
