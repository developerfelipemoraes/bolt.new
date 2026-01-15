import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Filter, X } from 'lucide-react';
import {
  TextFilterState,
  TextFilterOperator,
  OPERATOR_LABELS
} from '@/features/vehicle-search-export/libs/text-filter';
import { cn } from '@/lib/utils';

interface TextFilterProps {
  columnName: string;
  filter?: TextFilterState;
  onFilterChange: (filter: TextFilterState | undefined) => void;
  placeholder?: string;
}

const DEFAULT_OPERATOR: TextFilterOperator = 'contains';

export function TextFilter({
  columnName,
  filter,
  onFilterChange,
  placeholder = 'Filtrar...'
}: TextFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Local state for the form
  const [operator1, setOperator1] = useState<TextFilterOperator>(DEFAULT_OPERATOR);
  const [value1, setValue1] = useState('');

  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');

  const [operator2, setOperator2] = useState<TextFilterOperator>(DEFAULT_OPERATOR);
  const [value2, setValue2] = useState('');

  // Sync with prop when opening
  useEffect(() => {
    if (isOpen) {
      if (filter && filter.conditions.length > 0) {
        setOperator1(filter.conditions[0].operator);
        setValue1(filter.conditions[0].value);

        if (filter.conditions.length > 1) {
          setLogic(filter.logic);
          setOperator2(filter.conditions[1].operator);
          setValue2(filter.conditions[1].value);
        } else {
          setLogic('AND');
          setOperator2(DEFAULT_OPERATOR);
          setValue2('');
        }
      } else {
        // Reset if no filter
        setOperator1(DEFAULT_OPERATOR);
        setValue1('');
        setLogic('AND');
        setOperator2(DEFAULT_OPERATOR);
        setValue2('');
      }
    }
  }, [isOpen, filter]);

  const handleApply = () => {
    const conditions = [];

    if (value1.trim()) {
      conditions.push({ operator: operator1, value: value1 });
    }

    if (value2.trim()) {
      conditions.push({ operator: operator2, value: value2 });
    }

    if (conditions.length > 0) {
      onFilterChange({
        logic,
        conditions
      });
    } else {
      onFilterChange(undefined);
    }

    setIsOpen(false);
  };

  const handleClear = () => {
    onFilterChange(undefined);
    setIsOpen(false);
  };

  const hasFilter = filter && filter.conditions.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasFilter ? "default" : "ghost"}
          size="sm"
          className={cn(
            "h-7 px-2 text-xs",
            hasFilter ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-500 hover:text-gray-900"
          )}
        >
          <Filter className="w-3 h-3 mr-1" />
          {hasFilter ? 'Filtrado' : 'Filtro'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-medium text-sm">Filtros de texto: {columnName}</h4>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* Condition 1 */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Mostrar linhas onde:</Label>
              <Select
                value={operator1}
                onValueChange={(val) => setOperator1(val as TextFilterOperator)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OPERATOR_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="h-8 text-xs"
                placeholder={placeholder}
              />
            </div>

            {/* Logic Operator */}
            <div className="flex justify-center py-1">
               <RadioGroup
                 value={logic}
                 onValueChange={(val) => setLogic(val as 'AND' | 'OR')}
                 className="flex gap-4"
               >
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="AND" id="and" />
                   <Label htmlFor="and" className="text-xs font-normal">E</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="OR" id="or" />
                   <Label htmlFor="or" className="text-xs font-normal">OU</Label>
                 </div>
               </RadioGroup>
            </div>

            {/* Condition 2 */}
            <div className="space-y-2">
              <Select
                value={operator2}
                onValueChange={(val) => setOperator2(val as TextFilterOperator)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                   {Object.entries(OPERATOR_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                className="h-8 text-xs"
                placeholder={placeholder}
              />
            </div>
          </div>

          <div className="flex justify-between pt-2 border-t mt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={handleClear}
            >
              Limpar
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
              onClick={handleApply}
            >
              Aplicar Filtro
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
