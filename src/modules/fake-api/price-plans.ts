import { compareAsc, isAfter, isBefore, parseISO } from 'date-fns';

type Page = {
  id: number;
  title: string;
  updatedAt: string;
  active: boolean;
  publishedAt: string;
};

export type FilterParams = {
  id?: number;
  title?: string;
  active?: boolean;
  updatedAt?: {
    from?: string;
    to?: string;
  };
  publishedAt?: {
    from?: string;
    to?: string;
  };
};

export type SortParams = {
  field: string;
  direction: 'asc' | 'desc';
};

class FakePagesApi {
  private data: Page[];

  constructor(initialData: Page[]) {
    this.data = [...initialData];
  }

  async edit(id: number, newValues: Partial<Page>): Promise<Page | null> {
    const index = this.data.findIndex((item) => item.id === id);

    if (index === -1) {
      return null; // Item not found
    }

    // Create a new object with updated values while preserving the original dates
    const updatedItem = {
      ...this.data[index],
      ...newValues,
      // Preserve original dates unless explicitly provided
      updatedAt: newValues.updatedAt ?? this.data[index].updatedAt,
      publishedAt: newValues.publishedAt ?? this.data[index].publishedAt,
    };

    // Directly update the item in the array
    this.data[index] = updatedItem;

    return updatedItem;
  }

  // Main query method
  async query(params: {
    filters?: FilterParams;
    sort?: SortParams;
    limit?: number;
  }): Promise<Page[]> {
    let result = [...this.data];

    // Apply filters if provided
    if (params.filters) {
      result = this.applyFilters(result, params.filters);
    }

    // Apply sorting if provided
    if (params.sort) {
      result = this.applySorting(result, params.sort);
    }

    // Apply limit if provided
    if (params.limit) {
      result = result.slice(0, params.limit);
    }

    return result;
  }

  // Filter implementation
  private applyFilters(items: Page[], filters: FilterParams): Page[] {
    return items.filter((item) => {
      // Filter by id
      if (filters.id) {
        return item.id === filters.id;
      }

      // Filter by title (case insensitive includes)
      if (
        filters.title &&
        !item.title.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }

      // Filter by active status
      if (
        typeof filters.active !== 'undefined' &&
        item.active !== filters.active
      ) {
        return false;
      }

      // Filter by updatedAt date range
      if (filters.updatedAt) {
        const itemDate = parseISO(item.updatedAt);
        let after = true;
        let before = true;
        if (filters.updatedAt.from) {
          after = isAfter(itemDate, parseISO(filters.updatedAt.from));
        }

        if (filters.updatedAt.to) {
          before = isBefore(itemDate, parseISO(filters.updatedAt.to));
        }

        if (!(after && before)) {
          return false;
        }
      }

      // Filter by publishedAt date range
      if (filters.publishedAt) {
        const itemDate = parseISO(item.publishedAt);
        let after = true;
        let before = true;
        if (filters.publishedAt.from) {
          after = isAfter(itemDate, parseISO(filters.publishedAt.from));
        }

        if (filters.publishedAt.to) {
          before = isBefore(itemDate, parseISO(filters.publishedAt.to));
        }

        if (!(after && before)) {
          return false;
        }
      }

      return true;
    });
  }

  // Sorting implementation
  private applySorting(items: Page[], sort: SortParams): Page[] {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;

        case 'updatedAt':
          comparison = compareAsc(parseISO(a.updatedAt), parseISO(b.updatedAt));
          break;

        case 'publishedAt':
          comparison = compareAsc(
            parseISO(a.publishedAt),
            parseISO(b.publishedAt),
          );
          break;

        case 'active':
          comparison = Number(a.active) - Number(b.active);
          break;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }
}

// Sample data
const samplePagesData: Page[] = [
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

export const pagesFakeApi = new FakePagesApi(samplePagesData);
