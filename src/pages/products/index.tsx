import { useCallback, useState } from 'react';
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
  type EntityWidgetSchemaFn,
} from '@/modules/enitity-editor/components/entity-widget';
import { toDateTimeLocal } from '@/helpers/to-date-timeLocal.ts';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'active', label: 'Active', sortable: true },
  { key: 'createdAt', label: 'Created At', sortable: true },
  { key: 'options', label: 'Options' },
];

type Product = {
  id: number;
  name: string;
  createdAt: string;
  active: boolean;
  options: {
    size: string;
    amount: number;
  };
};

const products: Product[] = [
  {
    id: 14381328,
    name: 'id quis voluptate nostrud',
    options: {
      size: 'XL',
      amount: 100,
    },
    active: true,
    createdAt: '1985-08-09T02:10:18.0Z',
  },
  {
    id: 26785188,
    name: 'esse elit',
    options: {
      size: 'S',
      amount: 10,
    },
    active: true,
    createdAt: '1956-03-20T08:59:40.0Z',
  },
  {
    id: 63878634,
    name: 'enim',
    options: {
      size: 'L',
      amount: 20,
    },
    active: false,
    createdAt: '2016-07-27T16:05:57.0Z',
  },
  {
    id: 79901249,
    name: 'eu ad',
    options: {
      size: 'XXL',
      amount: 1000,
    },
    active: true,
    createdAt: '1988-08-20T03:53:24.0Z',
  },
  {
    id: 53113051,
    name: 'proident ipsum',
    options: {
      size: 'XL',
      amount: 4,
    },
    active: true,
    createdAt: '2003-01-19T20:09:29.0Z',
  },
  {
    id: 49132779,
    name: 'aliqua adipisicing',
    options: {
      size: 'S',
      amount: 22,
    },
    active: false,
    createdAt: '2003-06-14T02:44:44.0Z',
  },
  {
    id: 12135250,
    name: 'dolor non in sunt',
    options: {
      size: 'M',
      amount: 11,
    },
    active: true,
    createdAt: '2000-08-04T19:49:04.0Z',
  },
  {
    id: 47196404,
    name: 'dolor culpa in cupidatat',
    options: {
      size: 'S',
      amount: 1,
    },
    active: false,
    createdAt: '2003-11-15T23:56:45.0Z',
  },
  {
    id: 5112903,
    name: 'sunt amet do eu ipsum',
    options: {
      size: 'L',
      amount: 10,
    },
    active: false,
    createdAt: '1968-09-24T22:07:21.0Z',
  },
  {
    id: 32497729,
    name: 'eiusmod',
    options: {
      size: 'XXL',
      amount: 0,
    },
    active: true,
    createdAt: '2012-09-24T01:42:32.0Z',
  },
];
const ProductsPage = () => {
  const [data, setData] = useState<Product[]>(products);

  const productsScheme = useCallback<EntityWidgetSchemaFn>((row) => {
    const disabled = !row.active;
    return entity({
      id: text({ label: 'ID', readonly: disabled, filterable: true }),
      name: text({
        label: 'title',
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

  const save = useCallback((values: Product) => {
    setData((prevData) => {
      const idx = prevData.findIndex((row) => row.id === values.id);
      prevData[idx] = values;
      return prevData;
    });
  }, []);

  return (
    <EntityWidget
      tableData={data}
      tableColumns={columns}
      keyProp="id"
      onSaveEntity={save}
      schema={productsScheme}
      renderCell={(key, row) => {
        if (key === 'options') {
          return JSON.stringify(row[key]);
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
