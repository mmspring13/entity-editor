import { type ChangeEvent, type FormEvent, useState } from 'react';
import type { Field } from '@/modules/enitity-editor/primitives';
import { Switch } from '@/components/switch';

// eslint-disable-next-line
export type FilterFormValues = Record<string, any>;

export type EntityFiltersProps = {
  schema: Record<string, Field>;
  onFilter: (values: FilterFormValues) => void;
};

export const EntityFilters = ({ schema, onFilter }: EntityFiltersProps) => {
  const [filterValues, setFilterValues] = useState<FilterFormValues>({});

  // eslint-disable-next-line
  const handleChange = (key: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const activeFilters: FilterFormValues = {};
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== false) {
        activeFilters[key] = value;
      }
    });
    onFilter(activeFilters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    onFilter({});
  };

  const renderFilterField = (key: string, field: Field) => {
    const inputClasses =
      'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';
    const selectClasses =
      'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';

    switch (field.kind) {
      case 'text':
        if (field.type === 'date') {
          return (
            <div key={key} className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {field.label || key}
              </label>
              <input
                type="datetime-local"
                value={filterValues[key] || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(key, e.target.value)
                }
                placeholder={field.label || key}
                className={inputClasses}
              />
            </div>
          );
        }
        return (
          <div key={key} className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || key}
            </label>
            <input
              type="text"
              value={filterValues[key] || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(key, e.target.value)
              }
              placeholder={field.label || key}
              className={inputClasses}
            />
          </div>
        );

      case 'number':
        return (
          <div key={key} className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || key}
            </label>
            <input
              type="number"
              value={filterValues[key] || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(key, Number(e.target.value))
              }
              placeholder={field.label || key}
              className={inputClasses}
            />
          </div>
        );

      case 'bool':
        return (
          <div key={key} className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || key}
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={!!filterValues[key]}
                onCheckedChange={(v: boolean) => handleChange(key, v)}
              />
              <span className="text-sm text-gray-600">
                {filterValues[key] ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={key} className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || key}
            </label>
            <select
              className={selectClasses}
              value={filterValues[key] ?? ''}
              onChange={(e) => handleChange(key, e.target.value)}
            >
              <option value="">All</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'multiselect':
        return (
          <div key={key} className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || key}
            </label>
            <select
              multiple
              className={selectClasses}
              value={filterValues[key] ?? []}
              onChange={(e) =>
                handleChange(
                  key,
                  Array.from(e.target.selectedOptions).map((o) => o.value),
                )
              }
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  const filterableFields = Object.entries(schema).filter(
    // eslint-disable-next-line
    ([_, field]) => 'filterable' in field && field.filterable,
  );

  if (filterableFields.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          type="button"
          onClick={handleClearFilters}
          className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Clear All
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {filterableFields.map(([key, field]) =>
            renderFilterField(key, field),
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};
