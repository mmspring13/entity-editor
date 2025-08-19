import { useCallback } from 'react';
import { bool, date, entity, text } from '@/modules/enitity-editor/primitives';
import {
  EntityWidget,
  type EntityWidgetDataProvider,
  type EntityWidgetSchemaFn,
} from '@/modules/enitity-editor/components/entity-widget';
import { toDateTimeLocal } from '@/helpers/to-date-timeLocal.ts';
import {
  pricePlansFakeApi,
  type FilterParams,
  type SortParams,
} from '@/modules/fake-api/price-plans.ts';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'description', label: 'Description' },
  { key: 'active', label: 'Active', sortable: true },
  { key: 'createdAt', label: 'Created At', sortable: true },
  { key: 'removedAt', label: 'Removed At' },
];

const PricePlansPage = () => {
  const pricePlanSchema = useCallback<EntityWidgetSchemaFn>((row) => {
    const disabled = !row.active;
    return entity({
      id: text({ label: 'ID', readonly: true, filterable: true }),
      description: text({
        label: 'Description',
        type: 'textarea',
        readonly: disabled,
        filterable: true,
      }),
      createdAt: date({
        label: 'Created At',
        readonly: disabled,
        filterable: true,
      }),
      removedAt: date({
        label: 'Removed At',
        readonly: disabled,
        filterable: true,
      }),
      active: bool({ label: 'Active', readonly: disabled, filterable: true }),
    });
  }, []);

  const dataProvider = useCallback<EntityWidgetDataProvider>(
    (filters, sort) => {
      const queryFilters: FilterParams = {};
      let querySort: SortParams | null = null;
      if (sort) {
        querySort = {
          field: sort.key,
          direction: sort.direction,
        };
      }
      if (filters.createdAt) {
        queryFilters.createdAt = {
          from: filters.createdAt[0],
          to: filters.createdAt[1],
        };
      }
      if (filters.removedAt) {
        queryFilters.removedAt = {
          from: filters.removedAt[0],
          to: filters.removedAt[1],
        };
      }
      if (filters.active) {
        queryFilters.active = filters.active;
      }
      if (filters.description) {
        queryFilters.description = filters.description;
      }
      if (filters.id) {
        queryFilters.id = Number(filters.id);
      }
      return pricePlansFakeApi.query({
        filters: queryFilters,
        sort: querySort || undefined,
      });
    },
    [],
  );

  return (
    <EntityWidget
      dataProvider={dataProvider}
      tableColumns={columns}
      keyProp="id"
      onSaveEntity={(v) => pricePlansFakeApi.edit(v.id, v)}
      schema={pricePlanSchema}
      renderCell={(key, row) => {
        if (key === 'createdAt' || key === 'removedAt') {
          return toDateTimeLocal(row[key]);
        }
        if (key === 'active') {
          return row[key] ? 'Yes' : 'No';
        }
        return row[key];
      }}
    />
  );
};

export default PricePlansPage;
