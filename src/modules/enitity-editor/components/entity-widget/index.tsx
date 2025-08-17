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
import { type ReactNode, useCallback, useState, useMemo } from 'react';

// eslint-disable-next-line
type RowValues = Record<string, any>;

export type EntityWidgetSchemaFn = (
  values: RowValues,
) => EntityEditProps['schema'];

export type EntityWidgetProps<T extends Column> = {
  schema: EntityEditProps['schema'] | EntityWidgetSchemaFn;
  tableColumns: Array<T>;
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

  const handleFilter = useCallback((values: Record<string, any>) => {
    setFilters(values);
  }, []);

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return tableData;

    return tableData.filter((row) => {
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
  }, [tableData, filters]);

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

      <Table data={filteredData} columns={tableColumns} keyProp={keyProp}>
        {(row) => (
          <TableRow
            key={row.id}
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
