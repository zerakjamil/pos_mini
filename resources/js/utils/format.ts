import { format, parseISO } from 'date-fns';

/**
 * Format a currency value
 * @param value - The number or string to format as currency
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) {
    return 'IQD 0';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return 'IQD 0';
  }

  return `IQD ${Number(numValue).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Format a date string
 * @param dateString - ISO date string to format
 * @param formatString - Optional format string (defaults to 'yyyy-MM-dd HH:mm')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatString: string = 'yyyy-MM-dd HH:mm'): string => {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
