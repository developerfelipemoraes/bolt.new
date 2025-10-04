// Core data types for CRM components
export interface ContactData {
  id?: string;
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cargo?: string;
  empresa?: string;
  departamento?: string;
}

export interface CompanyData {
  id?: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  segmento?: string;
  porte?: string;
  faturamento?: string;
  numeroFuncionarios?: string;
}

export interface MatchData {
  contact: ContactData;
  company: CompanyData;
  score: number;
  reasons: string[];
}

// Component prop types
export interface ContactWizardProps {
  onSubmit: (data: ContactData) => void;
  onCancel: () => void;
  initialData?: Partial<ContactData>;
  className?: string;
}

export interface CompanyWizardProps {
  onSubmit: (data: CompanyData) => void;
  onCancel: () => void;
  initialData?: Partial<CompanyData>;
  className?: string;
}

export interface ContactListProps {
  contacts: ContactData[];
  onEdit: (contact: ContactData) => void;
  onDelete: (contactId: string) => void;
  className?: string;
}

export interface CompanyListProps {
  companies: CompanyData[];
  onEdit: (company: CompanyData) => void;
  onDelete: (companyId: string) => void;
  className?: string;
}

export interface SmartMatchingProps {
  contacts: ContactData[];
  companies: CompanyData[];
  onMatchConfirmed: (matches: MatchData[]) => void;
  className?: string;
}

export interface CRMDashboardProps {
  contacts?: ContactData[];
  companies?: CompanyData[];
  matches?: MatchData[];
  onNewContact?: () => void;
  onNewCompany?: () => void;
  onStartMatching?: () => void;
  className?: string;
}