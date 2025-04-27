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
