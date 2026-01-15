export type TextFilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with';

export interface TextFilterCondition {
  operator: TextFilterOperator;
  value: string;
}

export interface TextFilterState {
  logic: 'AND' | 'OR';
  conditions: TextFilterCondition[];
}

export const OPERATOR_LABELS: Record<TextFilterOperator, string> = {
  equals: 'Igual a',
  not_equals: 'Diferente de',
  contains: 'Contém',
  not_contains: 'Não contém',
  starts_with: 'Começa com',
  ends_with: 'Termina com',
};

export function evaluateCondition(
  value: string,
  condition: TextFilterCondition
): boolean {
  if (!condition.value) return true; // Empty value matches everything? Or ignore?
  // Excel behavior: if you type nothing in "Equals", it matches empty strings.
  // But usually in filter UI, empty input means "no filter" for that line.
  // However, we only call this if we have a valid filter.

  const val = value.toLowerCase();
  const condVal = condition.value.toLowerCase();

  switch (condition.operator) {
    case 'equals':
      return val === condVal;
    case 'not_equals':
      return val !== condVal;
    case 'contains':
      return val.includes(condVal);
    case 'not_contains':
      return !val.includes(condVal);
    case 'starts_with':
      return val.startsWith(condVal);
    case 'ends_with':
      return val.endsWith(condVal);
    default:
      return true;
  }
}

export function applyTextFilter(
  value: string | null | undefined,
  filter: TextFilterState
): boolean {
  // Handle null/undefined values
  const normalizedValue = value || '';

  if (!filter.conditions || filter.conditions.length === 0) {
    return true;
  }

  // Filter out invalid conditions (empty values) if necessary,
  // but usually the UI handles what is a "valid" condition.
  // We assume conditions passed here are valid to be checked.
  // However, if the user leaves the input empty, we typically ignore that condition.
  const validConditions = filter.conditions.filter(c => c.value.trim() !== '');

  if (validConditions.length === 0) {
    return true;
  }

  const results = validConditions.map(condition =>
    evaluateCondition(normalizedValue, condition)
  );

  if (filter.logic === 'AND') {
    return results.every(r => r);
  } else {
    return results.some(r => r);
  }
}
