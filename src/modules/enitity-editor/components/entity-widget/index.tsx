import { type EntityEditProps } from '@/modules/enitity-editor/components/edit-entity';
import {
  type Column,
  Table,
} from '@/modules/enitity-editor/components/table-entity';
import { TableRow } from './../table-entity/table-entity-row';
import { TableCell } from './../table-entity/table-entity-cell';
import { EntityFilters } from './entity-filters';
import { SortableHeader } from './sortable-header';
import {
  type ReactNode,
  useCallback,
  useState,
  useEffect,
  lazy,
  Suspense,
} from 'react';

const EntityEdit = lazy(() => import('./../edit-entity'));

// eslint-disable-next-line
type RowValues = Record<string, any>;

export type EntityWidgetSchemaFn = (
  values: RowValues,
) => EntityEditProps['schema'];

export type EntityWidgetDataProvider = (
  // eslint-disable-next-line
  filters: Record<string, any>,
  sort: null | { key: string; direction: 'asc' | 'desc' },
) => Promise<Array<RowValues>>;

export type EntityWidgetProps<T extends Column> = {
  schema: EntityEditProps['schema'] | EntityWidgetSchemaFn;
  tableColumns: Array<T & { sortable?: boolean }>;
  keyProp: string;
  dataProvider: EntityWidgetDataProvider;
  onSaveEntity(values: RowValues): void;
  renderCell(key: T['key'], row: RowValues): ReactNode;
};

// eslint-disable-next-line
export const EntityWidget = <T extends Column>({
  schema,
  dataProvider,
  tableColumns,
  keyProp,
  onSaveEntity,
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

  const [tableData, setTableData] = useState<Array<RowValues>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const t = await dataProvider(filters, sortConfig);
      setTableData(t);
    };
    fetchData();
  }, [dataProvider, filters, sortConfig]);

  const onEditEntity = useCallback((values: RowValues) => {
    setSelectedEntity(values);
  }, []);

  const onSubmitEditEntity = useCallback(
    (values: RowValues) => {
      onSaveEntity(values);
      setTableData((prevData) => {
        const idx = prevData.findIndex((row) => row.id === values.id);
        prevData[idx] = values;
        return prevData;
      });
      setSelectedEntity(null);
    },
    [onSaveEntity],
  );

  if (!tableData) return null;

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
        data={tableData}
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
        <Suspense fallback={null}>
          <EntityEdit
            schema={
              typeof schema === 'function' ? schema(selectedEntity) : schema
            }
            initialValues={selectedEntity}
            onSubmit={onSubmitEditEntity}
            open={true}
            onOpenChange={() => setSelectedEntity(null)}
          />
        </Suspense>
      )}
    </>
  );
};
