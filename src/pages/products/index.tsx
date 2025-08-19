import { useCallback } from 'react';
import {
  bool,
  date,
  entity,
  entityField,
  number,
  select,
  text,
} from '@/modules/enitity-editor/primitives';
import {
  EntityWidget,
  type EntityWidgetDataProvider,
  type EntityWidgetSchemaFn,
} from '@/modules/enitity-editor/components/entity-widget';
import { toDateTimeLocal } from '@/helpers/to-date-timeLocal.ts';
import {
  productsFakeApi,
  type FilterParams,
  type SortParams,
} from '@/modules/fake-api/products.ts';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'active', label: 'Active', sortable: true },
  { key: 'createdAt', label: 'Created At', sortable: true },
  { key: 'options', label: 'Options' },
];

const ProductsPage = () => {
  const productsScheme = useCallback<EntityWidgetSchemaFn>((row) => {
    const disabled = !row.active;
    return entity({
      id: text({ label: 'ID', readonly: true, filterable: true }),
      name: text({
        label: 'name',
        readonly: disabled,
        filterable: true,
      }),
      createdAt: date({
        label: 'Created At',
        readonly: disabled,
        filterable: true,
      }),
      active: bool({ label: 'Active', readonly: disabled, filterable: true }),
      options: entityField({
        filterable: true,
        schema: entity({
          size: select({
            filterable: true,
            type: 'select',
            label: 'Size',
            options: [
              { label: 'S', value: 'S' },
              { label: 'M', value: 'M' },
              { label: 'L', value: 'L' },
              { label: 'XL', value: 'XL' },
              { label: 'XXL', value: 'XXL' },
            ],
          }),
          amount: number({
            type: 'input',
            label: 'Amount',
            filterable: true,
            min: 0,
            max: 1000,
            step: 1,
          }),
        }),
      }),
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
      if (filters.active) {
        queryFilters.active = filters.active;
      }
      if (filters.id) {
        queryFilters.id = Number(filters.id);
      }
      if (filters.name) {
        queryFilters.name = filters.name;
      }
      if (filters.options) {
        queryFilters.options = {};
        if (filters.options.size) {
          queryFilters.options.size = filters.options.size;
        }
        if (filters.options.amount) {
          queryFilters.options.amount = filters.options.amount;
        }
      }
      return productsFakeApi.query({
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
      onSaveEntity={(v) => productsFakeApi.edit(v.id, v)}
      schema={productsScheme}
      renderCell={(key, row) => {
        if (key === 'options') {
          return (
            <div className="flex flex-col">
              <span>size: {row[key].size}</span>
              <span className="pt-1">amount: {row[key].amount}</span>
            </div>
          );
        }
        if (key === 'createdAt') {
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

export default ProductsPage;
