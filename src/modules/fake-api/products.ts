import { compareAsc, isAfter, isBefore, parseISO } from 'date-fns';

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

export type FilterParams = {
  id?: number;
  name?: string;
  active?: boolean;
  options?: {
    size?: string;
    amount?: number;
  };
  createdAt?: {
    from?: string;
    to?: string;
  };
};

export type SortParams = {
  field: string;
  direction: 'asc' | 'desc';
};

class FakeApi {
  private data: Product[];

  constructor(initialData: Product[]) {
    this.data = [...initialData];
  }

  async edit(id: number, newValues: Partial<Product>): Promise<Product | null> {
    const index = this.data.findIndex((item) => item.id === id);

    if (index === -1) {
      return null; // Item not found
    }

    // Create a new object with updated values while preserving the original createdAt
    const updatedItem = {
      ...this.data[index],
      ...newValues,
      // Preserve original createdAt unless explicitly provided
      createdAt: newValues.createdAt ?? this.data[index].createdAt,
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
  }): Promise<Product[]> {
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
  private applyFilters(items: Product[], filters: FilterParams): Product[] {
    return items.filter((item) => {
      // Filter by name (case insensitive includes)
      if (filters.id) {
        return item.id === filters.id;
      }

      if (
        filters.name &&
        !item.name.toLowerCase().includes(filters.name.toLowerCase())
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

      // Filter by options
      if (filters.options) {
        // Filter by size (exact match)
        if (
          filters.options.size &&
          item.options.size !== filters.options.size
        ) {
          return false;
        }

        // Filter by amount (exact match)
        if (
          typeof filters.options.amount !== 'undefined' &&
          item.options.amount !== filters.options.amount
        ) {
          return false;
        }
      }

      // Filter by date range
      if (filters.createdAt) {
        const itemDate = parseISO(item.createdAt);
        let after = true;
        let before = true;
        if (filters.createdAt.from) {
          after = isAfter(itemDate, parseISO(filters.createdAt.from));
        }

        if (filters.createdAt.to) {
          before = isBefore(itemDate, parseISO(filters.createdAt.to));
        }

        return after && before;
      }

      return true;
    });
  }

  // Sorting implementation
  private applySorting(items: Product[], sort: SortParams): Product[] {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;

        case 'createdAt':
          comparison = compareAsc(parseISO(a.createdAt), parseISO(b.createdAt));
          break;

        case 'active':
          comparison = Number(a.active) - Number(b.active);
          break;

        case 'options.size':
          comparison = a.options.size.localeCompare(b.options.size);
          break;

        case 'options.amount':
          comparison = a.options.amount - b.options.amount;
          break;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }
}

// Example usage
const sampleData: Product[] = [
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

export const productsFakeApi = new FakeApi(sampleData);
