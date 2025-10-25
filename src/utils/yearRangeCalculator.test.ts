import { describe, it, expect } from 'vitest';
import {
  deduplicateAndSortYearEntries,
  extractAllYears,
  calculateYearRanges,
  calculateYearRangesFromEntries,
  validateYearEntry,
  generateYearEntriesFromRange,
  validateProductionYears
} from './yearRangeCalculator';
import { YearEntry } from '@/types/vehicleModels';

describe('yearRangeCalculator', () => {
  describe('deduplicateAndSortYearEntries', () => {
    it('deve remover duplicatas e ordenar', () => {
      const entries: YearEntry[] = [
        { manufactureYear: 1995, modelYear: 1995 },
        { manufactureYear: 1991, modelYear: 1991 },
        { manufactureYear: 1995, modelYear: 1995 },
        { manufactureYear: 1993, modelYear: 1993 },
      ];

      const result = deduplicateAndSortYearEntries(entries);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ manufactureYear: 1991, modelYear: 1991 });
      expect(result[1]).toEqual({ manufactureYear: 1993, modelYear: 1993 });
      expect(result[2]).toEqual({ manufactureYear: 1995, modelYear: 1995 });
    });

    it('deve ordenar por manufactureYear primeiro, depois modelYear', () => {
      const entries: YearEntry[] = [
        { manufactureYear: 1995, modelYear: 1996 },
        { manufactureYear: 1995, modelYear: 1995 },
      ];

      const result = deduplicateAndSortYearEntries(entries);

      expect(result[0]).toEqual({ manufactureYear: 1995, modelYear: 1995 });
      expect(result[1]).toEqual({ manufactureYear: 1995, modelYear: 1996 });
    });
  });

  describe('extractAllYears', () => {
    it('deve extrair união de todos os anos', () => {
      const entries: YearEntry[] = [
        { manufactureYear: 1991, modelYear: 1991 },
        { manufactureYear: 1995, modelYear: 1996 },
      ];

      const result = extractAllYears(entries);

      expect(result).toEqual([1991, 1995, 1996]);
    });

    it('deve retornar array vazio para entrada vazia', () => {
      const result = extractAllYears([]);
      expect(result).toEqual([]);
    });
  });

  describe('calculateYearRanges', () => {
    it('deve gerar faixas contíguas', () => {
      const years = [1991, 1992, 1993, 1995, 1996];
      const result = calculateYearRanges(years);

      expect(result).toEqual([
        { start: 1991, end: 1993 },
        { start: 1995, end: 1996 }
      ]);
    });

    it('deve gerar uma faixa para anos consecutivos', () => {
      const years = [1991, 1992, 1993, 1994, 1995, 1996];
      const result = calculateYearRanges(years);

      expect(result).toEqual([{ start: 1991, end: 1996 }]);
    });

    it('deve gerar faixas individuais para anos não consecutivos', () => {
      const years = [1991, 1993, 1995];
      const result = calculateYearRanges(years);

      expect(result).toEqual([
        { start: 1991, end: 1991 },
        { start: 1993, end: 1993 },
        { start: 1995, end: 1995 }
      ]);
    });

    it('deve retornar array vazio para entrada vazia', () => {
      const result = calculateYearRanges([]);
      expect(result).toEqual([]);
    });
  });

  describe('calculateYearRangesFromEntries', () => {
    it('deve calcular tudo corretamente (caso do exemplo)', () => {
      const entries: YearEntry[] = [
        { manufactureYear: 1991, modelYear: 1991 },
        { manufactureYear: 1992, modelYear: 1992 },
        { manufactureYear: 1993, modelYear: 1993 },
        { manufactureYear: 1994, modelYear: 1994 },
        { manufactureYear: 1995, modelYear: 1995 },
        { manufactureYear: 1996, modelYear: 1996 },
      ];

      const result = calculateYearRangesFromEntries(entries);

      expect(result.yearEntries).toHaveLength(6);
      expect(result.yearRanges).toEqual([{ start: 1991, end: 1996 }]);
      expect(result.sourceCount).toBe(6);
      expect(result.yearRules.sources).toEqual(['yearEntries']);
    });

    it('deve adicionar 1997 e expandir faixa', () => {
      const entries: YearEntry[] = [
        { manufactureYear: 1991, modelYear: 1991 },
        { manufactureYear: 1992, modelYear: 1992 },
        { manufactureYear: 1993, modelYear: 1993 },
        { manufactureYear: 1994, modelYear: 1994 },
        { manufactureYear: 1995, modelYear: 1995 },
        { manufactureYear: 1996, modelYear: 1996 },
        { manufactureYear: 1997, modelYear: 1997 },
      ];

      const result = calculateYearRangesFromEntries(entries);

      expect(result.yearRanges).toEqual([{ start: 1991, end: 1997 }]);
    });

    it('deve adicionar 1999 e criar duas faixas', () => {
      const entries: YearEntry[] = [
        { manufactureYear: 1991, modelYear: 1991 },
        { manufactureYear: 1992, modelYear: 1992 },
        { manufactureYear: 1993, modelYear: 1993 },
        { manufactureYear: 1994, modelYear: 1994 },
        { manufactureYear: 1995, modelYear: 1995 },
        { manufactureYear: 1996, modelYear: 1996 },
        { manufactureYear: 1997, modelYear: 1997 },
        { manufactureYear: 1999, modelYear: 1999 },
      ];

      const result = calculateYearRangesFromEntries(entries);

      expect(result.yearRanges).toEqual([
        { start: 1991, end: 1997 },
        { start: 1999, end: 1999 }
      ]);
    });
  });

  describe('validateYearEntry', () => {
    it('deve aceitar entrada válida', () => {
      const entry: YearEntry = { manufactureYear: 2023, modelYear: 2024 };
      const result = validateYearEntry(entry);
      expect(result).toBeNull();
    });

    it('deve rejeitar modelYear menor que manufactureYear', () => {
      const entry: YearEntry = { manufactureYear: 2024, modelYear: 2023 };
      const result = validateYearEntry(entry);
      expect(result).toContain('Ano do modelo não pode ser menor');
    });

    it('deve rejeitar ano antes de 1900', () => {
      const entry: YearEntry = { manufactureYear: 1899, modelYear: 1900 };
      const result = validateYearEntry(entry);
      expect(result).toContain('deve estar entre 1900');
    });

    it('deve validar contra productionStart', () => {
      const entry: YearEntry = { manufactureYear: 1990, modelYear: 1990 };
      const result = validateYearEntry(entry, 1991, null);
      expect(result).toContain('início de produção');
    });

    it('deve validar contra productionEnd', () => {
      const entry: YearEntry = { manufactureYear: 1997, modelYear: 1997 };
      const result = validateYearEntry(entry, null, 1996);
      expect(result).toContain('fim de produção');
    });
  });

  describe('generateYearEntriesFromRange', () => {
    it('deve gerar anos de 1991 a 1996', () => {
      const result = generateYearEntriesFromRange(1991, 1996);

      expect(result).toHaveLength(6);
      expect(result[0]).toEqual({ manufactureYear: 1991, modelYear: 1991 });
      expect(result[5]).toEqual({ manufactureYear: 1996, modelYear: 1996 });
    });

    it('deve retornar array vazio se start > end', () => {
      const result = generateYearEntriesFromRange(1996, 1991);
      expect(result).toEqual([]);
    });
  });

  describe('validateProductionYears', () => {
    it('deve aceitar productionStart < productionEnd', () => {
      const result = validateProductionYears(1991, 1996);
      expect(result).toBeNull();
    });

    it('deve rejeitar productionStart > productionEnd', () => {
      const result = validateProductionYears(1996, 1991);
      expect(result).toContain('não pode ser maior');
    });

    it('deve aceitar null', () => {
      const result = validateProductionYears(null, null);
      expect(result).toBeNull();
    });
  });
});
