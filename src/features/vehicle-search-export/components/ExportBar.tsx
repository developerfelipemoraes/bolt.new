import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FileText, FileSpreadsheet, ChevronDown, Loader as Loader2 } from 'lucide-react';
import { NormalizedVehicle, SearchFilters } from '../types';
import { exportToExcel } from '../libs/xls';
import { ReportSelector } from './ReportSelector';
import { toast } from 'sonner';
import { reportService } from '@/api/services/reports/report.service';
import { format } from 'date-fns';

interface ExportBarProps {
  totalResults: number;
  selectedVehicles: NormalizedVehicle[];
  allVehicles: NormalizedVehicle[];
  filters: SearchFilters;
}

export function ExportBar({ totalResults, selectedVehicles, allVehicles, filters }: ExportBarProps) {
  const [isExporting, setIsExporting] = useState(false);

  const downloadPdf = async (vehicles: NormalizedVehicle[], title: string, filenameOverride?: string) => {
    setIsExporting(true);
    try {
      const payload = {
        vehicles: vehicles.map(v => ({ sku: v.sku })),
        reportTitle: title
      };

      const blob = await reportService.generatePdf(payload);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const filename = filenameOverride || `relatorio-${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSelectedPDF = () => {
    if (selectedVehicles.length === 0) {
      toast.error('Nenhum veículo selecionado');
      return;
    }
    downloadPdf(selectedVehicles, 'PDF Simples');
  };

  const handleExportNewPDF = () => {
    if (selectedVehicles.length === 0) {
      toast.error('Nenhum veículo selecionado');
      return;
    }

    // Format: Onibus_DDMMYYYY_HH_mm_ss.pdf
    const dateStr = format(new Date(), 'ddMMyyyy_HH_mm_ss');
    const filename = `Onibus_${dateStr}.pdf`;

    downloadPdf(selectedVehicles, 'PDF New', filename);
  };

  const handleExportAllPDF = () => {
    if (allVehicles.length === 0) {
      toast.error('Nenhum veículo encontrado');
      return;
    }
    downloadPdf(allVehicles, 'PDF Simples');
  };

  const handleExportSelectedExcel = () => {
    if (selectedVehicles.length === 0) {
      toast.error('Nenhum veículo selecionado');
      return;
    }

    setIsExporting(true);
    try {
      exportToExcel(selectedVehicles, filters);
      toast.success(`${selectedVehicles.length} veículos exportados em Excel!`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Erro ao gerar Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAllExcel = () => {
    if (allVehicles.length === 0) {
      toast.error('Nenhum veículo encontrado');
      return;
    }

    setIsExporting(true);
    try {
      exportToExcel(allVehicles, filters);
      toast.success(`${allVehicles.length} veículos exportados em Excel!`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Erro ao gerar Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const hasSelection = selectedVehicles.length > 0;

  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-4 shadow-sm">
      <div className="flex w-full items-center gap-2 flex-wrap md:flex-nowrap">
        {/* Totalizador à esquerda */}
        <div className="flex items-center gap-3 pr-3 md:pr-4 md:border-r md:border-gray-200">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
            </p>
            {hasSelection && (
              <p className="text-xs font-medium text-blue-600">
                {selectedVehicles.length}{' '}
                {selectedVehicles.length === 1 ? 'selecionado' : 'selecionados'}
              </p>
            )}
          </div>
        </div>

        {/* Botões e controles: todos lado a lado */}
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* ReportSelector como “botão”/controle inline */}
          <div className="shrink-0">
            <ReportSelector
              selectedVehicles={selectedVehicles}
              allVehicles={allVehicles}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSelectedPDF}
            disabled={!hasSelection || isExporting}
            className="flex items-center gap-2 shrink-0"
            aria-label="Exportar seleção em PDF"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">PDF Simples</span>
            <span className="sm:hidden">PDF</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportNewPDF}
            disabled={!hasSelection || isExporting}
            className="flex items-center gap-2 shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            aria-label="Exportar seleção em PDF New"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">PDF New</span>
            <span className="sm:hidden">PDF+</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSelectedExcel}
            disabled={!hasSelection || isExporting}
            className="flex items-center gap-2 shrink-0"
            aria-label="Exportar seleção em Excel"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Excel</span>
            <span className="sm:hidden">XLS</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isExporting} className="shrink-0">
                <span className="hidden sm:inline">Todos</span>
                <span className="sm:hidden">+</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportAllPDF}>
                <FileText className="w-4 h-4 mr-2" />
                PDF (Todos)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportAllExcel}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel (Todos)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
