import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FileText, DollarSign, ArrowLeftRight, Package, Wrench, ClipboardList, TrendingUp, ChartBar as BarChart3, MapPin, FolderTree, Armchair, Settings, Calculator, Tag, FileDown, Loader as Loader2 } from 'lucide-react';
import { NormalizedVehicle } from '../types';
import { ReportType, REPORT_CONFIGS } from '../types/reports';
import { generateReport } from '../libs/reports';
import { toast } from 'sonner';

interface ReportSelectorProps {
  selectedVehicles: NormalizedVehicle[];
  allVehicles: NormalizedVehicle[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  DollarSign,
  ArrowLeftRight,
  Package,
  Wrench,
  ClipboardList,
  TrendingUp,
  BarChart3,
  MapPin,
  FolderTree,
  Armchair,
  Settings,
  Calculator,
  Tag
};

export function ReportSelector({ selectedVehicles, allVehicles }: ReportSelectorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<ReportType | null>(null);

  const handleGenerateReport = async (type: ReportType) => {
    const config = REPORT_CONFIGS[type];

    if (config.requiresSelection && selectedVehicles.length === 0) {
      toast.error('Selecione pelo menos um veículo para este relatório');
      return;
    }

    if (config.maxVehicles && selectedVehicles.length > config.maxVehicles) {
      toast.error(`Este relatório aceita no máximo ${config.maxVehicles} veículos`);
      return;
    }

    const vehiclesToUse = config.requiresSelection ? selectedVehicles : allVehicles;

    if (vehiclesToUse.length === 0) {
      toast.error('Nenhum veículo disponível');
      return;
    }

    setIsGenerating(true);
    setGeneratingType(type);

    try {
      await generateReport(type, vehiclesToUse);
      toast.success(`Relatório "${config.name}" gerado com sucesso!`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(`Erro ao gerar relatório: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
    }
  };

  const categories = {
    commercial: 'Relatórios Comerciais',
    technical: 'Relatórios Técnicos',
    analytical: 'Relatórios Analíticos',
    specialized: 'Relatórios Especializados',
    financial: 'Relatórios Financeiros'
  };

  const groupedReports = Object.entries(categories).map(([category, label]) => ({
    category: category as keyof typeof categories,
    label,
    reports: Object.values(REPORT_CONFIGS).filter(r => r.category === category)
  }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" disabled={isGenerating} className="flex items-center gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Relatórios Profissionais
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[600px] overflow-y-auto">
        {groupedReports.map(({ category, label, reports }) => (
          <React.Fragment key={category}>
            <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase">
              {label}
            </DropdownMenuLabel>
            {reports.map(report => {
              const Icon = ICON_MAP[report.icon] || FileText;
              const isCurrentlyGenerating = generatingType === report.id;

              return (
                <DropdownMenuItem
                  key={report.id}
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isGenerating}
                  className="flex flex-col items-start py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    {isCurrentlyGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    ) : (
                      <Icon className="w-4 h-4 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{report.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{report.description}</div>
                    </div>
                  </div>
                  {report.requiresSelection && (
                    <div className="text-xs text-blue-600 mt-1 ml-6">
                      Requer seleção
                    </div>
                  )}
                  {report.maxVehicles && (
                    <div className="text-xs text-orange-600 mt-1 ml-6">
                      Máx. {report.maxVehicles} veículos
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
