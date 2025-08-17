import { useCallback, useMemo, useState } from 'react';
import {
  bool,
  entity,
  select,
  text,
} from '@/modules/enitity-editor/primitives';
import {
  EntityWidget,
  type EntityWidgetSchemaFn,
} from '@/modules/enitity-editor/components/entity-widget';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'description', label: 'Description' },
  { key: 'active', label: 'Active' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'removedAt', label: 'Removed At' },
];

type PricePlan = {
  id: number;
  description: string;
  createdAt: string;
  active: boolean;
  removedAt: string;
};

const pricePlans: PricePlan[] = [
  {
    id: 13334466,
    description: 'aute fugiat commodo id',
    active: false,
    createdAt: '1949-06-21T14:03:32.0Z',
    removedAt: '1960-09-22T13:43:32.0Z',
  },
  {
    id: 38738895,
    description: 'esse dolore cillum anim',
    active: false,
    createdAt: '2014-09-09T02:06:07.0Z',
    removedAt: '2006-06-14T18:43:22.0Z',
  },
  {
    id: 69423742,
    description: 'ullamco quis aliquip laborum',
    active: false,
    createdAt: '1982-10-18T01:51:07.0Z',
    removedAt: '1978-03-15T11:19:21.0Z',
  },
  {
    id: 78413703,
    description: 'nulla elit anim mollit occaecat',
    active: false,
    createdAt: '1959-07-30T18:57:54.0Z',
    removedAt: '1980-01-31T01:46:32.0Z',
  },
  {
    id: 51092826,
    description: 'pariatur elit voluptate',
    active: false,
    createdAt: '1976-09-08T02:38:21.0Z',
    removedAt: '1995-06-28T23:17:24.0Z',
  },
  {
    id: 92933022,
    description: 'ad cillum proident',
    active: true,
    createdAt: '1975-02-06T15:44:29.0Z',
    removedAt: '1970-05-24T23:08:27.0Z',
  },
  {
    id: 54507439,
    description: 'nisi eiusmod',
    active: true,
    createdAt: '1960-07-01T06:17:05.0Z',
    removedAt: '1993-01-08T23:40:57.0Z',
  },
  {
    id: 39230580,
    description: 'do in elit sit dolor',
    active: true,
    createdAt: '1984-10-02T14:32:01.0Z',
    removedAt: '1985-09-30T09:48:12.0Z',
  },
  {
    id: 99000859,
    description: 'reprehenderit exercitation Duis non',
    active: false,
    createdAt: '1977-07-05T09:58:14.0Z',
    removedAt: '1991-07-12T09:30:12.0Z',
  },
  {
    id: 74826040,
    description: 'dolor ullamco fugiat incididunt in',
    active: false,
    createdAt: '2004-12-10T22:13:28.0Z',
    removedAt: '2021-09-09T11:21:13.0Z',
  },
];

const HomePage = () => {
  const [data, setData] = useState<PricePlan[]>(pricePlans);

  const pricePlanSchema = useCallback<EntityWidgetSchemaFn>((row) => {
    const disabled = !row.active;
    return entity({
      id: text({ label: 'ID', readonly: disabled }),
      description: text({
        label: 'Description',
        type: 'textarea',
        readonly: disabled,
      }),
      active: bool({ label: 'Active', readonly: disabled }),
      option: select({
        label: 'Option',
        type: 'select',
        readonly: disabled,
        options: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
        ],
      }),
      createdAt: text({
        label: 'Created At',
        type: 'date',
        readonly: disabled,
      }),
      removedAt: text({
        label: 'Removed At',
        type: 'date',
        readonly: disabled,
      }),
    });
  }, []);

  const save = useCallback((values: PricePlan) => {
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
      schema={pricePlanSchema}
      renderCell={(key, row) => {
        if (key === 'createdAt' || key === 'removedAt') {
          return new Date(row[key]).toISOString();
        }
        if (key === 'active') {
          return row[key] ? 'Yes' : 'No';
        }
        return row[key];
      }}
    />
  );
};

export default HomePage;
