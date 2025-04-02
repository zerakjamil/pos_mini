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

export const formatPercentage = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) {
    return '0.00%';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0.00%';
  }

  return `${(numValue * 100).toFixed(2)}%`;
};
