import { YearEntry, YearRange, YearRules } from '@/types/vehicleModels';

export interface YearRangeResult {
  yearEntries: YearEntry[];
  yearRanges: YearRange[];
  yearRules: YearRules;
  sourceCount: number;
}

export function deduplicateAndSortYearEntries(entries: YearEntry[]): YearEntry[] {
  const uniqueMap = new Map<string, YearEntry>();

  entries.forEach(entry => {
    const key = `${entry.manufactureYear}-${entry.modelYear}`;
    uniqueMap.set(key, entry);
  });

  const deduplicated = Array.from(uniqueMap.values());

  deduplicated.sort((a, b) => {
    if (a.manufactureYear !== b.manufactureYear) {
      return a.manufactureYear - b.manufactureYear;
    }
    return a.modelYear - b.modelYear;
  });

  return deduplicated;
}

export function extractAllYears(entries: YearEntry[]): number[] {
  const yearsSet = new Set<number>();

  entries.forEach(entry => {
    yearsSet.add(entry.manufactureYear);
    yearsSet.add(entry.modelYear);
  });

  const years = Array.from(yearsSet);
  years.sort((a, b) => a - b);

  return years;
}

export function calculateYearRanges(years: number[]): YearRange[] {
  if (years.length === 0) {
    return [];
  }

  const ranges: YearRange[] = [];
  let start = years[0];
  let prev = years[0];

  for (let i = 1; i < years.length; i++) {
    const current = years[i];

    if (current === prev + 1) {
      prev = current;
    } else {
      ranges.push({ start, end: prev });
      start = current;
      prev = current;
    }
  }

  ranges.push({ start, end: prev });

  return ranges;
}

export function calculateYearRangesFromEntries(entries: YearEntry[]): YearRangeResult {
  const deduplicated = deduplicateAndSortYearEntries(entries);
  const allYears = extractAllYears(deduplicated);
  const ranges = calculateYearRanges(allYears);

  const yearRules: YearRules = {
    sources: ['yearEntries'],
    logic: 'union->ranges; start=min(years); end=max(years); segments=contiguous'
  };

  return {
    yearEntries: deduplicated,
    yearRanges: ranges,
    yearRules,
    sourceCount: deduplicated.length
  };
}

export function validateYearEntry(
  entry: YearEntry,
  productionStart?: number | null,
  productionEnd?: number | null
): string | null {
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 1;

  if (!Number.isInteger(entry.manufactureYear) || !Number.isInteger(entry.modelYear)) {
    return 'Os anos devem ser números inteiros';
  }

  if (entry.manufactureYear < 1900 || entry.manufactureYear > maxYear) {
    return `Ano de fabricação deve estar entre 1900 e ${maxYear}`;
  }

  if (entry.modelYear < 1900 || entry.modelYear > maxYear) {
    return `Ano do modelo deve estar entre 1900 e ${maxYear}`;
  }

  if (entry.modelYear < entry.manufactureYear) {
    return 'Ano do modelo não pode ser menor que o ano de fabricação';
  }

  if (productionStart && entry.manufactureYear < productionStart) {
    return `Ano de fabricação não pode ser menor que o início de produção (${productionStart})`;
  }

  if (productionEnd && entry.manufactureYear > productionEnd) {
    return `Ano de fabricação não pode ser maior que o fim de produção (${productionEnd})`;
  }

  if (productionStart && entry.modelYear < productionStart) {
    return `Ano do modelo não pode ser menor que o início de produção (${productionStart})`;
  }

  if (productionEnd && entry.modelYear > productionEnd) {
    return `Ano do modelo não pode ser maior que o fim de produção (${productionEnd})`;
  }

  return null;
}

export function generateYearEntriesFromRange(start: number, end: number): YearEntry[] {
  if (start > end) {
    return [];
  }

  const entries: YearEntry[] = [];

  for (let year = start; year <= end; year++) {
    entries.push({
      manufactureYear: year,
      modelYear: year
    });
  }

  return entries;
}

export function validateProductionYears(
  productionStart?: number | null,
  productionEnd?: number | null
): string | null {
  if (productionStart && productionEnd && productionStart > productionEnd) {
    return 'Ano de início de produção não pode ser maior que o ano de fim de produção';
  }

  return null;
}
