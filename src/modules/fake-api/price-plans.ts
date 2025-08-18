import { compareAsc, isAfter, isBefore, parseISO } from 'date-fns';

type PricePlan = {
  id: number;
  description: string;
  active: boolean;
  createdAt: string;
  removedAt: string;
};

export type FilterParams = {
  id?: number;
  description?: string;
  active?: boolean;
  createdAt?: {
    from?: string;
    to?: string;
  };
  removedAt?: {
    from?: string;
    to?: string;
  };
};

export type SortParams = {
  field: string;
  direction: 'asc' | 'desc';
};

class FakePricePlansApi {
  private data: PricePlan[];

  constructor(initialData: PricePlan[]) {
    this.data = [...initialData];
  }

  async edit(
    id: number,
    newValues: Partial<PricePlan>,
  ): Promise<PricePlan | null> {
    const index = this.data.findIndex((item) => item.id === id);

    if (index === -1) {
      return null; // Item not found
    }

    // Create a new object with updated values while preserving the original dates
    const updatedItem = {
      ...this.data[index],
      ...newValues,
      // Preserve original dates unless explicitly provided
      createdAt: newValues.createdAt ?? this.data[index].createdAt,
      removedAt: newValues.removedAt ?? this.data[index].removedAt,
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
  }): Promise<PricePlan[]> {
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
  private applyFilters(items: PricePlan[], filters: FilterParams): PricePlan[] {
    return items.filter((item) => {
      // Filter by id
      if (filters.id) {
        return item.id === filters.id;
      }

      // Filter by description (case insensitive includes)
      if (
        filters.description &&
        !item.description
          .toLowerCase()
          .includes(filters.description.toLowerCase())
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

      // Filter by createdAt date range
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

        if (!(after && before)) {
          return false;
        }
      }

      // Filter by removedAt date range
      if (filters.removedAt) {
        const itemDate = parseISO(item.removedAt);
        let after = true;
        let before = true;
        if (filters.removedAt.from) {
          after = isAfter(itemDate, parseISO(filters.removedAt.from));
        }

        if (filters.removedAt.to) {
          before = isBefore(itemDate, parseISO(filters.removedAt.to));
        }

        if (!(after && before)) {
          return false;
        }
      }

      return true;
    });
  }

  // Sorting implementation
  private applySorting(items: PricePlan[], sort: SortParams): PricePlan[] {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;

        case 'createdAt':
          comparison = compareAsc(parseISO(a.createdAt), parseISO(b.createdAt));
          break;

        case 'removedAt':
          comparison = compareAsc(parseISO(a.removedAt), parseISO(b.removedAt));
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
const samplePricePlansData: PricePlan[] = [
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

export const pricePlansFakeApi = new FakePricePlansApi(samplePricePlansData);
