export const formatNumber = (value: number, type: 'currency' | 'number' | 'percentage' = 'number'): string => {
  if (type === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (type === 'percentage') {
    return `${value.toFixed(2)}%`;
  }

  return new Intl.NumberFormat('en-US').format(value);
};

export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}; 