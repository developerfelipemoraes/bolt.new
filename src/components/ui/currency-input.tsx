import { forwardRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatToCurrency(value));
      }
    }, [value]);

    const formatToCurrency = (num: number): string => {
      return num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    const parseFromCurrency = (str: string): number => {
      const cleanValue = str.replace(/\./g, '').replace(',', '.');
      return parseFloat(cleanValue) || 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      inputValue = inputValue.replace(/[^\d,]/g, '');

      const commaCount = (inputValue.match(/,/g) || []).length;
      if (commaCount > 1) {
        return;
      }

      const parts = inputValue.split(',');
      if (parts[1] && parts[1].length > 2) {
        return;
      }

      setDisplayValue(inputValue);

      const numericValue = parseFromCurrency(inputValue);
      onChange?.(numericValue);
    };

    const handleBlur = () => {
      const numericValue = parseFromCurrency(displayValue);
      setDisplayValue(formatToCurrency(numericValue));
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          R$
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          className={cn("pl-10", className)}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
