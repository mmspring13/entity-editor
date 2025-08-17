import { useState } from 'react';
import { EntityEdit } from '@/modules/enitity-editor/components/edit-entity';
import {
  bool,
  entity,
  file,
  multiselect,
  number,
  select,
  text,
} from '@/modules/enitity-editor/primitives';
import { TableEntityDemo } from './modules/enitity-editor/components/table-entity';
import { Sb } from '@/sandbox.tsx';

const Album = entity({
  title: text({ label: 'Title', type: 'input' }),
  description: text({ type: 'textarea', label: 'Description' }),
  rating: number({ type: 'slider', min: 0, max: 100, step: 2 }),
  country: select({
    type: 'radio',
    options: [
      { label: 'Japan', value: 'japan' },
      { label: 'China', value: 'china' },
    ],
  }),
  genres: multiselect({
    label: 'Genres',
    options: [
      { label: 'Rock', value: 1 },
      { label: 'Jazz', value: 2 },
      { label: 'Pop', value: 3 },
    ],
  }),
  cover: file({ multiple: false, maxSizeMb: 10, acceptFiles: ['image/webp'] }),
  active: bool({ type: 'switch', label: 'Active' }),
  agreement: bool({ type: 'checkbox', label: 'Send Agreement' }),
});

type AlbumEntity = {
  title: string;
  description: string;
  rating: number;
  country: 'japan' | 'china';
  genres: Array<1 | 2 | 3>;
  cover?: string | null;
  active: boolean;
  agreement: boolean;
};

const initialData: AlbumEntity = {
  title: 'texxxx',
  description: 'hello album',
  rating: 10,
  country: 'japan',
  genres: [2],
  active: false,
  agreement: true,
};

function App() {
  const [open, setOpen] = useState(false);

  const save = (en: any) => {
    console.log('SAVAE', en);
  };

  return (
    <div>
      <Sb
        renderCell={(key, row) => {
          if (key === 'createdAt') {
            return new Date(row[key]).toISOString();
          }
          return row[key];
        }}
      />
      {/*<TableEntityDemo />*/}
      {/* <button type="button" onClick={() => setOpen(true)}>
        open
      </button> */}
      <EntityEdit
        schema={Album}
        initialValues={initialData}
        onSubmit={save}
        open={open}
        onOpenChange={() => setOpen(false)}
      />
    </div>
  );
}

export default App;
