import { format, parseISO } from 'date-fns';

export function toDateTimeLocal(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd'T'HH:mm");
}
