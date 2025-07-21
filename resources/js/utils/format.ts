/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency symbol to use (defaults to $)
 * @returns A formatted currency string
 */
export const formatCurrency = (value: number | string, currency: string = '$'): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `${currency} ${numValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

/**
 * Format a date as YYYY-MM-DD or a readable string
 * @param date - The date to format (Date object or string)
 * @returns A formatted date string
 */
export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-CA'); // e.g., 2024-06-02
};
