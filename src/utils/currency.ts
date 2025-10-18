export const formatCurrencyBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const parseCurrencyBRL = (value: string): number => {
  const cleanValue = value
    .replace(/[^\d,]/g, '')
    .replace(',', '.');

  return parseFloat(cleanValue) || 0;
};

export const maskCurrencyBRL = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseCurrencyBRL(value) : value;

  if (isNaN(numValue)) return 'R$ 0,00';

  return formatCurrencyBRL(numValue);
};

export const formatCurrencyInput = (event: React.ChangeEvent<HTMLInputElement>): number => {
  const value = event.target.value;
  return parseCurrencyBRL(value);
};
