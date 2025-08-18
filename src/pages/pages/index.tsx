import { useCallback } from 'react';
import { bool, date, entity, text } from '@/modules/enitity-editor/primitives';
import {
  EntityWidget,
  type EntityWidgetDataProvider,
  type EntityWidgetSchemaFn,
} from '@/modules/enitity-editor/components/entity-widget';
import { toDateTimeLocal } from '@/helpers/to-date-timeLocal.ts';
import {
  type FilterParams,
  pagesFakeApi,
  type SortParams,
} from '@/modules/fake-api/pages.ts';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'active', label: 'Active', sortable: true },
  { key: 'updatedAt', label: 'Updated At', sortable: true },
  { key: 'publishedAt', label: 'Published At' },
];

const PagesPage = () => {
  const pagesSchema = useCallback<EntityWidgetSchemaFn>((row) => {
    const disabled = !row.active;
    return entity({
      id: text({ label: 'ID', readonly: disabled, filterable: true }),
      title: text({
        label: 'title',
        readonly: disabled,
        filterable: true,
      }),
      updatedAt: date({
        label: 'Updated At',
        readonly: disabled,
        filterable: true,
      }),
      publishedAt: date({
        label: 'Published At',
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
      if (filters.publishedAt) {
        queryFilters.publishedAt = {
          from: filters.publishedAt[0],
          to: filters.publishedAt[1],
        };
      }
      if (filters.updatedAt) {
        queryFilters.updatedAt = {
          from: filters.updatedAt[0],
          to: filters.updatedAt[1],
        };
      }
      if (filters.active) {
        queryFilters.active = filters.active;
      }
      if (filters.id) {
        queryFilters.id = Number(filters.id);
      }
      if (filters.title) {
        queryFilters.title = filters.title;
      }
      return pagesFakeApi.query({
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
      onSaveEntity={(v) => pagesFakeApi.edit(v.id, v)}
      schema={pagesSchema}
      renderCell={(key, row) => {
        if (key === 'updatedAt' || key === 'publishedAt') {
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

export default PagesPage;
