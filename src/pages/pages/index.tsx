import { useCallback, useState } from 'react';
import { bool, date, entity, text } from '@/modules/enitity-editor/primitives';
import {
  EntityWidget,
  type EntityWidgetSchemaFn,
} from '@/modules/enitity-editor/components/entity-widget';
import { toDateTimeLocal } from '@/helpers/to-date-timeLocal.ts';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'active', label: 'Active', sortable: true },
  { key: 'updatedAt', label: 'Updated At', sortable: true },
  { key: 'publishedAt', label: 'Published At' },
];

type Page = {
  id: number;
  title: string;
  updatedAt: string;
  active: boolean;
  publishedAt: string;
};

const pages: Page[] = [
  {
    id: 23634610,
    title: 'aliquip sit proident veniam tempor',
    active: false,
    updatedAt: '1948-04-09T10:15:44.0Z',
    publishedAt: '1956-09-25T20:13:19.0Z',
  },
  {
    id: 67303872,
    title: 'dolor pariatur et ipsum fugiat',
    active: false,
    updatedAt: '2021-10-23T04:51:35.0Z',
    publishedAt: '1987-02-20T02:45:15.0Z',
  },
  {
    id: 49117143,
    title: 'amet ut cillum tempor',
    active: false,
    updatedAt: '2007-04-09T13:18:03.0Z',
    publishedAt: '1955-07-01T17:29:49.0Z',
  },
  {
    id: 57694553,
    title: 'sed sint quis',
    active: false,
    updatedAt: '1995-11-26T08:12:19.0Z',
    publishedAt: '1955-01-16T01:02:51.0Z',
  },
  {
    id: 52130295,
    title: 'consectetur officia ullamco',
    active: false,
    updatedAt: '1988-10-05T04:13:21.0Z',
    publishedAt: '1982-03-19T19:19:49.0Z',
  },
  {
    id: 87091875,
    title: 'occaecat et proident',
    active: true,
    updatedAt: '2000-05-25T16:49:30.0Z',
    publishedAt: '2018-04-18T20:33:59.0Z',
  },
  {
    id: 38008840,
    title: 'laboris',
    active: true,
    updatedAt: '1959-09-18T09:16:21.0Z',
    publishedAt: '2001-07-12T09:30:50.0Z',
  },
  {
    id: 62296414,
    title: 'esse minim laboris',
    active: false,
    updatedAt: '2021-09-09T22:06:01.0Z',
    publishedAt: '1989-10-06T07:25:18.0Z',
  },
  {
    id: 76976188,
    title: 'id cupidatat fugiat tempor',
    active: false,
    updatedAt: '1949-05-06T18:01:58.0Z',
    publishedAt: '1991-09-01T02:29:58.0Z',
  },
  {
    id: 22666349,
    title: 'minim est',
    active: true,
    updatedAt: '1985-04-15T01:04:37.0Z',
    publishedAt: '1998-12-12T14:02:25.0Z',
  },
];
const PagesPage = () => {
  const [data, setData] = useState<Page[]>(pages);

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

  const save = useCallback((values: Page) => {
    setData((prevData) => {
      const idx = prevData.findIndex((row) => row.id === values.id);
      prevData[idx] = values;
      return [...prevData];
    });
  }, []);

  return (
    <EntityWidget
      tableData={data}
      tableColumns={columns}
      keyProp="id"
      onSaveEntity={save}
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
