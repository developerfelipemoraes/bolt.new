export interface PersonalData {
  fullName: string;
  cpf: string;
  birthDate: string;
  gender: 'Masculino' | 'Feminino' | 'Outro' | '';
  nationality: string;
  birthPlace: string;
  birthState: string;
  motherName: string;
  fatherName: string;
  maritalStatus: 'Solteiro(a)' | 'Casado(a)' | 'União estável' | 'Separado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | '';
  spouseName: string;
  spouseCpf: string;
  guardianName: string;
  guardianCpf: string;
}

export interface DocumentData {
  type: 'RG' | 'CNH' | 'RNE' | 'Outro' | '';
  number: string;
  issuer: string;
  issuerState: string;
  issueDate: string;
  expirationDate: string;
  attachmentName: string;
}

export interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  proofAttachment: string;
}

export interface ProfessionalData {
  education: string;
  occupation: string;
  company: string;
  companyStreet: string;
  companyNumber: string;
  companyNeighborhood: string;
  companyCity: string;
  companyState: string;
  companyZipCode: string;
  companyPhone: string;
  companyMobile: string;
  incomeProof: string;
}

export interface CorrespondencePreference {
  type: 'Residencial' | 'Comercial' | 'E-mail' | '';
}

export interface Asset {
  type: string;
  description: string;
  value: number;
}

export interface FinancialData {
  salary: number;
  otherIncome: number;
  totalIncome: number;
  assets: Asset[];
}

export interface BankAccount {
  bank: string;
  agency: string;
  account: string;
}

export interface BankingData {
  primaryAccount: BankAccount;
  secondaryAccount: BankAccount;
  isJointAccount: boolean;
  jointAccountHolderName: string;
  jointAccountHolderCpf: string;
  pixKey: string;
}

export interface ComplianceData {
  isPep: boolean;
  hasPepRelationship: boolean;
  pepName: string;
  pepCpf: string;
  relationshipPurpose: string;
  authorizeConsultations: boolean;
  declareAccuracy: boolean;
  commitToUpdate: boolean;
  coafAwareness: boolean;
}

export interface CompanyLink {
  companyName: string;
  role: 'Financeiro' | 'Fiscal' | 'Compras' | 'Comercial' | 'Responsável legal' | 'Procurador' | 'Sócio';
  isPrimary: boolean;
}

export interface ContactData {
  // Wizard steps
  personal: PersonalData;
  documents: DocumentData;
  address: Address;
  professional: ProfessionalData;
  correspondence: CorrespondencePreference;
  financial: FinancialData;
  banking: BankingData;
  compliance: ComplianceData;
  
  // Profile data
  completeness: number;
  kycScore: number;
  kycClassification: 'ok' | 'atenção' | 'alto risco';
  nextReview: string;
  pendencies: string[];
  companyLinks: CompanyLink[];
  createdAt: string;
  updatedAt: string;
}

export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];