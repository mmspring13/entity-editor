export type Option<T extends string | number> = {
  label: string;
  value: T;
};

export interface BaseField {
  kind:
    | 'text'
    | 'number'
    | 'bool'
    | 'file'
    | 'json'
    | 'select'
    | 'multiselect'
    | 'date';
  label?: string;
  readonly?: boolean;
  // eslint-disable-next-line
  getValueToString?(item: any): string;
}

export interface TextField extends BaseField {
  kind: 'text';
  label?: string;
  filterable?: boolean;
  type?: 'input' | 'textarea' | 'date';
}

export interface NumberField extends BaseField {
  kind: 'number';
  label?: string;
  filterable?: boolean;
  type?: 'input' | 'slider';
  min?: number;
  max?: number;
  step?: number;
}

export interface BoolField extends BaseField {
  kind: 'bool';
  label?: string;
  filterable?: boolean;
  type?: 'switch' | 'checkbox';
}

export interface SelectField<T extends string | number> extends BaseField {
  kind: 'select';
  options: Option<T>[];
  filterable?: boolean;
  label?: string;
  type: 'select' | 'radio';
}

export interface MultiSelectField<T extends string | number> extends BaseField {
  kind: 'multiselect';
  options: Option<T>[];
  label?: string;
  filterable?: boolean;
}

interface FileFieldBase extends BaseField {
  kind: 'file';
  label?: string;
  maxSizeMb?: number;
  acceptFiles?: string[];
  required?: boolean;
}

export type FileField =
  | (FileFieldBase & { multiple: true; preview?: string[] })
  | (FileFieldBase & { multiple: false; preview?: string });

export function file(
  config?: Omit<FileField, 'kind'> & { multiple?: false },
): FileField & { multiple: false };
export function file(
  config: Omit<FileField, 'kind'> & { multiple: true },
): FileField & { multiple: true };
export function file(
  config: Omit<FileField, 'kind'> = { multiple: false },
): FileField {
  return {
    kind: 'file',
    ...config,
  } as FileField;
}

export interface JsonField extends BaseField {
  kind: 'json';
  label?: string;
}

export type Field =
  | TextField
  | NumberField
  | BoolField
  | FileField
  | JsonField
  | SelectField<string | number>
  | MultiSelectField<string | number>;

// ---- Field Builders ----
export const text = (config: Omit<TextField, 'kind'> = {}): TextField => ({
  kind: 'text',
  ...config,
});

export const number = (
  config: Omit<NumberField, 'kind'> = {},
): NumberField => ({
  kind: 'number',
  ...config,
});

export const bool = (config: Omit<BoolField, 'kind'> = {}): BoolField => ({
  kind: 'bool',
  ...config,
});

export function select<const Opts extends readonly Option<string | number>[]>(
  config: Omit<SelectField<Opts[number]['value']>, 'kind'> & { options: Opts },
): SelectField<Opts[number]['value']> {
  return {
    kind: 'select',
    ...config,
  };
}

export function multiselect<
  const Opts extends readonly Option<string | number>[],
>(
  config: Omit<MultiSelectField<Opts[number]['value']>, 'kind'> & {
    options: Opts;
  },
): MultiSelectField<Opts[number]['value']> {
  return {
    kind: 'multiselect',
    ...config,
  };
}

export type EntitySchema = Record<string, Field>;

export const entity = <T extends EntitySchema>(schema: T) => schema;

export const getTableSchema = <T extends EntitySchema>(schema: T) => {
  return Object.keys(schema).reduce<
    {
      key: string;
      label?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getValueToString?: (item: any) => string;
    }[]
  >((acc, value) => {
    acc.push({
      key: value,
      label: schema[value].label,
      getValueToString: schema[value].getValueToString,
    });
    return acc;
  }, []);
};
