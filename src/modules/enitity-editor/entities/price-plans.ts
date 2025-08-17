import { bool, entity, getTableSchema, text } from '../primitives';

export const pricePlanEntity = entity({
  id: text({ label: 'ID', editable: false }),
  description: text({ label: 'Description' }),
  active: bool({ label: 'Active' }),
  createdAt: text({ label: 'Created At', type: 'date' }),
  removedAt: text({ label: 'Removed At', type: 'date' }),
});

export const pricePlanTableSchema = getTableSchema(pricePlanEntity);
