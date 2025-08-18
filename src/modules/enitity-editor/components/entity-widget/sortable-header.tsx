export type SortableHeaderProps = {
  column: { key: string; label: string; sortable?: boolean };
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
};

export const SortableHeader = ({
  column,
  sortConfig,
  onSort,
}: SortableHeaderProps) => {
  if (!column.sortable) {
    return <span>{column.label}</span>;
  }

  const isSorted = sortConfig?.key === column.key;
  const sortDirection = isSorted ? sortConfig.direction : null;

  return (
    <button
      type="button"
      onClick={() => onSort(column.key)}
      className="flex items-center space-x-1 hover:text-blue-600 focus:outline-none focus:text-blue-600"
    >
      <span>{column.label}</span>
      <div className="flex flex-col">
        <span
          className={`text-xs ${
            sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          ▲
        </span>
        <span
          className={`text-xs ${
            sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          ▼
        </span>
      </div>
    </button>
  );
};
