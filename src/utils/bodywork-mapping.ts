/**
 * Normalization and Mapping Utilities for Bodywork/Chassis Models
 */

// Blocklist for garbage data to exclude from selection
export const BLOCKLIST_TERMS = [
  'teste',
  'none',
  'nao-a-venda',
  'não-a-venda',
  'produto-teste',
  'sem carroceria',
];

/**
 * Normalizes a string for comparison (remove accents, lowercase, trim)
 */
export const normalizeText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
};

/**
 * Normalizes a string for display/storage (Trim, fix common casing issues if needed)
 */
export const normalizeForDisplay = (text: string): string => {
  if (!text) return '';
  return text.trim(); // We can add Title Case logic here if desired
};

/**
 * Checks if a manufacturer name is valid (not in blocklist)
 */
export const isValidManufacturer = (name: string): boolean => {
  const normalized = normalizeText(name);
  if (normalized.length < 2) return false; // "1", "a", etc.
  return !BLOCKLIST_TERMS.some((term) => normalized.includes(term));
};

/**
 * Validates if a given year falls within the model's production range
 */
export const isYearValidForModel = (
  year: number,
  ranges: { start: number; end: number }[] | null | undefined,
  start?: number,
  end?: number
): boolean => {
  if (!year) return false;

  // 1. Check ranges if available
  if (ranges && ranges.length > 0) {
    return ranges.some((range) => {
      const min = range.start || 0;
      const max = range.end || 9999;
      return year >= min && year <= max;
    });
  }

  // 2. Check simple start/end
  const min = start || 0;
  const max = end || 9999;
  return year >= min && year <= max;
};
