export const formatCurrency = (amount: number): string => {
  return `IQD ${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};
