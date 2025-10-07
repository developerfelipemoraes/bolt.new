export type ReportType =
  | 'catalog'
  | 'commercial-proposal'
  | 'comparison'
  | 'availability'
  | 'technical-sheet'
  | 'maintenance-history'
  | 'market-analysis'
  | 'sales-performance'
  | 'inventory-location'
  | 'category-report'
  | 'seats-configuration'
  | 'optionals-equipment'
  | 'financial-analysis'
  | 'pricing-conditions';

export interface ReportConfig {
  id: ReportType;
  name: string;
  description: string;
  icon: string;
  category: 'commercial' | 'technical' | 'analytical' | 'specialized' | 'financial';
  requiresSelection: boolean;
  maxVehicles?: number;
  format: 'pdf' | 'xlsx' | 'both';
}

export interface ReportMetadata {
  title: string;
  subtitle?: string;
  companyName?: string;
  companyLogo?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  generatedBy?: string;
  validUntil?: Date;
  terms?: string;
}

export const REPORT_CONFIGS: Record<ReportType, ReportConfig> = {
  'catalog': {
    id: 'catalog',
    name: 'Catálogo Completo',
    description: 'Catálogo com fotos e especificações',
    icon: 'FileText',
    category: 'commercial',
    requiresSelection: false,
    format: 'pdf'
  },
  'commercial-proposal': {
    id: 'commercial-proposal',
    name: 'Proposta Comercial',
    description: 'Proposta profissional com preços e condições',
    icon: 'DollarSign',
    category: 'commercial',
    requiresSelection: true,
    format: 'pdf'
  },
  'comparison': {
    id: 'comparison',
    name: 'Comparativo de Veículos',
    description: 'Comparação lado a lado de até 4 veículos',
    icon: 'ArrowLeftRight',
    category: 'commercial',
    requiresSelection: true,
    maxVehicles: 4,
    format: 'pdf'
  },
  'availability': {
    id: 'availability',
    name: 'Disponibilidade de Estoque',
    description: 'Status e quantidade disponível',
    icon: 'Package',
    category: 'commercial',
    requiresSelection: false,
    format: 'both'
  },
  'technical-sheet': {
    id: 'technical-sheet',
    name: 'Ficha Técnica Detalhada',
    description: 'Especificações técnicas completas',
    icon: 'Wrench',
    category: 'technical',
    requiresSelection: true,
    format: 'pdf'
  },
  'maintenance-history': {
    id: 'maintenance-history',
    name: 'Histórico e Manutenção',
    description: 'Ano, condições e histórico',
    icon: 'ClipboardList',
    category: 'technical',
    requiresSelection: true,
    format: 'pdf'
  },
  'market-analysis': {
    id: 'market-analysis',
    name: 'Análise de Mercado',
    description: 'Distribuição de preços e tendências',
    icon: 'TrendingUp',
    category: 'analytical',
    requiresSelection: false,
    format: 'both'
  },
  'sales-performance': {
    id: 'sales-performance',
    name: 'Performance de Vendas',
    description: 'Métricas e estatísticas de vendas',
    icon: 'BarChart3',
    category: 'analytical',
    requiresSelection: false,
    format: 'both'
  },
  'inventory-location': {
    id: 'inventory-location',
    name: 'Inventário por Localização',
    description: 'Veículos agrupados por estado/cidade',
    icon: 'MapPin',
    category: 'analytical',
    requiresSelection: false,
    format: 'both'
  },
  'category-report': {
    id: 'category-report',
    name: 'Relatório por Categoria',
    description: 'Análise específica por tipo de veículo',
    icon: 'FolderTree',
    category: 'specialized',
    requiresSelection: false,
    format: 'both'
  },
  'seats-configuration': {
    id: 'seats-configuration',
    name: 'Configuração de Poltronas',
    description: 'Detalhamento de assentos e capacidade',
    icon: 'Armchair',
    category: 'specialized',
    requiresSelection: true,
    format: 'pdf'
  },
  'optionals-equipment': {
    id: 'optionals-equipment',
    name: 'Opcionais e Equipamentos',
    description: 'Lista completa de recursos e opcionais',
    icon: 'Settings',
    category: 'specialized',
    requiresSelection: true,
    format: 'both'
  },
  'financial-analysis': {
    id: 'financial-analysis',
    name: 'Análise Financeira',
    description: 'Valor total, ROI e simulações',
    icon: 'Calculator',
    category: 'financial',
    requiresSelection: true,
    format: 'pdf'
  },
  'pricing-conditions': {
    id: 'pricing-conditions',
    name: 'Preços e Condições',
    description: 'Tabela de preços e descontos',
    icon: 'Tag',
    category: 'financial',
    requiresSelection: false,
    format: 'both'
  }
};
