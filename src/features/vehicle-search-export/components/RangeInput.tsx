import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RangeInputProps {
  label: string;
  min: number;
  max: number;
  datasetMin: number;
  datasetMax: number;
  onChange: (min: number, max: number) => void;
  formatter?: (value: number) => string;
  parser?: (value: string) => number;
  unit?: string;
  placeholderMin?: string;
  placeholderMax?: string;
}

export function RangeInput({
  label,
  min,
  max,
  datasetMin,
  datasetMax,
  onChange,
  formatter,
  parser,
  unit,
  placeholderMin = 'Mínimo',
  placeholderMax = 'Máximo'
}: RangeInputProps) {
  // Local state to handle string input before blur
  // We initialize with empty string if value matches dataset limits (effectively "no filter") or if explicit 0/Infinity logic applies
  // However, usually we want to show the number if it's set.
  // Requirement: "Empty fields should NOT apply filtering"
  // So if min == datasetMin (or 0) and max == datasetMax (or Infinity), we might want to show empty?
  // But wait, if I explicitly filter for 2000-2024, and dataset is 2000-2024, is it filtered? Technically yes, but effect is same.
  // The "no filter" state is usually specific constants like [0, 9999] or [0, Infinity].

  const isMinDefault = min <= 0 || min === datasetMin;
  const isMaxDefault = max >= 999999 || max === datasetMax || max === Infinity;

  const [minValue, setMinValue] = useState<string>(isMinDefault && min <= 0 ? '' : (formatter ? formatter(min) : min.toString()));
  const [maxValue, setMaxValue] = useState<string>(isMaxDefault && max >= 999999 ? '' : (formatter ? formatter(max) : max.toString()));

  // Sync with props if they change externally (e.g. clear filters)
  useEffect(() => {
    const isMinEmpty = min <= 0; // Assuming 0 is the "empty" value for Min
    const isMaxEmpty = max >= 999999 || max === Infinity; // Assuming high value is "empty" for Max

    // We only reset if the prop value is significantly different from what we might have parsed
    // Or just strictly sync.
    // To handle "Clear Filters", strict sync is best.
    // We rely on the parent passing the current state.

    // Check if we are focusing? No, assume sync on prop change is safe if user isn't typing.
    // But user typing triggers onChange, which updates props, which triggers useEffect...
    // We need to avoid cursor jumping or formatting issues while typing.
    // Standard pattern: Only update from props if prop value !== parsed local value.

    // For simplicity in this task, let's just update on prop change,
    // but usually Inputs are better uncontrolled or loosely controlled for "while typing".
    // I will use onBlur to commit changes to parent, and local state for typing.
    // But "onChange" prop implies immediate update?
    // "Input behavior rules... Minimum input cannot be greater than maximum input... If the user fills only one field... filter using that value only"

    // Let's use onBlur to commit to parent.

    setMinValue(min <= 0 ? '' : (formatter ? formatter(min) : min.toString()));
    setMaxValue((max >= 999999 || max === Infinity) ? '' : (formatter ? formatter(max) : max.toString()));
  }, [min, max, formatter]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow typing only numbers (and formatting chars if needed, but let's stick to raw input or formatted)
    // If we use formatter, the input value is formatted.
    // A simple numeric input is easier.
    // Requirement: "Price fields must support currency formatting (R$)".
    // If I use type="text", I can enforce numeric regex.
    setMinValue(e.target.value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxValue(e.target.value);
  };

  const parseValue = (val: string): number | null => {
    if (!val.trim()) return null;
    // Remove non-numeric chars except dot/comma if needed
    // For R$, we might have "R$ 1.000,00".
    // Let's use the provided parser or default.
    if (parser) return parser(val);

    // Default number parser (removes non-digits)
    const clean = val.replace(/[^\d]/g, '');
    return clean ? parseInt(clean, 10) : null;
  };

  const commitChanges = () => {
    let newMin = parseValue(minValue);
    let newMax = parseValue(maxValue);

    // Apply logic: "Minimum input cannot be greater than maximum input"
    // If so, swap? or clamp?
    // "Minimum input cannot be greater than maximum input" -> Usually implies UI validation.
    // I'll swap if both are present and min > max.

    if (newMin !== null && newMax !== null && newMin > newMax) {
        // Swap or clamp? Let's swap.
        const temp = newMin;
        newMin = newMax;
        newMax = temp;
        // Update local state to reflect swap
        setMinValue(formatter ? formatter(newMin) : newMin.toString());
        setMaxValue(formatter ? formatter(newMax) : newMax.toString());
    }

    // "Empty fields should NOT apply filtering" -> use 0 for min, Infinity for max (or pass specific defaults)
    // The parent expects the filter range.
    // The parent usually has [0, 9999] as default.
    // I will pass 0 if newMin is null, and Infinity (or 9999999) if newMax is null.
    // However, for Year, 0 is fine. For Price, 0 is fine.
    // For Max, I need to know what the "infinity" value is for that filter context.
    // But I can pass `Infinity` and let the parent/search logic handle "if > 999999 then ignore".
    // Or pass `datasetMax`? No, filtering by datasetMax means strict filter.
    // The filter logic in `search.ts` handles "no max limit" often by checking if it equals default.

    // I will pass 0 for empty Min, and Infinity for empty Max.
    // The search logic uses `filters.yearRange[1] < 9999`.
    // So if I pass Infinity, it is >= 9999, so it won't filter. Correct.

    onChange(
        newMin === null ? 0 : newMin,
        newMax === null ? Infinity : newMax
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.currentTarget.blur(); // Trigger onBlur
    }
  };

  const displayMin = datasetMin !== undefined ? (formatter ? formatter(datasetMin) : datasetMin) : '—';
  const displayMax = datasetMax !== undefined ? (formatter ? formatter(datasetMax) : datasetMax) : '—';
  const unitLabel = unit ? ` ${unit}` : '';

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium block">
        {label} <span className="text-xs font-normal text-muted-foreground ml-1">(min: {displayMin}{unitLabel}, max: {displayMax}{unitLabel})</span>
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
            <Input
              type="text"
              value={minValue}
              onChange={handleMinChange}
              onBlur={commitChanges}
              onKeyDown={handleKeyDown}
              placeholder={placeholderMin}
              className="w-full"
            />
        </div>
        <span className="text-gray-400">—</span>
        <div className="relative flex-1">
            <Input
              type="text"
              value={maxValue}
              onChange={handleMaxChange}
              onBlur={commitChanges}
              onKeyDown={handleKeyDown}
              placeholder={placeholderMax}
              className="w-full"
            />
        </div>
      </div>
    </div>
  );
}
