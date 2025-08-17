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
import { type ReactNode, useCallback, useState } from 'react';

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
  renderCell(key: T['key'], row: RowValues): ReactNode;
};

// eslint-disable-next-line
export const EntityWidget = <T extends Column>({
  schema,
  tableData,
  tableColumns,
  keyProp,
  onSaveEntity,
  renderCell,
}: EntityWidgetProps<T>) => {
  const [selectedEntity, setSelectedEntity] = useState<RowValues | null>(null);

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
      <Table data={tableData} columns={tableColumns} keyProp={keyProp}>
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
