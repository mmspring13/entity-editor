import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';
import type { Field, FileField } from '@/modules/enitity-editor/primitives';
import { Switch } from '@/components/switch';
import { Dialog } from '@/components/diaglog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EntityFormValues = Record<string, any>;

export type EntityEditProps<T extends EntityFormValues> = {
  schema: Record<string, Field>;
  initialValues?: T;
  onSubmit: (data: T) => void;
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

export const EntityEdit = <T extends EntityFormValues>({
  schema,
  onSubmit,
  onOpenChange,
  open,
  initialValues,
}: EntityEditProps<T>) => {
  const [formData, setFormData] = useState<T>((initialValues || {}) as T);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields = useMemo(() => Object.entries(schema), [schema]);

  function handleChange(name: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateField<T>(field: Field, value: T): string | null {
    switch (field.kind) {
      case 'file': {
        const f = field as FileField;
        if (!value && !field.required) return null;
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
            throw new Error();
          }
          return null;
        } catch {
          return 'Invalid JSON';
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

    // Parse JSON fields before submit
    const parsedData: EntityFormValues = { ...formData };
    Object.entries(schema).forEach(([key, field]) => {
      if (field.kind === 'json' && parsedData[key]) {
        parsedData[key] = JSON.parse(parsedData[key]);
      }
    });

    onSubmit(parsedData as T);
  }

  const renderField = (
    key: string,
    field: Field,
    error: string | undefined,
  ) => {
    switch (field.kind) {
      case 'text':
        if (field.type === 'date') {
          return (
            <input
              type="date"
              key={key}
              value={formData[key] || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(key, e.target.value)
              }
              placeholder={field.label}
              className="w-full"
            />
          );
        }
        if (field.type === 'textarea') {
          return (
            <textarea
              key={key}
              value={formData[key] || ''}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleChange(key, e.target.value)
              }
              placeholder={field.label}
              className="w-full"
            />
          );
        }
        return (
          <input
            type="text"
            key={key}
            value={formData[key] || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(key, e.target.value)
            }
            placeholder={field.label}
            className="w-full"
          />
        );

      case 'number':
        return field.type === 'slider' ? (
          <input
            type="range"
            key={key}
            min={field.min}
            max={field.max}
            step={field.step}
            value={[formData[key] ?? 0]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full"
          />
        ) : (
          <input
            type="number"
            key={key}
            value={formData[key] || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(key, Number(e.target.value))
            }
            placeholder={field.label}
            className="w-full"
          />
        );

      case 'bool':
        return field.type === 'switch' ? (
          <div key={key} className="flex items-center space-x-2">
            <Switch
              checked={!!formData[key]}
              onCheckedChange={(v: boolean) => handleChange(key, v)}
            />
            <label>{field.label}</label>
          </div>
        ) : (
          <div key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={!!formData[key]}
              onChange={(e) => handleChange(key, e.target.checked)}
            />
            <label>{field.label}</label>
          </div>
        );

      case 'select':
        return (
          <div key={key} className="flex flex-col">
            <label className="mb-1">{field.label}</label>
            <select
              className="border rounded p-2"
              value={formData[key] ?? ''}
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
              className="border rounded p-2"
              value={formData[key] ?? []}
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
              placeholder='{"foo": "bar"}'
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        {fields.map(([key, field]) => (
          <div key={key} className="space-y-1">
            {renderField(key, field, errors[key])}
          </div>
        ))}
        <button type="submit">Save</button>
      </form>
    </Dialog>
  );
};
