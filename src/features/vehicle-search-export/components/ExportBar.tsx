import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FileText, FileSpreadsheet, ChevronDown, Loader2 } from 'lucide-react';
import { NormalizedVehicle } from '../types';
import { generateVehiclePDF, generateBatchPDF } from '../libs/pdf';
import { exportToExcel } from '../libs/xls';
import { toast } from 'sonner';

interface ExportBarProps {
  totalResults: number;
  selectedVehicles: NormalizedVehicle[];
  allVehicles: NormalizedVehicle[];
}

export function ExportBar({ totalResults, selectedVehicles, allVehicles }: ExportBarProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportSelectedPDF = async () => {
    if (selectedVehicles.length === 0) {
      toast.error('Nenhum veículo selecionado');
      return;
    }

    setIsExporting(true);
    try {
      if (selectedVehicles.length === 1) {
        await generateVehiclePDF(selectedVehicles[0]);
        toast.success('PDF gerado com sucesso!');
      } else {
        await generateBatchPDF(selectedVehicles);
        toast.success(`${selectedVehicles.length} veículos exportados em PDF!`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSelectedExcel = () => {
    if (selectedVehicles.length === 0) {
      toast.error('Nenhum veículo selecionado');
      return;
    }

    setIsExporting(true);
    try {
      exportToExcel(selectedVehicles);
      toast.success(`${selectedVehicles.length} veículos exportados em Excel!`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Erro ao gerar Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAllPDF = async () => {
    if (allVehicles.length === 0) {
      toast.error('Nenhum veículo encontrado');
      return;
    }

    setIsExporting(true);
    try {
      await generateBatchPDF(allVehicles);
      toast.success(`${allVehicles.length} veículos exportados em PDF!`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erro ao gerar PDF');
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
      exportToExcel(allVehicles);
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
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-gray-600">
            {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
          </p>
          {hasSelection && (
            <p className="text-xs text-blue-600">
              {selectedVehicles.length} {selectedVehicles.length === 1 ? 'selecionado' : 'selecionados'}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handleExportSelectedPDF}
          disabled={!hasSelection || isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          Exportar PDF (Selecionados)
        </Button>

        <Button
          variant="outline"
          onClick={handleExportSelectedExcel}
          disabled={!hasSelection || isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-4 h-4" />
          )}
          Exportar XLSX (Selecionados)
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" disabled={isExporting}>
              Exportar Todos
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportAllPDF}>
              <FileText className="w-4 h-4 mr-2" />
              PDF (Todos os resultados)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportAllExcel}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              XLSX (Todos os resultados)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
