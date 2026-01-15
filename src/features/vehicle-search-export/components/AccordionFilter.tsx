import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FacetManufacturer } from '../types';

interface AccordionFilterProps {
  title: string;
  items: FacetManufacturer[];
  onParentChange: (value: string) => void;
  onChildChange: (value: string, parentValue: string) => void;
  expandedItem: string | null;
  onExpand: (value: string | null) => void;
}

export function AccordionFilter({
  title,
  items,
  onParentChange,
  onChildChange,
  expandedItem,
  onExpand
}: AccordionFilterProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <Label className="text-xs text-gray-600 mb-2 block">{title} ({items.length})</Label>
      <div className="space-y-1">
        {items.map(item => {
          const isExpanded = expandedItem === item.value;

          return (
            <div key={item.value} className="border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between py-1 group">
                <div className="flex items-center space-x-2 flex-1">
                  <Checkbox
                    id={`parent-${item.value}`}
                    checked={item.selected}
                    onCheckedChange={() => onParentChange(item.value)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div
                    className="flex-1 flex justify-between items-center cursor-pointer select-none"
                    onClick={() => onExpand(isExpanded ? null : item.value)}
                  >
                    <label
                      htmlFor={`parent-${item.value}`}
                      className="text-sm cursor-pointer flex-1"
                      onClick={(e) => e.stopPropagation()} // Prevent expansion when clicking label linked to checkbox
                    >
                      {item.name}
                    </label>
                    <span className="text-xs text-gray-400 ml-2 font-mono tabular-nums bg-gray-50 px-1.5 py-0.5 rounded">
                      {item.count}
                    </span>
                  </div>
                </div>

                {item.models.length > 0 && (
                  <button
                    onClick={() => onExpand(isExpanded ? null : item.value)}
                    className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {isExpanded && item.models.length > 0 && (
                <div className="pl-6 py-2 space-y-2 bg-gray-50/50 -mx-2 px-2 rounded-b">
                  {item.models.map(model => (
                    <div key={model.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`child-${model.value}`}
                        checked={model.selected}
                        onCheckedChange={() => onChildChange(model.value, item.value)}
                      />
                      <label
                        htmlFor={`child-${model.value}`}
                        className="text-sm cursor-pointer flex-1 flex justify-between items-center"
                      >
                        <span className="text-gray-700">{model.name}</span>
                        <span className="text-xs text-gray-400 font-mono tabular-nums">
                          {model.count}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
