import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';
import type { Field, FileField } from '@/modules/enitity-editor/primitives';
import { Switch } from '@/components/switch';
import { Dialog } from '@/components/diaglog';
import { toDateTimeLocal } from '@/helpers/to-date-timeLocal';
import set from 'lodash/set';
import get from 'lodash/get';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EntityFormValues = Record<string, any>;

export type EntityEditProps = {
  schema: Record<string, Field>;
  initialValues?: EntityFormValues;
  onSubmit: (data: EntityFormValues) => void;
  open: boolean;
  onOpenChange: () => void;
};

const fileValidator = (f: FileField, value: File) => {
  if (f.maxSizeMb && value.size > f.maxSizeMb * 1024 * 1024)
    return `File must be <= ${f.maxSizeMb}MB`;
  if (f.acceptFiles && !f.acceptFiles.includes(value.type))
    return `Invalid file type. Allowed: ${f.acceptFiles.join(', ')}`;
  return null;
};

const EntityEdit = ({
  schema,
  onSubmit,
  onOpenChange,
  open,
  initialValues,
}: EntityEditProps) => {
  const [formData, setFormData] = useState<EntityFormValues>(
    (structuredClone(initialValues) || {}) as EntityFormValues,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields = useMemo(() => Object.entries(schema), [schema]);

  function handleChange(name: string, value: unknown) {
    setFormData((prev) => {
      set(prev, name, value);
      return { ...prev };
    });
  }

  function validateField<T>(field: Field, value: T): string | null {
    switch (field.kind) {
      case 'file': {
        const f = field as FileField;
        if (!value) return null;
        if (!(value instanceof FileList)) return 'Invalid file';

        if (field.multiple) {
          for (const file of Array.from(value)) {
            const error = fileValidator(f, file);
            if (error) return error;
          }
        } else {
          return fileValidator(f, value[0]);
        }
        return null;
      }
      case 'json': {
        try {
          if (typeof value === 'string') {
            JSON.parse(value);
          } else {
            return null;
          }
          return null;
        } catch {
          return null;
        }
      }
      default:
        return null;
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    Object.entries(schema).forEach(([key, field]) => {
      const error = validateField(field, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const parsedData: EntityFormValues = formData;
    Object.entries(schema).forEach(([key, field]) => {
      if (field.kind === 'json' && parsedData[key]) {
        parsedData[key] = JSON.parse(parsedData[key]);
      }
    });

    onSubmit(parsedData);
  }

  const renderField = (
    key: string,
    field: Field,
    error: string | undefined,
  ) => {
    const inputClasses =
      'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';
    const textareaClasses =
      'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed min-h-[100px] resize-y';
    const rangeClasses =
      'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider';
    const selectClasses =
      'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';

    const fieldValue = get(formData, key);

    switch (field.kind) {
      case 'date':
        return (
          <label key={key}>
            {field.label && <span className="pb-2.5">{field.label}</span>}
            <input
              type="datetime-local"
              readOnly={field.readonly}
              value={fieldValue ? toDateTimeLocal(fieldValue) : ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(key, e.target.value)
              }
              placeholder={field.label}
              className={inputClasses}
            />
          </label>
        );

      case 'text':
        if (field.type === 'textarea') {
          return (
            <label key={key}>
              {field.label && <span className="pb-2.5">{field.label}</span>}
              <textarea
                readOnly={field.readonly}
                value={fieldValue || ''}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(key, e.target.value)
                }
                placeholder={field.label}
                className={textareaClasses}
              />
            </label>
          );
        }
        return (
          <label key={key}>
            {field.label && <span className="pb-2.5">{field.label}</span>}
            <input
              type="text"
              readOnly={field.readonly}
              value={fieldValue || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(key, e.target.value)
              }
              placeholder={field.label}
              className={inputClasses}
            />
          </label>
        );

      case 'number':
        return field.type === 'slider' ? (
          <label key={key}>
            {field.label && <span className="pb-2.5">{field.label}</span>}
            <input
              type="range"
              readOnly={field.readonly}
              min={field.min}
              max={field.max}
              step={field.step}
              value={[fieldValue ?? 0]}
              onChange={(e) => handleChange(key, e.target.value)}
              className={rangeClasses}
            />
          </label>
        ) : (
          <label key={key}>
            {field.label && <span className="pb-2.5">{field.label}</span>}
            <input
              type="number"
              readOnly={field.readonly}
              value={fieldValue || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(key, Number(e.target.value))
              }
              placeholder={field.label}
              className="w-full"
            />
          </label>
        );

      case 'bool':
        return field.type === 'switch' ? (
          <div key={key} className="flex items-center space-x-2">
            <Switch
              checked={!!fieldValue}
              onCheckedChange={(v: boolean) => handleChange(key, v)}
              disabled={field.readonly}
            />
            <label>{field.label}</label>
          </div>
        ) : (
          <label key={key}>
            <input
              type="checkbox"
              disabled={field.readonly}
              checked={!!fieldValue}
              onChange={(e) => handleChange(key, e.target.checked)}
            />
            {field.label && <span className="pl-1.5">{field.label}</span>}
          </label>
        );

      case 'select':
        return (
          <div key={key} className="flex flex-col">
            <label className="mb-1">{field.label}</label>
            <select
              className={selectClasses}
              disabled={field.readonly}
              value={fieldValue ?? ''}
              onChange={(e) => handleChange(key, e.target.value)}
            >
              <option value="">Select...</option>
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
          <div key={key} className="flex flex-col">
            <label className="mb-1">{field.label}</label>
            <select
              multiple
              className={selectClasses}
              disabled={field.readonly}
              value={fieldValue ?? []}
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

      case 'file':
        return (
          <div key={key} className="flex flex-col">
            <label>{field.label}</label>
            <input
              type="file"
              disabled={field.readonly}
              multiple={field.multiple}
              accept={field.acceptFiles?.join(',')}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(key, e.target.files)
              }
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        );
      case 'json':
        return (
          <div key={key}>
            <label>{field.label || key}</label>
            <textarea
              onChange={(e) => handleChange(key, e.target.value)}
              readOnly={field.readonly}
              placeholder='{"foo": "bar"}'
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        );

      case 'entity':
        return (
          <div key={key} className="space-y-4">
            {field.label && (
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                {field.label}
              </h3>
            )}
            <div className="pl-4 border-l-2 border-gray-200 space-y-4">
              {Object.entries(field.schema).map(([nestedKey, nestedField]) => (
                <div key={nestedKey}>
                  {renderField(
                    `${key}.${nestedKey}`,
                    nestedField,
                    errors[`${key}.${nestedKey}`],
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map(([key, field]) => (
          <div key={key}>{renderField(key, field, errors[key])}</div>
        ))}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default EntityEdit;
